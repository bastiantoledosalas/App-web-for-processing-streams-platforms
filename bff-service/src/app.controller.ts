import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { SimulationProcessor } from './simulation.processor';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ClientsModule.registerAsync([
      {
        name: 'SIMULATION_QUEUE',
        useFactory: () => ({
          transport: Transport.RMQ,
          options: {
            urls: [process.env.RABBITMQ_URL || 'amqp://admin:admin@rabbitmq:5672'],
            queue: 'simulation_queue',
            queueOptions: { durable: true },
          },
        }),
      },
    ]),
  ],
  controllers: [],
  providers: [SimulationProcessor],
})
export class AppModule {}
