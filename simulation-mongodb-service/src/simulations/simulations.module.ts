import { Module } from '@nestjs/common';
import { SimulationsService } from './simulations.service';
import { SimulationsController } from './simulations.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Simulation, SimulationSchema } from './schema/simulation.schema';
import { RabbitMQModule } from '../rabbitmq/rabbitmq.module';  // Importamos el RabbitMQModule

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Simulation.name, schema: SimulationSchema }]),
    RabbitMQModule
  ],
  controllers: [SimulationsController],
  providers: [SimulationsService],
  exports:  [SimulationsService]
})
export class SimulationsModule {}
