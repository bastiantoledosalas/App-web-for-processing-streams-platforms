import { Controller, Body, Post, Logger, BadRequestException, HttpException, HttpStatus, Param, UsePipes, ValidationPipe } from '@nestjs/common';
import { ProducerService } from './producer.service';
import { SimulationStartDto } from 'src/entity/dto/simulation-start.dto';
import { ValidatedSimulationDto } from 'src/entity/dto/simulation.dto';

@Controller('producer')

export class ProducerController {

  private readonly logger = new Logger(ProducerController.name);
  
  constructor(
    private readonly producerService: ProducerService,    // Servicio para manejar las simulaciones
    
  ){}

  // Inicia el proceso de simulación encolando los datos de una simulación creada
  @Post(':id/start')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async startSimulation(
    @Param('id') id: string,
    @Body('simulationData')       simulationData    : ValidatedSimulationDto,
    @Body ('startSimulationDto')  startSimulationDto: SimulationStartDto)
    {
    return this.producerService.startSimulation(simulationData, startSimulationDto);
    }
}