import { SimulationsService } from './simulations.service';
import { CreateSimulationDto } from './dto/create-simulation.dto';
import { UpdateSimulationDto } from './dto/update-simulation.dto';
import { StartSimulationDto } from './dto/start-simulation.dto';
export declare class SimulationsController {
    private readonly simulationsService;
    constructor(simulationsService: SimulationsService);
    create(createSimulationDto: CreateSimulationDto, user: any): Promise<any>;
    findAll(user: any): Promise<any>;
    findOne(id: string): Promise<any>;
    update(id: string, updateSimulationDto: UpdateSimulationDto): Promise<any>;
    remove(id: string): Promise<any>;
    start(id: string, startSimulationDto: StartSimulationDto): Promise<any>;
}
