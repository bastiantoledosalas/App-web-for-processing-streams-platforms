import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { connect, Connection, Channel } from 'amqplib';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RabbitMQService implements OnModuleInit, OnModuleDestroy {
  private connection: Connection;
  private channel: Channel;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    const rabbitMQUrl = this.configService.get<string>('RABBITMQ_URL');
    this.connection = await connect(rabbitMQUrl);
    this.channel = await this.connection.createChannel();
    console.log('RabbitMQ Services Connected');
  }

  async publish(queue: string, message: string) {
    await this.channel.assertQueue(queue, { durable: true });
    this.channel.sendToQueue(queue, Buffer.from(message), { persistent: true });
  }

  async onModuleDestroy() {
    await this.channel.close();
    await this.connection.close();
  }
}
