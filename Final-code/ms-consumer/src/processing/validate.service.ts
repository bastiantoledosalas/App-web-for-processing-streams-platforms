import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { DistributionTypeAvgServiceTime } from "src/simulation/dto/Distributions";
import { ValidatedSimulationDto } from "src/simulation/dto/simulation.dto";

@Injectable()
export class ValidationService {
  private readonly logger = new Logger(ValidationService.name);

  validateEdges(data: ValidatedSimulationDto): void{
    const {nodes, edges} = data;
    
    // Validar que nodes y edges sean arrays validos
    if(!Array.isArray(nodes) || !Array.isArray(edges)){
      throw new BadRequestException('El mensaje debe contener arrays validos de nodos y edges.');
    }
        
    // Crear mapa de nodos por ID
    const nodeMap = new Map<string, string>();
    nodes.forEach((node) => {
      if(!node.id || !node.data || !node.data.type){
        throw new BadRequestException(`Nodo inválido: ${JSON.stringify(node)}`);
        }
      nodeMap.set(node.id, node.data.type);
    });

    edges.forEach((edge) => {
      const { source, target }  = edge;

      // Validar que cada edge tenga 'source' y 'target'
      if (!source || !target) {
        throw new BadRequestException(`Edge inválido: ${JSON.stringify(edge)}`);
      }

      //Validar que 'source' y 'target' existan en los nodos
      const sourceType = nodeMap.get(source);
      const targetType = nodeMap.get(target);

      if(!sourceType) {
        throw new BadRequestException(`El source "${source}" no existe en los nodos.`);
      }
      if (!targetType){
        throw new BadRequestException(`El target "${target}" no existe en los nodos.`);
      }
      // Validar combinaciones especificas de tipos de nodos
      this.validateEdgeTypes(source, sourceType, target, targetType, edge);
    });
    
    // Validar que no haya nodos desconectados
    this.validateDisconnectedNodes(nodes, edges);

    // Validar que no haya ciclos en el grafo
    this.detectCycles(nodes, edges);

    // Validar distribuciones
    this.validateNodeData(nodes);
  }

  private validateEdgeTypes(source: string, sourceType: string, target: string, targetType: string, edge: any): void {
    // Regla 1: Un nodo tipo 'S' no puede ser target de ningún edge
    if (targetType === 'S') {
      throw new BadRequestException(`Un nodo tipo "S" (id: "${source}") solo puede conectar a nodos tipo "B" (id: "${target}"): ${JSON.stringify(edge)}`);
    }

    // Regla 2: Un edge no puede tener el mismo nodo como source y target
    if (source === target) {
      throw new BadRequestException(`Un nodo no puede autoreferenciarse en un edge (id: "${source}"). Edge: ${JSON.stringify(edge)}`);
    }
    
    // Regla 3: Un nodo tipo 'S' solo puede apuntar a nodos tipo 'B' 
    if (sourceType === 'S' && targetType !== 'B'){
      throw new BadRequestException(`Un nodo tipo "S" (id: "${source}") solo puede conectar a nodos tipo "B" (id: "${target}"). Edge: ${JSON.stringify(edge)}`);
    }
  }

  private validateDisconnectedNodes(nodes: any[], edges: any[]): void {
    const connectedNodes = new Set<string>();

    // Recorrer los edges para agregar los nodos source y target
    edges.forEach(({ source, target }) => {
      connectedNodes.add(source);
      connectedNodes.add(target);
    });

    // Validar que todos los nodos en el arreglo "nodes" están en el conjunto de nodos conectados
    nodes.forEach(({ id }) => {
      if (!connectedNodes.has(id)) {
        throw new BadRequestException(`Nodo desconectado detectado: "${id}". Todos los nodos deben estar conectados por al menos un edge.`);
      }
    });
  }

    // Función para detectar ciclos en el grafo utilizando DFS
    private detectCycles(nodes: any[], edges: any[]): void {
        const adjList = new Map<string, string[]>();

    // Crear lista de adyacencia a partir de los edges
    edges.forEach(({ source, target }) => {
        if (!adjList.has(source)) adjList.set(source, []);
        adjList.get(source)!.push(target);
    });

    const visited   = new Map<string, boolean>(); // Mapa para registrar si un nodo ya fue completamente procesado (es decir, se ha salido del camino recursivo)
    const inProcess = new Map<string, boolean>(); // Mapa para registrar si un nodo esta siendo procesado en la recursión actual

    // Función recursiva DFS para detectar ciclos
    const dfs = (node: string): boolean => {
      if (inProcess.get(node)) {
        return true; // Si el nodo está en proceso, hay un ciclo
      }

      if (visited.get(node)) {
        return false; // Si ya hemos visitado este nodo, no hay ciclo
      }

      // Marcar el nodo como en proceso
      inProcess.set(node, true);

      // Recorrer los vecinos del nodo
      const neighbors = adjList.get(node) || [];
      for (const neighbor of neighbors) {
        if (dfs(neighbor)) {
          return true; // Si encontramos un ciclo en el vecino
        }
      }

      // Marcar el nodo como visitado y salir del camino recursivo
      inProcess.set(node, false);
      visited.set(node, true);

      return false;
    };

    // Realizar DFS en todos los nodos
    for (const node of nodes) {
      if (!visited.get(node.id)) {
        if (dfs(node.id)) {
          throw new BadRequestException(`Ciclo detectado comenzando desde el nodo: "${node.id}".`)
        }
      }
    }
  }

  private validateNodeData(nodes: any[]): void {
    nodes.forEach((node) => {
      const { id, data} = node;
      const { type, avgServiceTimeValue, arrivalRateValue, numberOutputTweetsValue} = data;

      // Validar avgServiceTimeValue (campo compartido entre nodos 'S' y 'B')
      const resultavgservicetime = this.validateAvgServiceTimeValue(id, avgServiceTimeValue);

      this.logger.log(`resultado del avgServiceTimeValue ${resultavgservicetime} desde el nodo: "${node.id}".`);
      switch (type){
        case 'S':
          this.validateSourceNode(id, arrivalRateValue, numberOutputTweetsValue);
          break;
        case 'B':
          this.validateTargetNode(id, numberOutputTweetsValue, arrivalRateValue);
          break;
        default:
          throw new BadRequestException(`Tipo de nodo desconocido "${type}" en el nodo ${id}. Solo se permiten nodos de tipo 'S' o 'B'.`);
      }
    });
  }

  /**
   * Valida que los nodos de tipo 'S' no contengan el campo 
   * @param id 
   * @param arrivalRateValue 
   * @param numberOfTweetsValue 
   */
  private validateSourceNode(id: string, arrivalRateValue: string, numberOutputTweetsValue: string): void {
    // Validar arrivalRateValue con las mismas reglas del avgServiceTimeValue
    this.validateAvgServiceTimeValue(id, arrivalRateValue); 

    // Validar que no venga el campo numberOutputTweetsValue en nodos de tipo 'S'
     if (numberOutputTweetsValue !== undefined) {
        throw new BadRequestException(`El nodo de tipo 'S' no debe contener el campo "numberOutputTweetsValue": Nodo ${id}.`);
     }
  }

  private validateTargetNode(id: string, numberOutputTweetsValue: string, arrivalRateValue: string): void {
    // Valida que no venga el campo arrivalRateValue en nodos de tipos 'B'
    if (arrivalRateValue !== undefined) {
      throw new BadRequestException(`El nodo de tipo 'B' no debe contener el campo "arrivalRateValue": Nodo ${id}.`);
    };
    // Validar numberOfTweetsValue
    this.validateNumberOutputTweetsValue(id, numberOutputTweetsValue);
  }

  private validateAvgServiceTimeValue(nodeId: string, avgServiceTimeValue: string): boolean {
    if (!avgServiceTimeValue) {
      throw new BadRequestException(`El campo "avgServiceTimeValue" es obligatorio en el nodo ${nodeId}.`);
    }

    // Eliminar espacios innecesarios
    avgServiceTimeValue = avgServiceTimeValue.trim();

    // Expresión regular para capturar la distribución y los parámetros
    const regex = /^(?<dist>[a-z0-9]+)\s*\(\s*(?<params>[-\d.,\s]+)\s*\)$/i;
    const match = avgServiceTimeValue.match(regex);   

    if (!match || !match.groups) {
      this.logger.log('Regex no coincide:', avgServiceTimeValue);
      throw new BadRequestException(`El formato de "avgServiceTimeValue" es inválido en el nodo ${nodeId}.`);
    }
    const { dist, params} = match.groups;
    const distribution = dist.toLowerCase() as DistributionTypeAvgServiceTime;
    
    // Validar si la distribución es reconocida
    if (!Object.values(DistributionTypeAvgServiceTime).includes(dist.toLowerCase() as DistributionTypeAvgServiceTime)){
      throw new BadRequestException(`La distribución "${dist}" no es reconocida en el nodo ${nodeId}.`);
    }

    // Validar los parámetros
    const paramValues = params.split(',').map((p) => parseFloat(p.trim()));

    if (paramValues.some((v) => isNaN(v))) {
      throw new BadRequestException(`Los parámetros deben ser numéricos en el nodo ${nodeId}.`);
    }

    switch (distribution) {
      // Distribución fixed
      case DistributionTypeAvgServiceTime.FIXED:
        if (paramValues.length !== 1 || isNaN(paramValues[0]) || paramValues[0] <= 0) {
          throw new BadRequestException(`La distribución "fixed" debe tener un solo valor numérico y debe ser positivo en el nodo ${nodeId}.`);
        }
        return true;

      // Distribución chi2
      case DistributionTypeAvgServiceTime.CHI2:
        if (paramValues.length !== 3 || paramValues.some((v) => isNaN(v)) || paramValues[0] < 1){
          throw new BadRequestException(`La distribución "chi2" debe tener 3 valores numéricos donde el primero debe ser >= 1 en el nodo ${nodeId}.`);
        }
        return true;
      case DistributionTypeAvgServiceTime.MAXWELL:
      case DistributionTypeAvgServiceTime.EXPON:
      case DistributionTypeAvgServiceTime.NORM:
        if(paramValues.length !== 2 || paramValues.some((v) => isNaN(v))) {
          throw new BadRequestException(`La distribución "${dist}" debe tener 2 valores numéricos en el nodo ${nodeId}.`);
        }
        return true;
      
      case 'invgauss':
      case 'lognorm':
        if (paramValues.length !== 3 || paramValues.some((v) => isNaN(v)) || paramValues[0] < 0) {
          throw new BadRequestException(`La distribución "${dist}" debe tener 3 valores numéricos donde el primero debe ser >= 0 en el nodo ${nodeId}.`);
        }
        return true;
      // Si la distribución no está reconocida
      default:
        throw new BadRequestException(`Distribución "${dist}" no reconocida en el nodo ${nodeId}.`);
    }
  }
  
  private validateNumberOutputTweetsValue(nodeId: string, numberOutputTweetsValue: string): boolean {
    if (!numberOutputTweetsValue) {
      throw new BadRequestException(
        `El campo "numberOutputTweetsValue" es obligatorio para nodos tipo 'B': Nodo ${nodeId}.`
      );
    }
    numberOutputTweetsValue = numberOutputTweetsValue.trim();
    //this.logger.debug('Trimmed numberOutputTweetsValue:', numberOutputTweetsValue);
    
    // Expresión regular para capturar la distribución y los parámetros
    const regex = /^(?<dist>fixed|bernoulli|geom|nbinom)\((?<params>[-\d.,\s]+)\)$/i;
    const match = numberOutputTweetsValue.match(regex);

    if (!match || !match.groups) {
      this.logger.debug('Formato no valido', numberOutputTweetsValue);
      throw new BadRequestException(`El formato de "numberOfTweetsValue" es inválido en el nodo ${nodeId}.`);
    }

    const {dist, params} = match.groups!;
    const paramValues = params.split(',').map((p) => parseFloat(p.trim()));
    
    switch (dist.toLocaleLowerCase()) {
      //Distribución fixed
      case 'fixed':
        if (paramValues.length !== 1 || isNaN(paramValues[0]) || paramValues[0] <= 0) {
          throw new BadRequestException(`La distribución "fixed" debe tener un solo valor numérico en el nodo ${nodeId}.`);
        }
        return true;
      
      case 'bernoulli':
        if (paramValues.length !== 3 || paramValues.some((v) => isNaN(v)) || paramValues[0] < 0 || paramValues[0] > 1 || paramValues[1] <= 0 || paramValues[2] <= 0){
          throw new BadRequestException(`La distribución "bernoulli" debe tener 3 valores numéricos en el nodo ${nodeId}. El primer valor debe estar en el rango [0,1]`);
        }
        return true;
      
      case 'geom':
        if(paramValues.length !== 3 || paramValues.some((v) => isNaN(v)) || paramValues[0] < 0 || paramValues[0] > 1 || paramValues[1] <= 0 || paramValues[2] <= 0){
          throw new BadRequestException(`La distribución "geometrica" (geom) debe tener 3 valores numéricos en el nodo ${nodeId}. El primer valor debe estar en el rango [0,1]`);
        }
        return true;
      
      case 'nbinom':
        if(paramValues.length !== 4 || paramValues.some((v) => isNaN(v)) || paramValues[0] < 1 || paramValues[1] < 0 || paramValues[1] > 1 || paramValues[2] <= 0 || paramValues[3] <= 0){
          throw new BadRequestException(`La distribución "nbinomial" (nbinom) debe tener 4 valores numéricos en el nodo ${nodeId}. El primer valor debe sers >=1 y los demas positivos`);
        }
        return true;
    }
  }
}