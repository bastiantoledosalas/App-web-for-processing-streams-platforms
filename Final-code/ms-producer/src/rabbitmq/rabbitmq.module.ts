import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RabbitMQService } from './rabbitmq.service';
import { RabbitMQConfig } from './rabbitmq.config';
import { ProducerModule } from 'src/producer/producer.module';

@Module({
  imports: [
    ConfigModule,
    forwardRef(() => ProducerModule)
  ],
  providers: [
    RabbitMQConfig,         // Proveedor que contiene la configuración de RabbitMQ
    RabbitMQService,        // Proveedor que usa la configuración para realizar operaciones sobre RabbitMQ 
  ],
  exports: [
    RabbitMQService,      // Exportamos el servicio para otros módulos
  ],
})

export class RabbitMQModule {}
