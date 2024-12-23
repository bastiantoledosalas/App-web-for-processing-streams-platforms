import { Injectable, Logger, HttpException, HttpStatus, Inject, forwardRef, BadRequestException, ServiceUnavailableException, InternalServerErrorException } from '@nestjs/common';
import { RabbitMQService } from '../rabbitmq/rabbitmq.service';
import { ValidatedSimulationDto } from 'src/entity/dto/simulation.dto';
import { catchError, firstValueFrom, lastValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { SimulationStartDto } from 'src/entity/dto/simulation-start.dto';
import { SimulationStatus } from 'src/entity/dto/simulationstatus';
import { RpcException } from '@nestjs/microservices';


@Injectable()
export class ProducerService {
  private readonly logger= new Logger(ProducerService.name);

  constructor(
    private readonly httpService: HttpService,

    @Inject(forwardRef(() => RabbitMQService))
    private readonly rabbitMQService: RabbitMQService,
  ){};

  /**
   * Iniciar la simulación
   * @param simulationData      Datos de los modelos de simulación
   * @param startSimulationDto  Parametros para la simulación
   */
  async startSimulation(simulationData: ValidatedSimulationDto, startSimulationDto: SimulationStartDto){
    try{

      // Validación de datos
      if (!simulationData || !startSimulationDto) {
        throw new BadRequestException('Faltan datos obligatorios para iniciar la simulación.');
      }

      const url = `${process.env.SIMULATION_SERVICE}/${simulationData._id}/status`;
      
      // Intentar actualizar el estado de la simulación a 'in progress'
      await this.updateSimulationStatus(simulationData._id,SimulationStatus.InProgress);      

      // Limpiar los datos recibidos y unificarlos para enviarlos a la cola de RabbitMQ
      const cleanedData = this.cleanAndMergeData(simulationData, startSimulationDto);
    
      // Paso 4: Publicar mensaje en RabbitMQ
      await this.publishToRabbitMQ(cleanedData);
      this.logger.log(`Mensaje de simulación ${cleanedData._id} publicado en RabbitMQ`);
    
    } catch (error) {

      this.logger.error(`Error en el flujo de la simulación: ${error.message}`);

      // Si la actualización del estado falla, no continuar con la simulación

      if (error instanceof HttpException) {
        if (error.getResponse() && typeof error.getResponse() === 'object') {
          const errorResponse = error.getResponse() as { status: number };
          if (errorResponse.status === HttpStatus.SERVICE_UNAVAILABLE) {
            throw new ServiceUnavailableException('Servicio de simulaciones no disponible');
          }
        }
      }
      // Detener el flujo inmediatamente si no se puede actualizar el estado
      throw new InternalServerErrorException('No se pudo actualizar el estado de la simulación.');
    }
  }
  
  private cleanAndMergeData(simulationData: ValidatedSimulationDto, startSimulationDto: SimulationStartDto){
    const {time, qty_tuples} = startSimulationDto;
    const {_id, nodes, edges} = simulationData;
    // Limpiar los nodos
    const cleanedNodes = nodes.map(node => ({
      id: node.id,
      data: {
        name: node.data.name,
        type: node.data.type,
        replicationlevel: node.data.replicationLevel,
        groupType: node.data.groupType,
        processor: node.data.processor,
        avgServiceTimeValue: node.data.avgServiceTimeValue,
        ...(node.data.type === 'B' && {
          numberOutputTweetsValue: node.data.numberOutputTweetsValue,
        }),
        ...(node.data.type === 'S' && {
          arrivalRateValue: node.data.arrivalRateValue,
        }),
      },
    }));

    // Limpiar edges
    const cleanedEdges = edges.map(edge => ({
        source: edge.source,
        target: edge.target,
      }));

    // Se retorna el objeto limpio con los datos adicionales
    return {
      _id,
      nodes: cleanedNodes,
      edges: cleanedEdges,
      ...(time && { time}),
      ...(qty_tuples && { qty_tuples}),
    }
  }

  private async publishToRabbitMQ(data : any):Promise<void>{
    try {
      // Intentar publicar el mensaje en RabbitMQ
      await this.rabbitMQService.publishMessage(data);
      this.logger.log('Message successfully published to RabbitMQ.');
    } catch (error) {
      // Capturar errores y lanzar una excepción con más detalles
      this.logger.error('Error publishing to RabbitMQ', error.stack);
      throw new RpcException(`Failed to publish message to RabbitMQ: ${error.message || 'Unknown error'}`);
    }
  }

  // Método para actualizar el estado de la simulación
  async updateSimulationStatus(simulationId: string, newStatus: SimulationStatus ): Promise<void>{
    const url = `${process.env.SIMULATION_SERVICE}/${simulationId}/status`;
    console.log('URL:',url);
    
    if (!url) {
      throw new HttpException('Error en la configuración de la url para conectar al servicio de simulaciones', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    try {
      // Se intenta actualizar el estado de la simulación
      const response = await firstValueFrom( this.httpService.patch( url, {status: newStatus}).pipe(
        catchError((error) => {
          const errorMsg = `Error al actualizar estado en el simulation-service: ${error.message}`;
          this.logger.error(errorMsg);

          // Lanza un error detallado incluyendo el código de estado
          throw new HttpException(
            errorMsg,
            error.response?.status,
          error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
        );
      }),
    ),
  );
  this.logger.log(`Estado de simulación actualizado a: ${newStatus}`);
  } catch (error) {
      const errorMessage = 'Fallo al actualizar el estado de la simulación.';
      this.logger.error(errorMessage, error.stack);
      throw new InternalServerErrorException(errorMessage);
    }
  }
}