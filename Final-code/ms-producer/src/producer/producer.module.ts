import { forwardRef, Module } from '@nestjs/common';
import { ProducerController } from './producer.controller';
import { ProducerService } from './producer.service';
import { RabbitMQModule } from '../rabbitmq/rabbitmq.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    forwardRef(() => RabbitMQModule),
    HttpModule],
  controllers: [ProducerController],
  providers: [
    ProducerService,
  ],
  exports: [ProducerService],
})
export class ProducerModule {}