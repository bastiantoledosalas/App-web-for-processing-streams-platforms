
export function parseArrivalRate(line: string, context: any): void {
  const match = /ARRIVAL_RATE (\d+(\.\d+)?)/g.exec(line);
  if (match) {
    const [_, arrivalRate]  = match;
      context.results[0].arrivalRates.push(parseFloat(arrivalRate));
  }
}

export function parseNumberOfTuples(line: string, context: any): void {
  const match = /NUMBER_OF_TUPLES (\S+) (\d+)/.exec(line);
  if (match) {
    const [_, nodeName, numberOfTuples] = match;

    const baseName = nodeName.replace(/_\d+$/, ''); // Eliminar sufijo _X
    const nodeSuffix = nodeName.match(/_(\d+)$/)?.[1]; // Extraer el sufijo numérico

    if (!nodeSuffix){
      console.warn(`No se pudo determinar el nodo para ${nodeName}`);
      return;
    }

    // Buscar si ya existe una entrada para el nodo base
    let node = context.results[0].numberTuples.find((n: any) => n.name === baseName);

    if (!node) {
      
      node = {
          name: baseName,
          details: []     // Lista de nodos con sus tuplas
      }
      context.results[0].numberTuples.push(node);
    }

    // Verificar si ya existe el nodo con el sufijo para evitar duplicados
    const existingDetail = node.details.find((detail: any) => detail.node === nodeSuffix);
    if(!existingDetail){
      // Agregar los datos del nodo al arreglo details
      node.details.push({
        node        : nodeSuffix,
        nro_tuplas  : parseInt(numberOfTuples), 
      });
    }
  }
}

export function parseServiceTime(line: string, context: any): void {
  const match = /SERVICE_TIME (\S+) (\d+(\.\d+)?)/.exec(line);
  if (match) {
    const [_, nodeName, serviceTime] = match;
    
    // Separar el sufijo numérico del nombre del nodo
    const baseName = nodeName.replace(/_\d+$/, ''); // "TwitterFilter_0" -> "TwitterFilter"
    const nodeSuffix = nodeName.match(/_(\d+)$/)?.[1]; // Capturar el sufijo "0", "1", etc.

    if(!nodeSuffix){
      console.warn(`No se pudo determinar el nodo para ${nodeName}`);
      return;
    }

    // Verifica si ya existe una entrada para el nodo base
    let node = context.results[0].serviceTimes.find((n: any) => n.name === baseName);

    if (!node){
      node = {
          name  : baseName,
          times : []
      };
      context.results[0].serviceTimes.push(node);
    }

    // Agregar el tiempo con su nodo correspondiente
    node.times.push({
      node  : nodeSuffix,
      time  : parseFloat(serviceTime) 
    });
  }
}

export function parseProcessor(line: string, context: any): void {
  const match = /PROCESSOR: (\S+) in_use: (-?\d+(\.\d+)?([eE][-+]?\d+)?) - average memory=(-?\d+(\.\d+)?([eE][-+]?\d+)?) - max memory=(\d+) -- accs=(\d+) -- cumm=(\d+)/.exec(line);
  if (match) {
    const [_, rawIp, inUse, , , avgMemory, , , maxMemory, accesses, cumulative] = match;
      context.results[0].processors.push({
          name            : rawIp.replace("Proc_",""),  //Elimina el prefijo "Proc_"
          in_use          : parseFloat(inUse),          //Capturar in_use como número (notación cientifica o estandar)
          averageMemory   : parseFloat(avgMemory),      //Captura el average memory
          maxMemory       : parseInt(maxMemory),                  // Captura el max memory
          accesses        : parseInt(accesses),                   // Capturar los accesos como entero
          cumulativeMemory: parseInt(cumulative),                 // Captura la memoria acumulada como entero
          utilization     : 0,                          // Se actualiza en otra línea
          cores: [], // Se inicializan los cores como un array vacío
      });
  }
}
export function parseCore(line: string, context: any): void {
  const match = /PROCESSOR: (\S+) - CORE: Core_(\d+) time_in_use: (-?\d+(\.\d+)?([eE][-+]?\d+)?) total_time: (-?\d+(\.\d+)?([eE][-+]?\d+)?) utilization: (-?\d+(\.\d+)?([eE][-+]?\d+)?)/.exec(line);
  
  if (match){

    const [_, rawIp, coreId, timeInUse, , , totalTime, , , utilization] = match;

    const processorName = rawIp.replace("Proc_", ""); // Quitar el prefijo "Proc_"

    // Busca el procesador correspondiente
    const processor = context.results[0].processors.find((p: any) => p.name === processorName);
    if (processor) {

      // Convertir utilization a numero
      let utilizationValue = utilization ? parseFloat(utilization) : 0;

      let formattedUtilization: number;

      // Si el valor es NaN o infinito, asignar 0.0
      if (isNaN(utilizationValue) || !isFinite(utilizationValue)) {
        formattedUtilization = 0.0;
      } else if (utilizationValue === 0) {
        // Si el valor es 0, asignar 0.0
        formattedUtilization = 0.0;
      } else {
        // Si el valor es válido, lo asignamos tal cual
        formattedUtilization = utilizationValue;
      }
          processor.cores.push({
          id          : parseInt(coreId, 10),
          time_in_use : parseFloat(timeInUse),
          total_time  : parseFloat(totalTime),
          utilization : formattedUtilization, 
      });
    }
  }
}

export function parseProcessorUtilization(line: string, context: any): void {
  const match = /PROCESSOR utilization: (-?\d+(\.\d+)?([eE][-+]?\d+)?)/.exec(line);
  if (match) {
      const [_, utilization] = match;
      
      let utilizationValue  = parseFloat(utilization);

      // Formatear utilization
    let formattedUtilization: number;

    // Si el valor es NaN o infinito, asignar 0.0
    if (isNaN(utilizationValue) || !isFinite(utilizationValue)) {
      formattedUtilization = 0.0;
    } else if (utilizationValue === 0) {
      // Si el valor es 0, asignar 0.0
      formattedUtilization = 0.0;
    } else {
      // Si el valor es válido, lo asignamos tal cual
      formattedUtilization = utilizationValue;
    }

      const lastProcessor = context.results[0].processors[context.results[0].processors.length - 1];
      if (lastProcessor) {
          lastProcessor.utilization = formattedUtilization;
      }
  }
}

export function parseNodeSummary(line: string, context: any): void {
  const match = /^\s*utilization:(-?\d+(\.\d+)?) throughput:(-?\d+(\.\d+)?) replicas:(\d+)/.exec(line);
  if (match) {
    const [, utilization, , throughput, , replicas] = match;

    // Suponiendo que el ultimo nodo procesado es el que corresponde al resumen
    const lastNode  = context.results[0].nodes[context.results[0].nodes.length - 1];

    if (lastNode) {
      // Sobrescribimos los valores iniciales con los valores capturados
      lastNode.utilization  = parseFloat(utilization);
      lastNode.throughput   = parseFloat(throughput);
      lastNode.replicas     = parseInt(replicas);
    } else {
      console.warn("No se encontró ningún nodo en el contexto para actualizar.");
    }
  } else {
    console.warn(`Línea no coincide con el formato esperado: "${line}"`);
  }
}

export function parseNodeReplica(line: string, context: any): void {
  // Expresión regular para capturar los datos de la línea
  const match = /NODE:\s*(\S+)_?(\d*)\s*use_time:\s*([-+]?\d*\.?\d+([eE][-+]?\d+)?)\s*total_time:\s*([-+]?\d*\.?\d+([eE][-+]?\d+)?)\s*utilization:\s*([-+]?\d*\.?\d+([eE][-+]?\d+)?)\s*throughput:\s*([-+]?\d*\.?\d+([eE][-+]?\d+)?)\s*avg_resp_time:\s*([-+]?\d*\.?\d*|[-+]?\d*\.?\d*e[-+]?\d*|[-]?\d*\.?\d*e?[-+]?\d+|-nan)\s*tuples:\s*([-+]?\d+)\s*replica:\s*(\d+)/.exec(line);
  if (match) {
  // Desestructuramos los valores capturados
  const [, nodeName, replicaIndex, useTime, totalTime, utilization, throughput, avgRespTime, tuples, replica] = match;

  const baseName    = nodeName.replace(/_\d+$/, '');
  const nodeSuffix  = nodeName.match(/_(\d+)$/)?.[1];

  // Verificamos si el nodo ya existe en el contexto
  let node = context.results[0].nodes.find((n: any) => n.name === baseName);
  // Crer nodo si no existe
  if (!node){
      node = {
        name: baseName,
        utilization : 0,  // Inicializar valores
        throughput  : 0,  // Inicializar valores
        replicas    : 0,  // Inicializar valores
        node_details: [],
      };
      context.results[0].nodes.push(node); // Añadimos el nodo al contexto
    }
  // Aseguramos que los valores sean válidos, con valores por defecto si es necesario
  const parsedUseTime = parseFloat(useTime) || 0;
  const parsedTotalTime = parseFloat(totalTime) || 0;
  const parsedUtilization = parseFloat(utilization) || 0;
  const parsedThroughput = parseFloat(throughput) || 0;
  const parsedAvgRespTime = parseFloat(avgRespTime) || 0;
  const parsedTuples = parseInt(tuples) || 0;
  const replicaNumber = parseInt(replicaIndex) || 0;
  //const parsedReplica = parseInt(replica) || 0;

    // Agregar detalles de la réplica del nodo
  node.node_details.push({
      replica       : nodeSuffix,
      use_time      : parsedUseTime,
      total_time    : parsedTotalTime,
      utilization   : parsedUtilization,
      throughput    : parsedThroughput,
      avg_resp_time : parsedAvgRespTime,
      tuplas        : parsedTuples,
    });
  // Actualizamos el número de réplicas del nodo
  node.replicas = Math.max(node.replicas, replicaNumber + 1) ; // Mantenemos el valor máximo de réplicas
  }
}

export function parseStadistics(line: string, context: any): void {
   // Utilizando una expresión regular para extraer las estadísticas de la línea
   const match = /tuples generated:(\d+) tuples processed:(\d+) throughput topology:(\d+) average tuple response time:(\S+) total simulation time:(\S+)/.exec(line);
   if (match) {
    // Desestructuración para extraer los valores capturados
    const [_, tuplesGenerated, tuplesProcessed, throughput, avgRespTime, totalSimTime] = match;

    // Convertir los valores a los tipos apropiados
    const stats = {
      tuples_generated: parseInt(tuplesGenerated),
      tuples_processed: parseInt(tuplesProcessed),
      throughput_topology: parseInt(throughput),
      avg_tuple_resp_time: avgRespTime === "inf" ? null : parseFloat(avgRespTime),
      total_simulation_time: parseFloat(totalSimTime),
    };

    // Agregar las estadísticas al contexto
    context.results[0].stadistics.push(stats);
  }
}