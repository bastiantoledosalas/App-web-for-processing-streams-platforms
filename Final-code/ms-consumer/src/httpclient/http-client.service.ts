import { Injectable, HttpException, HttpStatus, Logger, OnModuleInit } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import * as fs from 'fs';
import { SimulationStatus } from 'src/simulation/dto/simulationstatus';

@Injectable()
export class HttpClientService {
    private readonly logger = new Logger(HttpClientService.name);
    
    constructor(private readonly httpService: HttpService) {}

    // Método para actualizar el estado de una simulación
    async updateSimulationStatus( simulationId: string, newStatus: SimulationStatus): Promise<void>{
        this.validateUpdateParameters(simulationId, newStatus); // Validación de parámetros
        const url = this.constructSimulationUrl(simulationId);  // Construcción de la URL
        
        try {
            const response = await lastValueFrom(this.httpService.patch(url, { status: newStatus }));
            this.handleResponse(response, simulationId, newStatus);
        } catch (error){
            this.handleError(error, simulationId, newStatus); // Manejo de errores
        }
    }

    private validateUpdateParameters(simulationId: string, newStatus: SimulationStatus): void {
        if (!simulationId || !newStatus) {
            this.logger.error(`Invalid parameters for updating simulation state: simulationId = ${simulationId}, newStatus = ${newStatus}`);
            throw new HttpException('Simulation id and newStatus are required to update simulation status', HttpStatus.BAD_REQUEST);
        }
    }

    private constructSimulationUrl(simulationId: string): string {
        const url = `${process.env.SIMULATION_SERVICE}/${simulationId}/status`;
        this.logger.log('Construyendo URL para actualizar el estado de la simulación', url);
        return url;
    }
    
    // Función para manejar la respuesta de la solicitud
    private handleResponse(response: any, simulationId: string, newStatus: SimulationStatus): void {
        if (response.status === 200) {
        this.logger.log(`State successfully updated to ${newStatus} for simulation ${simulationId}`);
        } else {
            this.logger.error(`Failed to update state for simulation ${simulationId}. Status code: ${response.status}`);
            throw new HttpException(
                `Failed to update state for simulation ${simulationId}. Status code: ${response.status}`,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    // Función para manejar los errores durante la actualización
    private handleError(error: any, simulationId: string, newState: SimulationStatus): void {
    
    this.logger.error(`Final failure updating simulation ${simulationId} to status ${newState}: ${error.message}`);
        throw new HttpException(
            `Error updating simulation state to ${newState} for simulation ${simulationId}`,
            HttpStatus.INTERNAL_SERVER_ERROR,
        );
    }


  // Método para agregar resultados a una simulación
  async sendSimulationResults(simulationId: string, results: any): Promise<void> {
    if(!simulationId){
        this.logger.error(`Invalid simulationId: ${simulationId}`);

        throw new HttpException(
            'simulationId is required to send simulations results',
            HttpStatus.BAD_REQUEST,
        );
    }

    // Log para verificar el contexto de los resultados antes de enviarlos
    this.logger.log(`Sending results to simulation with ID ${simulationId}: ${JSON.stringify(results, null, 2)}`);
    const url = `${process.env.SIMULATION_SERVICE}/${simulationId}/results`;
    try {
        // pasamos directamente el objeto results sin convertirlo a JSON
        const response = await lastValueFrom(this.httpService.patch(url, {results}));

        if (response.status === 200){
            this.logger.log(`Results successfully added for simulation ${simulationId}`);
        } else {
            this.logger.error(`Failed to add results for simulation ${simulationId}. Status code: ${response.status}`);
            throw new HttpException(
                `Failed to add results for simulation ${simulationId}. Status code: ${response.status}`,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    } catch (error) {
        this.logger.error(`Final failure adding results for simulation ${simulationId}: ${error.message}`);
        throw new HttpException(
            `Error adding results for simulation ${simulationId}`,
            HttpStatus.INTERNAL_SERVER_ERROR,
        );
    }
  }
}
