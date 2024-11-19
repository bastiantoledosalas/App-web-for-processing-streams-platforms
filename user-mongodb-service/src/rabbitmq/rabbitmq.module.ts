import { Module } from '@nestjs/common';
import { RabbitMQService } from './rabbitmq.service';

@Module({
  providers: [RabbitMQService],
  exports: [RabbitMQService], // Exporta el servicio para que otros módulos puedan usarlo
})
export class RabbitMQModule {}