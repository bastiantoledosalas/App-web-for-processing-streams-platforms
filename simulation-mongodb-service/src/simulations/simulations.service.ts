import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Simulation } from './schema/simulation.schema';
import { CreateSimulationDto } from './dto/createSimulation.dto';

@Injectable()
export class SimulationsService {
  constructor(
    @InjectModel(Simulation.name) private simulationModel: Model<Simulation>,
  ) {}

  // Crear y retornar el JSON almacenado
  async create(createSimulationDto: CreateSimulationDto): Promise<Simulation> {
    const createdSimulation = new this.simulationModel(createSimulationDto);
    return await createdSimulation.save();
  }

  // Buscar por ID para devolver el mismo JSON
  async findById(id: string): Promise<Simulation> {
    return this.simulationModel.findById(id).exec();
  }

  // Retornar todas las simulaciones (si fuera necesario)
  async findAll(): Promise<Simulation[]> {
    return this.simulationModel.find().exec();
  }
}
