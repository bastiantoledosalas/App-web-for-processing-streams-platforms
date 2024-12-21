import { Injectable, Logger, OnApplicationShutdown, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import * as amqp from 'amqplib';
import { RabbitMQConfig } from './rabbitmq.config';
import { ProcessingService } from 'src/processing/processing.service';

@Injectable()
export class RabbitMQService implements OnModuleInit, OnModuleDestroy , OnApplicationShutdown {
  private connection    : amqp.Connection | null = null;  // Usar amqplib
  private channel       : amqp.Channel    | null = null;  // Canal para la cola RabbitMQ
  private checkInterval : NodeJS.Timeout  | null = null;  

  private isReconnecting: boolean = false;  // Indicador para evitar reconexiones simultáneas
  private isConnected   : boolean = false;  // Indicador de conexión activa
  private isConsuming   : boolean = false;  // Indicador de consumo activo

  private readonly logger       =   new Logger(RabbitMQService.name);

  constructor(
    private readonly config             : RabbitMQConfig,
    private readonly procesingService   : ProcessingService, 
  ) {}

  async onModuleInit(): Promise<void> {
    this.logger.log('Initializing RabbitMQ connection...');

    // Intentamos establecer la conexión, si falla, seguimos chequeando
    await this.initializeRabbitMQConnection();

    // Inicia el chequeo periodico de la conexión
    this.startConnectionCheck();

  }

  async onModuleDestroy(): Promise<void> {
    this.logger.log('Stopping RabbitMQ connection check...');
      this.stopConnectionCheck();
      await this.disconnectRabbitMQ();
  }
  
  // Método llamado cuando la aplicación NestJS esta siendo apagada
  async onApplicationShutdown(): Promise<void> {
    this.logger.log('Consumer Service shutting down, closing RabbitMQ connection...');
    await this.disconnectRabbitMQ();
  }

  private stopConnectionCheck(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.logger.log('Periodic RabbitMQ connection check stopped.');
      this.checkInterval = null;
    }
  }

  private async disconnectRabbitMQ(): Promise<void> {
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
    } finally{
      this.connection   = null;
      this.channel      = null;
      this.isConnected  = false;
    }
  }

  private async checkConnection(): Promise<void>{
      if (this.isReconnecting) {
        this.logger.warn('Reconnection attempt already in progress');
        return;
      }

      if(!this.isConnected) {
        this.isReconnecting = true;
        this.logger.warn('RabbitMQ connection is not active. Attempting to reconnect...');

        try {
          await this.initializeRabbitMQConnection();
        } catch (error) {
          this.logger.error(`Reconnection to RabbitMQ failed: ${error.message}`);
          this.isConnected  = false;
        } finally {
          this.isReconnecting = false;
        }
      } else {
        const isChannelOpen     = this.channel && !this.channel.closed;
        const isConnectionOpen  = this.connection && this.connection.connection.stream.readable;
        if (isChannelOpen && isConnectionOpen) {
          this.logger.debug('RabbitMQ Connection is active');
        } else {
          this.logger.warn('RabbitMQ connection or channel is no longer active. Marking as disconnected.');
          this.isConnected = false;
        }
    }
  }

  private startConnectionCheck(): void{
    const intervalMs = 30000; // Verificación cada 30 segundos
    this.logger.log(`Starting periodic RabbitMQ connection check (every ${intervalMs / 1000} seconds).`);

    this.checkInterval  = setInterval(async () =>{ await this.checkConnection() }, intervalMs);
  }

  private async initializeRabbitMQConnection(): Promise<void>{
    const url= this.config.getUrl();

    try{
      this.logger.log('Connecting to RabbitMQ...');
      this.connection   = await amqp.connect(url);
      this.channel      = await this.connection.createChannel();
      this.isConnected  = true;
      this.isConsuming  = false;  // Resetear flag de consumo
      this.logger.log('RabbitMQ Connection and Channel successfully initialized');

      // Configura el prefetch para consumir mensajes uno a la vez
      await this.channel.prefetch(1);
      
      // Reinicia el consumo de mensajes
      await this.consumeMessages();

    } catch (error) {
      this.isConnected = false;
      this.isConsuming = false;
      this.logger.error(`Failed to initialize RabbitMQ connection: ${error.message}`, error);
    }
  }

  private async consumeMessages(): Promise<void> {
    if(!this.isConnected){
      this.logger.warn('RabbitMQ connection is not active. Skipping message consumption.');
      return; // Si no hay conexión activa, no consumimos mensajes
    }

    if (this.isConsuming){
      this.logger.debug('Message consumption is already active.');
    }
    this.isConsuming = true;
    this.logger.log('Starting to consume messages...');

    try {
      // Se obtiene el nombre de la cola principal de RabbitMQ
      const queue = this.config.getQueue();

      // Aseguramos que la cola existe y es duradera
      //await this.channel.assertQueue(queue, {durable: true});
      
      this.channel.consume(queue, async (message) => {
        if (message){
          this.logger.log('Message received. Processing...');
          const parsedMessage = JSON.parse(message.content.toString());

          this.logger.debug('Parsed message:', parsedMessage);

          // Primero, enviamos el ACK a RabbitMQ para confirmar que el mensaje ha sido recibido correctamente
          this.channel.ack(message);
          this.logger.log('ACK sent for message');

          try {
            await this.procesingService.processMessage(parsedMessage);
          } catch (processingError) {
            this.logger.error('Error during message processing:', processingError);
          }
        }
      });
    } catch (error) {
      this.logger.error(`Error during message consumption: ${error.message}`);
      this.isConsuming  = false;
    }
  }
}