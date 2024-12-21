import { Module } from '@nestjs/common';
import { ProducerModule } from './producer/producer.module';
import { RabbitMQModule } from './rabbitmq/rabbitmq.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    // Configuración Global
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // Modulos principales
    ProducerModule,     // Servicio para el envio de simulaciones a RabbitMQ
    RabbitMQModule,     // Configuración de RabbitMQ
  ],
  providers: [],
})

export class AppModule {}
