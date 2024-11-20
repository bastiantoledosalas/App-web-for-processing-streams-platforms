import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { SimulationsService } from './simulations.service';
import { CreateSimulationDto } from './dto/createSimulation.dto';

@Controller('simulations')  // EndPoint base para las simulaciones
export class SimulationsController {
  constructor(private readonly simulationsService: SimulationsService) {}

  // Crear una simulación, recibiendo datos JSON y devolver el JSON almacenado
  @Post()
  async create(@Body() createSimulationDto: CreateSimulationDto) {
    const simulation = await this.simulationsService.create(createSimulationDto);
    return {
      _id: simulation.simulation_id, // Incluye el ID generado automáticamente
      createSimulationDto, // Retorna el mismo formato de entrada
    };
  }

  // Obtener una simulación por ID y devolver el JSON
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const simulation = await this.simulationsService.findById(id);
    if (!simulation) {
      return { message: 'Simulación no encontrada' };
    }
    return simulation; // Retorna el JSON almacenado en MongoDB
  }

  // Obtener todas las simulaciones
  @Get()
  async findAll() {
    const simulations = await this.simulationsService.findAll();
    return simulations.map((simulation) => ({
      _id: simulation.simulation_id,
      name: simulation.name,
      description: simulation.description,
      nodes: simulation.nodes,
      edges: simulation.edges,
    }));
  }
}
