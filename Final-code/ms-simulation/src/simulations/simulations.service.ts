import { HttpException, HttpStatus, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateSimulationDto } from './dto/create-simulation.dto';
import { UpdateSimulationDto } from './dto/update-simulation.dto';
import { Simulation } from './entities/simulation.entity';
import { SimulationStatus } from './entities/simulationstatus';

@Injectable()
export class SimulationsService {

  private readonly logger = new Logger(SimulationsService.name);
  
  constructor(
    @InjectModel(Simulation.name)
    private readonly simulationModel: Model<Simulation>,
  ) {}

  async create(createSimulationDto: CreateSimulationDto): Promise<Simulation> {
    const createdSimulation = new this.simulationModel({
      ...createSimulationDto,
      status: SimulationStatus.Created,                 // Establecer el estado por defecto como 'created'
    });
    return createdSimulation.save();
  }

  async findAllSimulations(): Promise<Simulation[]> {
    return this.simulationModel.find().exec();
  }


  async findOne(id: string): Promise<Simulation> {
    const simulation = await this.simulationModel.findById(id).exec();
    if (!simulation) {
      throw new NotFoundException(`Simulation #${id} not found`);
    }
    return simulation;
  }

  async update(
    id: string,
    updateSimulationDto: UpdateSimulationDto,
  ): Promise<any> {
    try{
    const result = await this.simulationModel
      .findByIdAndUpdate(
        id,
        { ...updateSimulationDto, status: 'updated' },
        { new: true },
      )
      .exec();

    if (!result) {
      throw new HttpException('Simulación no encontrada', HttpStatus.NOT_FOUND);
    }
    // Si la actualización fue exitosa, retornamos un mensaje de éxito con HttpStatus.OK
    this.logger.log(`Simulación con ID ${id} actualizada correctamente.`);

    return { message: 'Simulación actualizada correctamente'};
  } catch(error) {
    throw new HttpException(`Error al actualizar la simulación: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
  async remove(id: string): Promise<void> {
    const result = await this.simulationModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Simulation #${id} not found`);
    }
  }

  async updateSimulationStatus(simulationId: string, newStatus: string): Promise<void> {
    try {
      // Validación del estado de simulación
      if(!Object.values(SimulationStatus).includes(newStatus as SimulationStatus)){
        throw new HttpException(
          `Invalid status value: ${newStatus}. Valid values are: ${Object.values(SimulationStatus).join(', ')}`,
          HttpStatus.BAD_REQUEST,
        );
      }

      // Busca la simulación en la base de datos
      const simulation = await this.simulationModel.findOne({ _id: simulationId}).exec();
      if(!simulation){
        throw new HttpException(`Simulation not found: ${simulationId}`, HttpStatus.NOT_FOUND);
      }

      // Actualización del estado de la simulación
      simulation.status = newStatus as SimulationStatus;
      await simulation.save();

      // Log de éxito
      this.logger.log(`Simulation ${simulationId} status updated to ${newStatus}`);

    } catch (error) {
        // Manejo de errores
        this.logger.error(`Error updating simulation status for ${simulationId}: ${error.message}`);
        throw new HttpException(
          `Error updating simulation state: ${error.message}`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
    }
  }

  async findByUser(email: string): Promise<Simulation[]> {
      return this.simulationModel.find({where: {user:email}});
  }

  async updateSimulationResults(simulationId: string, results: any): Promise<void> {
    console.log('RESULTS INPUT:', JSON.stringify(results, null, 2));
    try {
      const simulation = await this.simulationModel.findOne({ _id: simulationId}).exec();
      if(!simulation){
        throw new HttpException(`Simulation not found: ${simulationId}`, HttpStatus.NOT_FOUND);
      }

      simulation.results = results.results;

      console.log('Simulation:', JSON.stringify(simulation.results, null, 2));
      await simulation.save();

       this.logger.log(`Simulation ${simulationId} results updated`);
    } catch (error){
      
      throw new HttpException(
        `Error updating simulation results: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }
}
