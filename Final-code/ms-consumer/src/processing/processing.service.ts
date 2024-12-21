import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import {exec} from 'child_process';
import { HttpClientService } from 'src/httpclient/http-client.service';
import { parseFile } from './utils';
import { ValidatedSimulationDto } from 'src/simulation/dto/simulation.dto';
import { SimulationStatus } from 'src/simulation/dto/simulationstatus';
import { ValidationService } from './validate.service';

@Injectable()
export class ProcessingService {
  private readonly logger = new Logger(ProcessingService.name);

  constructor(
    private readonly httpClientService  : HttpClientService,
    private readonly validateService    : ValidationService,
  ){}

  /**
   * Maneja los mensajes enviados desde RabbitMQ.
   * @param message El mensaje recibido
   */
  async processMessage(message: ValidatedSimulationDto): Promise<void> {
    const { _id, time, qty_tuples} = message;
    this.logger.debug('Valor de qty_tuples:', qty_tuples);
    
    if(!_id || !qty_tuples) {
      this.logger.error('simulation_id o qty_tuples no está definido en el mensaje');
      throw new HttpException(
        'simulation_id y qty_tuples es obligatorio para procesar el mensaje',
        HttpStatus.BAD_REQUEST,
      )
    }
    try{
      this.logger.log(`Procesando simulación con ID: ${_id}`);

      // Actualizar estado de la simulación
      await this.httpClientService.updateSimulationStatus(_id, SimulationStatus.Processing);
      
      // Validar los datos del mensaje
      this.validateService.validateEdges(message);

      // Crear los archivos necesarios para la simulación
      const topologyFilePath    = await this.createTopologyFile(message);
      const nodeDetailsFilePath = await this.createNodesDetailFile(message);

      // Ejecutar la simulación
      const outputfilePath      = await this.runSimulation(topologyFilePath, nodeDetailsFilePath, qty_tuples, time);
      
      // Se lee el archivo de salida y se crea el objeto completo con los resultados
      const simulationResults   = await parseFile(outputfilePath);

      // Se envia el objeto results al httpClientService para enviarlo al servicio de simulacion
      await this.httpClientService.sendSimulationResults(_id, simulationResults.results);
      
      // Cambiar el estado de la simulación a "Completed"
      await this.httpClientService.updateSimulationStatus(_id, SimulationStatus.Completed);

      this.logger.log(`Simulación con ID: ${_id} completada exitosamente.`);      

    }catch(error){

      // En caso de producirse un error en el procesamiento del mensaje se actualiza con estado failed la simulación
      await this.httpClientService.updateSimulationStatus(_id, SimulationStatus.Failed);
      throw new HttpException(`Error procesando la simulación con ID: ${_id}: ${error.message}`,HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Crear el archivo topology.txt
  private async createTopologyFile(data: any): Promise<string> {

    const { relaciones } = this.createNodesDictionary(data);

    try{ 

      // Directorio de salida
      const outputDir = path.join('/app/simulation-files');
      
      // Si no se encuentra el directorio se crea
      if(!fs.existsSync(outputDir)){
        fs.mkdirSync(outputDir, { recursive: true });
      }

      // Crear el archivo dentro del directorio
      const filePath = path.join(outputDir, 'topology.dat');
    
      // Crea flujo de escritura
      const writeStream = fs.createWriteStream(filePath, {flags: 'w'});
      
      // Nos aseguramos que el flujo se cierre correctamente al finalizar
      writeStream.on('error', (error) => {
        throw new Error(`Error escribiendo en el archivo: ${error.message}`);
        });

      // Escribir las relaciones únicas en el archivo
      for (const relacion of relaciones) {
        writeStream.write(`${relacion}\n`);
      };

      await new Promise<void>((resolve, reject) => {
        writeStream.end(() => resolve());
        writeStream.on('error', (err) => reject(err))});
      
      return filePath;
    } catch(error){
        this.logger.error(`Error en createTopologyFile: ${error.message}`);
        throw error;
    }
  }

  // Crear un diccionario de nodos
  private createNodesDictionary(data: any): { nodesDict: Record<string, string>; relaciones: Set<string> }{
    const nodesDict: Record<string, string> = {}; // Diccionario para los nodos
    const relaciones = new Set<string>();         // Usamos un Set para evitar duplicados de relaciones

    // Crear el diccionario de nodos: ID -> Nombre
    data.nodes.forEach((node: any) => {
      if (node.id && node.data?.name) {
        const sanitizedName = node.data.name.trim().replace(/\s+/g, '');  // Limpiar espacios
        nodesDict[node.id] = sanitizedName;
      } else {
        throw new Error(`Nodo inválido: ${JSON.stringify(node)}`);
      }
    });

    // Crear las relaciones usando los IDs del diccionario
    data.edges.forEach((edge: any) => {
      const sourceName = nodesDict[edge.source];
      const targetName = nodesDict[edge.target];

      if (!sourceName || !targetName) {
        throw new Error(`No se encontraron nodos válidos para la relación: ${JSON.stringify(edge)}`);
      }

      // Agregar la relación al Set (evitar duplicados)
      relaciones.add(`${sourceName} ${targetName}`);
    });

    return { nodesDict, relaciones };
  }

  private async createNodesDetailFile(data: any): Promise<string> {
    const nodesDetails = this.createNodesDetails(data);

    try {
      const outputDir = path.join('/app/simulation-files');
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }

      // Crear el archivo dentro del directorio
      const filePath = path.join(outputDir, 'nodes_detail.dat');
      const writeStream = fs.createWriteStream(filePath, { flags: 'w' });

      writeStream.on('error', (error) => {
          throw new Error(`Error escribiendo en el archivo: ${error.message}`);
      });

      // Encabezado
      const header = [
          '#Node_Name',
          'Type',
          'Replication',
          'Grouping',
          'Processor',
          'AvgServiceTime',
          'ArrivalRate (Spout)/NumberOutputTweets (Bolt)',
      ].join(' ');
      writeStream.write(`${header}\n`);

      // Escribir detalles de nodos
      nodesDetails.forEach((nodeDetail) => {
          const line = [
              nodeDetail.name,
              nodeDetail.type,
              nodeDetail.replicationLevel,
              nodeDetail.grouping,
              nodeDetail.processor,
              nodeDetail.type === 'B' ? nodeDetail.numberOutputTweets: nodeDetail.avgServiceTime,
              nodeDetail.type === 'B' ? nodeDetail.avgServiceTime : nodeDetail.arrivalRate || nodeDetail.avgServiceTime,
          ].join(' ');

          writeStream.write(`${line}\n`);
      });

      await new Promise<void>((resolve, reject) => {
          writeStream.end(() => resolve());
          writeStream.on('error', (err) => reject(err));
      });

      return filePath;
    } catch (error) {
        this.logger.error(`Error en createNodesDetailFile: ${error.message}`);
        throw error;
    }
  }

  private createNodesDetails(data: any): any[] {
    const nodesDetails: any[] = [];                 // Detalles de los nodos

    data.nodes.forEach((node: any) => {
      const { name, type, replicationlevel, groupType, processor, avgServiceTimeValue, arrivalRateValue, numberOutputTweetsValue } = node.data;

      if (name  === undefined ||
         type   === undefined ||
         replicationlevel === undefined || 
         groupType === undefined ||
         processor === undefined){
        throw new Error(`Datos incompletos para el nodo: ${JSON.stringify(node)}`);
      }
      const nodeDetail: any = {
        name                : name.trim().replace(/\s+/g, ''),  // Nombre del nodo limpio de espacios
        type                : type,
        replicationLevel    : replicationlevel,                             
        grouping            : groupType,
        processor           : processor,
       
      };
      
      // Configuración de detalles específicos para cada tipo de nodo
      if (type === 'S') {
        nodeDetail.avgServiceTime = avgServiceTimeValue;
        nodeDetail.arrivalRate    = arrivalRateValue || '';

      } else if (type === 'B') {
        nodeDetail.numberOutputTweets = numberOutputTweetsValue || '';
        nodeDetail.avgServiceTime = avgServiceTimeValue || '';
      } else {
        throw new Error(`Tipo de nodo desconocido: ${type}`);
      }
      nodesDetails.push(nodeDetail);
    });
    return nodesDetails;
  }
 
  private async runSimulation(topologyFilePath: string, nodeDetailsFilePath: string, qty_tuples: number, time?: number): Promise<string>{
    try {
      // Verificar que los archivos creados no estan vacios
      this.verifyFilesNotEmpty([nodeDetailsFilePath, topologyFilePath]);

      // Rutas del simulador y del archivo de salida
      const simulatorPath   = path.join('/app/simulation-files','Simulador');
      const outputFilePath  = path.join('/app/simulation-files','output.dat');

      if(!fs.existsSync(simulatorPath)){
        throw new Error(`El simulador no se encontró en la ruta: ${simulatorPath}`);
      }

      // Construir los argumentos del comando
      const args = [
        `-t ${topologyFilePath}`,
        `-n ${nodeDetailsFilePath}`,
        `-p ${qty_tuples}`,
        time ? `-l ${time}` : '', // Agregar `-l` solo si `time` está definido 
      ].filter(Boolean)           // Remover entradas vacías

      const finalCommand = `${simulatorPath} ${args.join(' ')} > ${outputFilePath}`; // Redirigir la salida al archivo

      // Log del comando para depuración
      this.logger.log(`Ejecutando comando: ${finalCommand}`);

      // Ejecutar el comando como una Promesa
      await this.executeCommand(finalCommand);

      // Verificar que el archivo de salida no esté vacío
      if (!fs.existsSync(outputFilePath)) {
        throw new Error(`El archivo de salida no se generó: ${outputFilePath}. ` + `Comando ejecutado: ${finalCommand}`);
      }
      const outputStats = fs.statSync(outputFilePath);
      if (outputStats.size === 0) {
        const debugContent = fs.readFileSync(outputFilePath, 'utf8');
        throw new Error(`El archivo de salida está vacío: ${outputFilePath}. ` + `Comando ejecutado: ${finalCommand}. Contenido del archivo: \n${debugContent}`);
      }

      // Log de exito
      this.logger.log(`Simulación completada. Salida redirigida a: ${outputFilePath}`);
      return outputFilePath;
    } catch (error) {
      this.logger.error(`Error en runSimulation: ${error.message}`);
      throw error;
    }
  }

  private async executeCommand(command: string): Promise<void> {
    return new Promise((resolve, reject) => {
      exec(command, (error, stdout, stderr) => {
        if (error) {
          this.logger.error(`Error al ejecutar el comando: ${command}`);
          this.logger.error(`Detalles del error: ${stderr || error.message}`);
          return reject(error);
        }
        this.logger.debug(`Comando ejecutado con éxito: ${command}`);
        resolve();
      });
    });
  }

  private async verifyFilesNotEmpty(filePaths: string[]): Promise<void>  {
    for (const filePath of filePaths){
      try {
        // Verificar si el archivo existe
        await fs.promises.access(filePath, fs.constants.F_OK);

        const stats = await fs.promises.stat(filePath);
        if ( stats.size === 0) {
          throw new Error(`El archivo está vacío: ${filePath}`);
        }
      } catch (error) {
        if (error.code === 'ENOENT') {
          throw new Error(`El archivo no existe: ${filePath}`);
        }
        throw error;
      }
    }
  }

}