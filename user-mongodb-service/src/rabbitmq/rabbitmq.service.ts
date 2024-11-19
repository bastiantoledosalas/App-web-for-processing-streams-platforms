import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { connect, Connection, Channel } from 'amqplib';

@Injectable()
export class RabbitMQService implements OnModuleInit, OnModuleDestroy {
  private connection: Connection;
  private channel: Channel;

  // conexión a RabbitMQ
  async onModuleInit() {
    try{
      this.connection = await connect(process.env.RABBITMQ_URL); // Nombre del servicio en Docker al que se conecta RabbitMQ
      this.channel = await this.connection.createChannel();
      console.log('Conexión a RabbitMQ establecida');
    } catch(error){
      console.error('Falla al conectar a RabbitMQ',error);
    }
  }

  // Método para publicar un mensaje en una cola
  async publish(queue: string, message: string) {
    await this.channel.assertQueue(queue, { durable: true });
    this.channel.sendToQueue(queue, Buffer.from(message), { persistent: true });
    console.log(`Mensaje publicado en la cola ${queue}`);
  }

  // Cierra la conexión cuando el servicio se destruye
  async onModuleDestroy() {
    await this.channel.close();
    await this.connection.close();
    console.log('Conexión a RabbitMQ cerrada');
  }
}