import { Model } from 'mongoose';
import { CreateSimulationDto } from './dto/create-simulation.dto';
import { UpdateSimulationDto } from './dto/update-simulation.dto';
import { Simulation } from './entities/simulation.entity';
export declare class SimulationsService {
    private readonly simulationModel;
    constructor(simulationModel: Model<Simulation>);
    create(createSimulationDto: CreateSimulationDto): Promise<Simulation>;
    findAll(userId: string): Promise<Simulation[]>;
    findOne(id: string): Promise<Simulation>;
    update(id: string, updateSimulationDto: UpdateSimulationDto): Promise<Simulation>;
    remove(id: string): Promise<void>;
}
