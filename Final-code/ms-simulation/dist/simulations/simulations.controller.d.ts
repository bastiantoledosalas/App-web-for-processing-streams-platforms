import { SimulationsService } from './simulations.service';
import { CreateSimulationDto } from './dto/create-simulation.dto';
import { UpdateSimulationDto } from './dto/update-simulation.dto';
export declare class SimulationsController {
    private readonly simulationsService;
    constructor(simulationsService: SimulationsService);
    create(createSimulationDto: CreateSimulationDto): Promise<import("./entities/simulation.entity").Simulation>;
    findAll(userId: string): Promise<import("./entities/simulation.entity").Simulation[]>;
    findOne(id: string): Promise<import("./entities/simulation.entity").Simulation>;
    update(id: string, updateSimulationDto: UpdateSimulationDto): Promise<import("./entities/simulation.entity").Simulation>;
    remove(id: string): Promise<void>;
}
