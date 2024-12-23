import { CreateSimulationDto } from './dto/create-simulation.dto';
import { UpdateSimulationDto } from './dto/update-simulation.dto';
import { HttpService } from '@nestjs/axios';
import { StartSimulationDto } from './dto/start-simulation.dto';
export declare class SimulationsService {
    private readonly httpService;
    private readonly baseUrl;
    private readonly simulateStartUrl;
    constructor(httpService: HttpService);
    create(createSimulationDto: CreateSimulationDto, userId: string): Promise<any>;
    findAll(user_id: string): Promise<any>;
    findOne(id: string): Promise<any>;
    update(id: string, updateSimulationDto: UpdateSimulationDto): Promise<any>;
    remove(id: string): Promise<any>;
    start(id: string, startSimulationDto: StartSimulationDto): Promise<any>;
}
