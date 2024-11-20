import { Controller, Post, Body, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller('simulations')
export class SimulationsController {
  constructor(
    @Inject('SIMULATION_QUEUE') private readonly simulationClient: ClientProxy,
  ) {}

  @Post()
  async createSimulation(@Body() simulationData: any): Promise<string> {
    try {
      // Publicar mensaje en RabbitMQ
      this.simulationClient.emit('create_simulation', simulationData);
      return 'Simulation creation request sent successfully!';
    } catch (error) {
      throw new Error(`Failed to publish simulation message: ${error.message}`);
    }
  }
}
