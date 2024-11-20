import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { SimulationsController } from './simulations/simulations.controller';
import { UsersController } from './users/users.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    // Configuración de RabbitMQ para múltiples colas
    ClientsModule.registerAsync([
      {
        name: 'SIMULATION_QUEUE',
        useFactory: () => ({
          transport: Transport.RMQ,
          options: {
            urls: [process.env.RABBITMQ_URL],
            queue: 'simulation_queue',
            queueOptions: { durable: true },
          },
        }),
      },
      {
        name: 'USER_QUEUE',
        useFactory: () => ({
          transport: Transport.RMQ,
          options: {
            urls: [process.env.RABBITMQ_URL],
            queue: 'user_queue',
            queueOptions: { durable: true },
          },
        }),
      },
      {
        name: 'RESULTS_QUEUE',
        useFactory: () => ({
          transport: Transport.RMQ,
          options: {
            urls: [process.env.RABBITMQ_URL],
            queue: 'results_queue',
            queueOptions: { durable: true},
          }
        })
      }
    ]),
  ],
  controllers: [SimulationsController, UsersController],
})
export class AppModule {}