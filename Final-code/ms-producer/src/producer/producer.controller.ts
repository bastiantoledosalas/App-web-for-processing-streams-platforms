import { Controller, Body, Post, Logger, Param, UsePipes, ValidationPipe } from '@nestjs/common';
import { ProducerService } from './producer.service';
import { SimulationStartDto } from 'src/entity/dto/simulation-start.dto';
import { ValidatedSimulationDto } from 'src/entity/dto/simulation.dto';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiResponse, getSchemaPath } from '@nestjs/swagger';

/**
 * Controlador para gestionar la creación y manejo de simulaciones.
 */
@ApiTags('Producer')
@Controller('producer')
export class ProducerController {

  private readonly logger = new Logger(ProducerController.name);
  
  constructor(
    private readonly producerService: ProducerService,    // Servicio para manejar las simulaciones
    
  ){}

  @ApiOperation({ summary: 'Inicia el proceso de simulación', description: 'Encola los datos de simulación y comienza el proceso de simulación.' })
  @ApiParam({ name: 'id', description: 'ID de la simulación a iniciar', type: String })

  @ApiResponse({ status: 200, description: 'Simulación iniciada con éxito' })
  @ApiResponse({ status: 400, description: 'Error en los datos de entrada' })
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