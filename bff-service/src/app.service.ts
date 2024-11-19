import { Injectable } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';

@Injectable()
export class AppService {
  private client: ClientProxy;

  constructor() {
    // Configura el cliente para conectarse a RabbitMQ
    this.client = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL],   // Co
        queue: 'user_service_queue',        // La cola que el servicio de usuarios escuchará
        queueOptions: {
          durable: false,
        },
      },
    });
  }

  async sendUserCreationMessage(userData: any) {
    // Envía un mensaje a la cola de RabbitMQ
    return this.client.emit('create_user', userData).toPromise();
  }
}
