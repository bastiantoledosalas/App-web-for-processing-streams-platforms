import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { SimulationsService } from './simulations.service';
import { CreateSimulationDto } from './dto/create-simulation.dto';
import { UpdateSimulationDto } from './dto/update-simulation.dto';
import { Simulation } from './entities/simulation.entity';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('Simulations')
@Controller('simulations')
export class SimulationsController {
  constructor(private readonly simulationsService: SimulationsService) {}

  @ApiOperation({ summary: 'Crear una nueva simulación' })
  @ApiResponse({ status: 201, description: 'Simulación creada correctamente', type: Simulation })
  @Post()
  async create(
    @Body() createSimulationDto: CreateSimulationDto) {
    return this.simulationsService.create(createSimulationDto);
  }

  @ApiOperation({ summary: 'Obtener todas las simulaciones' })
  @ApiResponse({ status: 200, description: 'Listado de todas las simulaciones', type: [Simulation] })
  @Get('all')
  async findAllSimulations(): Promise <Simulation[]>{
    return this.simulationsService.findAllSimulations();
  }
  
  @ApiOperation({ summary: 'Obtener una simulación por su id' })
  @ApiParam({ name: 'id', description: 'ID de la simulación', type: String })
  @ApiResponse({ status: 200, description: 'Simulación encontrada', type: Simulation })
  @ApiResponse({ status: 404, description: 'Simulación no encontrada' })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Simulation> {
    return this.simulationsService.findOne(id);
  }

  
  @ApiOperation({ summary: 'Actualizar los datos de una simulación' })
  @ApiParam({ name: 'id', description: 'ID de la simulación', type: String })
  @ApiResponse({ status: 200, description: 'Simulación actualizada', type: Simulation })
  @ApiResponse({ status: 404, description: 'Simulación no encontrada' })
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateSimulationDto: UpdateSimulationDto,
  ): Promise<Simulation> {
    return this.simulationsService.update(id, updateSimulationDto);
  }

  @ApiOperation({ summary: 'Eliminar una simulación' })
  @ApiParam({ name: 'id', description: 'ID de la simulación a eliminar', type: String })
  @ApiResponse({ status: 200, description: 'Simulación eliminada correctamente' })
  @ApiResponse({ status: 404, description: 'Simulación no encontrada' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.simulationsService.remove(id);
  }

  @ApiOperation({ summary: 'Actualizar el estado de una simulación' })
  @ApiParam({ name: 'id', description: 'ID de la simulación', type: String })
  @ApiResponse({ status: 200, description: 'Estado de la simulación actualizado' })
  @Patch(':id/status')
  async updateSimulationStatus(
    @Param('id')  id          : string,
    @Body('status') newStatus : string,
  ): Promise<any>{
    return this.simulationsService.updateSimulationStatus(id, newStatus);
  }

  @ApiOperation({ summary: 'Obtener todas las simulaciones de un usuario' })
  @ApiParam({ name: 'email', description: 'Correo electrónico del usuario', type: String })
  @ApiResponse({ status: 200, description: 'Listado de simulaciones del usuario', type: [Simulation] })
  @Get(':email')
  async findAll(@Param('email') email: string) {
    return this.simulationsService.findByUser(email);
   }
 

  @ApiOperation({ summary: 'Actualizar los resultados de una simulación' })
  @ApiParam({ name: 'id', description: 'ID de la simulación', type: String })
  @ApiResponse({ status: 200, description: 'Resultados de la simulación actualizados' })
  @Patch(':id/results')
  async updateResults(
    @Param('id') id : string,
    @Body() results: any,
  ): Promise<any>{
    console.log('Received results for simulation:',results);
    return this.simulationsService.updateSimulationResults(id, results);
  }  
}
