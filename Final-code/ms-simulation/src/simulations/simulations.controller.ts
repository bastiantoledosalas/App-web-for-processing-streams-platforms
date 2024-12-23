import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  Query,
} from '@nestjs/common';
import { SimulationsService } from './simulations.service';
import { CreateSimulationDto } from './dto/create-simulation.dto';
import { UpdateSimulationDto } from './dto/update-simulation.dto';
import { Simulation } from './entities/simulation.entity';

@Controller('simulations')
export class SimulationsController {
  constructor(private readonly simulationsService: SimulationsService) {}

  // Endpoint para crear una simulación y se enlaza el id del usuario que la crea
  @Post()
  async create(
    @Body() createSimulationDto: CreateSimulationDto) {
    return this.simulationsService.create(createSimulationDto);
  }

  // Endpoint para obtener todas las simulaciones
  @Get('all')
  async findAllSimulations(): Promise <Simulation[]>{
    return this.simulationsService.findAllSimulations();
  }
  // Endpoint para obtener una simulación por su id
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Simulation> {
    return this.simulationsService.findOne(id);
  }

  // Endpoint para actualizar los datos de una simulación antes de mandarla a simular
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateSimulationDto: UpdateSimulationDto,
  ) {
    return this.simulationsService.update(id, updateSimulationDto);
  }

  // Endpoint para eliminar una simulación 
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.simulationsService.remove(id);
  }

  // Endpoint para actualizar el estado de una simulación
  @Patch(':id/status')
  async updateSimulationStatus(
    @Param('id')  id          : string,
    @Body('status') newStatus : string,
  ): Promise<any>{
    return this.simulationsService.updateSimulationStatus(id, newStatus);
  }

   // Endpoint para obtener todas las simulaciones de un usuario
   @Get(':email')
   async findAll(@Param('email') email: string) {
     return this.simulationsService.findByUser(email);
   }
 

  // Endpoint para actualizar los resultados de una simulación
  @Patch(':id/results')
  async updateResults(
    @Param('id') id : string,
    @Body() results: any,
  ): Promise<any>{
    console.log('Received results for simulation:',results);
    return this.simulationsService.updateSimulationResults(id, results);
  } 

   
}
