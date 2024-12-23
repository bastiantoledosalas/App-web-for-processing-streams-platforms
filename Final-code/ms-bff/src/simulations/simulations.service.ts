import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateSimulationDto } from './dto/create-simulation.dto';
import { UpdateSimulationDto } from './dto/update-simulation.dto';
import { HttpService } from '@nestjs/axios';
import { endWith, lastValueFrom } from 'rxjs';
import { StartSimulationDto } from './dto/start-simulation.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SimulationsService {

  private readonly baseUrl          : string;
  private readonly producerBaseUrl  : string;
  private readonly logger = new Logger(SimulationsService.name);

  constructor(
    private readonly httpService  : HttpService,
    private readonly configService: ConfigService,
  ) {
    this.baseUrl          = this.configService.get<string>('SIMULATIONS_SERVICE_URL');
    this.producerBaseUrl = this.configService.get<string>('PRODUCER_SERVICE_URL');
  }

  async create(createSimulationDto: CreateSimulationDto, email: string) {
    try {
      const response = await lastValueFrom(
        this.httpService.post(`${this.baseUrl}/simulations`, {
          ...createSimulationDto,
          user: email,
        }),
      );
      return response.data;
    } catch (error) {
      this.logger.log('Error creating simulation', error.response?.data || error);
      throw new BadRequestException('Error creating simulation');
    }
  }

  async findAll() {
    try{
      const response = await lastValueFrom(
        this.httpService.get(`${this.baseUrl}/simulations/all`),
      );
      return response.data;
    } catch (error) {
      this.logger.log('Error fetching simulations', error.response?.data || error);
      throw new BadRequestException('Error fetching simulations');
    }
  }
  async findOne(id: string) {
    try{
      const response = await lastValueFrom(
        this.httpService.get(`${this.baseUrl}/simulations/${id}`),
      );
      return response.data
    } catch(error) {
      this.logger.log('Error fetching simulation', error.response?.data || error);
      throw new BadRequestException('Error fetching simulation');
    }
  }

  async update(id: string, updateSimulationDto: UpdateSimulationDto) {
    try {
      const response = await lastValueFrom(
        this.httpService.put(
          `${this.baseUrl}/simulations/${id}`,
          updateSimulationDto,
        ),
      );
      return response.data;
    } catch (error) {
      this.logger.log('Error updating simulation:', error.response?.data || error);
      throw new BadRequestException('Error updating simulation');
    }
  }

  async remove(id: string) {
    try{
      const response = await lastValueFrom(
        this.httpService.delete(`${this.baseUrl}/simulations/${id}`),
      );
      return response.data;
    } catch(error){
      this.logger.log('Error removing simulation', error.response?.data || error);
      throw new BadRequestException('Error removing simulation');
    }
  }

  async start(id: string, startSimulationDto: StartSimulationDto) {
    try {
      // Se obtienen los datos de la simulación desde el ms-simulation service
      const simulationDataResponse  = await lastValueFrom(
        this.httpService.get(`${this.baseUrl}/simulations/${id}`)
      );

      //Solo toma los datos relevantes
      const simulationData = simulationDataResponse.data;
      
      console.log('Simulation Data;',simulationData);
      // Construye el cuerpo eliminando referencias circulares
      const requestBody = {
        simulationData,
        startSimulationDto:{
          qty_tuples: startSimulationDto.qty_tuples,
        },
      };

      const response = await lastValueFrom(this.httpService.post(`${this.producerBaseUrl}/${id}/start`,
        requestBody,
        ),
      );

      return response.data;

    } catch (error) {
      console.error('HTTP ERROR:', error.response?.data || error.message || error);
      this.logger.log('Error starting simulation:', error.response?.data || error);
      throw new BadRequestException('Error starting simulation');
    }
  }

  async findUserSimulations(email: string): Promise<CreateSimulationDto[]> {
    try{
      const response = await lastValueFrom(this.httpService.get(`${this.baseUrl}/simulations/${email}`));
      return response.data;
    } catch (error) {
      this.logger.log('Error finding all simulations', error);
      throw new BadRequestException('Error finding simulations for user');
      }
  }
}
