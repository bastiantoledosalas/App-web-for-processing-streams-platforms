import { Module } from '@nestjs/common';
import { RabbitMQService } from './rabbitmq.service';

@Module({
  providers: [RabbitMQService],
  exports: [RabbitMQService],   //Se exporta este servicio en caso de ser necesario por otros modulos
})
export class RabbitMQModule {}
