import { HttpException, HttpStatus, Inject, Injectable, InternalServerErrorException, Logger, OnModuleDestroy, OnModuleInit, forwardRef} from '@nestjs/common';
import { RabbitMQConfig } from './rabbitmq.config';
import * as amqp from 'amqplib';
import { ProducerService } from 'src/producer/producer.service';
import { SimulationStatus } from 'src/entity/dto/simulationstatus';

@Injectable()
export class RabbitMQService implements OnModuleInit, OnModuleDestroy{
  private channel       :   amqp.ConfirmChannel;
  private connection    :   amqp.Connection;      // Usar amqplib
  private checkInterval :   NodeJS.Timeout;   

  private isConnected   : boolean = false;  // Indicador de conexión activa

  private readonly logger       =   new Logger(RabbitMQService.name);

  constructor(
    @Inject(forwardRef(() => ProducerService))
    private readonly producerService: ProducerService,
    private readonly config         : RabbitMQConfig,
  ) {}


  async onModuleInit() {
    this.logger.log('Initializing RabbitMQ connection...');
    await this.initializeRabbitMQConnection();
    this.startConnectionCheck();      
  }

  async onModuleDestroy(): Promise<void> {
    this.logger.log('Stopping RabbitMQ connection check...');
    this.stopConnectionCheck();
    await this.disconnectRabbitMQ();
  }

  private async initializeRabbitMQConnection(): Promise<void>{   
    const url                   = this.config.getUrl();
    const Queue                 = this.config.getQueue();
    const QueueOptions          = this.config.getQueueOptions();
    const DeadLetterExchange    = this.config.getDeadLetterExchange();
    const DeadLetterRountingKey = this.config.getDeadLetterRoutingKey();

    // Limpiar conexiones y canales previos antes de intentar reconectar
    await this.disconnectRabbitMQ();
    try{
      this.logger.log('Connecting to RabbitMQ...');
      
      this.connection = await amqp.connect(url);

       // Configurar eventos de conexión
      this.connection.on('close', () => this.handleConnectionClose());
      this.connection.on('error', (err) => this.handleConnectionError(err));

      this.channel    = await this.connection.createConfirmChannel();
      this.isConnected  = true;
      
       // Declarar la cola principal
      await this.channel.assertQueue(Queue, QueueOptions);

      // Configurar DLQ si aplica
      
      if (DeadLetterExchange && DeadLetterRountingKey) {
        await this.channel.assertExchange(DeadLetterExchange, 'direct', { durable: true});
        await this.channel.assertQueue(DeadLetterRountingKey, { durable: true, autoDelete: false});
        await this.channel.bindQueue(DeadLetterRountingKey, DeadLetterExchange, DeadLetterRountingKey);
        this.logger.log(`Configured DLQ with exchange "${DeadLetterExchange}" and routing key "${DeadLetterRountingKey}"`);
      }

      // Consumir DLQ
      await this.consumeDLQOnStart();
      this.logger.log('RabbitMQ connection initialized successfully');
    } catch (error) {
      this.isConnected = false;
      this.logger.error(`Failed to initialize RabbitMQ connection: ${error.message}`);
      await this.reconnectWithDelay(); // Reintentar conexión
    }
  }

  async publishMessage(message: any): Promise<void> {
    if (!this.isConnected || !this.channel) {
      throw new InternalServerErrorException('RabbitMQ is not connected');
    }
    const queue           = this.config.getQueue();
    const QueueOptions    = this.config.getQueueOptions();
    const messageBuffer   = Buffer.from(JSON.stringify(message));

    try {
      await this.channel.assertQueue(queue, QueueOptions); // Asegurar que la cola existe
      await new Promise<void>((resolve, reject) => {
        this.channel.sendToQueue(queue, messageBuffer, { persistent: true }, (err) => {
          if (err) {
            return reject(new Error(`Failed to publish message: ${err.message}`));
          }
        });

        // Confirmación de RabbitMQ
        this.channel.waitForConfirms().then(() => resolve()).catch(reject); // Rechazar si no se confirma
      });

      // Actualizar el estado a 'enqueued' después de confirmar el envío
      await this.producerService.updateSimulationStatus(message._id, SimulationStatus.Enqueued);
      this.logger.log(`Message successfully published to queue "${queue}": ${JSON.stringify(message)}`);

    } catch (error) {
      this.logger.error(`Error publishing message: ${error.message}`);
      throw new InternalServerErrorException(`Failed to publish message: ${error.message}`);
    }
  }

  private async consumeDLQOnStart(): Promise<void> {
    const dlqRoutingKey = this.config.getDeadLetterRoutingKey();
    if (!dlqRoutingKey || !this.channel) {
      this.logger.error('DLQ no properly configured');
      throw new HttpException('Dead Letter Queue (DLQ) is not properly configured. Please ensure that the DLQ and routing key are set up.', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    this.channel.consume(dlqRoutingKey, async (msg) => {
      if(msg) {
        const content  = JSON.parse(msg.content.toString());
        this.logger.warn(`Processing message from DLQ: ${JSON.stringify(content )}`);
        
        try{
        await this.processFailedMessage(content );
        this.channel.ack(msg);
        }catch (error) {
          this.logger.error(`Failed to process DLQ message: ${error.message}`);
        }
      }
    });
  }

  private async processFailedMessage(message: any): Promise<void> {
    try {
      await this.producerService.updateSimulationStatus(message._id, SimulationStatus.Failed);
      this.logger.log(`Simulation ${message._id} marked as Failed successfully.`);
    } catch (error) {
      this.logger.error(`Failed to update simulation status to Failed: ${error.message}`);
      throw new Error(`Failed to update simulation status: ${error.message}`); // Lanza un error si algo sale mal
    }
  }

  private async handleConnectionClose(): Promise<void> {
    if (this.isConnected) {
      this.logger.warn('RabbitMQ connection closed. Attempting to reconnect...');
      this.isConnected  = false;
      await this.reconnectWithDelay();
    }
  }

  private async handleConnectionError(error: any): Promise<void> {
    this.isConnected  = false;
    this.logger.error(`RabbitMQ connection error: ${error.message}`);
    await this.reconnectWithDelay();
  }

  private async reconnectWithDelay(delay = 60000) {
    if (this.isConnected){
      this.logger.log('Connection already established, skipping reconnection attempt');
      return;
    }
    this.logger.warn(`Reconnecting to RabbitMQ in ${delay / 1000} seconds...`);
    setTimeout(async () => {
      if (!this.isConnected) {
          await this.initializeRabbitMQConnection();
       }
    }, delay);
  }

  private startConnectionCheck(interval = 60000): void{
    this.checkInterval = setInterval(() => {
        if (!this.isConnected){
          this.logger.warn('RabbitMQ is disconnected. Attempting to recconect...');
          this.initializeRabbitMQConnection();
        } 
    }, interval);
  }

  private stopConnectionCheck() {
    if ( this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  private async disconnectRabbitMQ() {
    try {
      if (this.channel){
        await this.channel.close();
        this.logger.log('RabbitMQ Channel closed');
      }
      if (this.connection){
        await this.connection.close();
        this.logger.log('RabbitMQ Connection closed');
      }
    } catch (error) {
      this.logger.log(`Error while disconnecting RabbitMQ: ${error.message}`);
    } finally {
      this.connection = null;
      this.channel    = null;
      this.isConnected = false;
    }
  }  
}