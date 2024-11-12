Documentación del Ejecutable Simulador:

    El ejecutable Simulador se ejecuto de la siguiente forma:

        ./Simulador -t topology.dat -n nodes.dat -p 4 > salida.dat

        Deglose detallado:

            ./              :   Indica que el ejecutable Simulador se encuentra en el directorio actual desde el cual estás ejecutando el comando
            Simulador       :   Nombre del ejecutable que se está ejecutando
            -t              :   Opción o flag que se pasa al programa y esta indica que a continuación se determinará el archivo con la topología de red para ser simulada           
            topology.dat    :   Archivo de datos que se pasa como argumento a la opción '-t'. Contiene información de la topología de la red que solamente se limita a indicar conexiones de nodos en una relación de pares
                                
                                nodo1 -> nodo2 'nodo2 obtiene tuplas desde el nodo1'

            -n              :   Opción o flag que se pasa al programa y esta indica que a continuación
            nodes.dat       :   Archivo de datos que se pasa como argumento a la opción '-n'. Contiene información detallada sobre los nodos del sistema:
                                
                                Node_Name               El nombre de un nodo de la topología
                                Type                    El identificador 'S' se utiliza para un nodo 'Spout' o fuente de datos (necesario al menos 1 nodo de este tipo),
                                                        El identificador 'B' se utiliza para un nodo 'Bolt' o un elemento de procesamiento                         
                                Replication             Número de replicas del nodo
                                Grouping                Tipo de agrupamiento para las tuplas
                                Processor               Dirección IP de la máquina simulada que hospeda el nodo
                                AvgServiceTime(STRING)  Es el nombre de un tipo de distribución estadistica para la generación de números aleatorios de la tasa de llegada de la forma 'ArrivalRate(STRING)'

                                    
                                Arrival Rate(STRING)

    PROCESSOR: Proc_10.0.0.1 in_use: 0 - average memory=200 - max memory=300 -- accs=3 -- cumm=600

        CÓDIGO DE DONDE PROVIENE: (Se recalca que esta línea de codigo proviene de recorrer un mapa que almacena los procesadores (map<string, Processor*> processors))
            
            cout << "PROCESSOR: " << procs.second->to_string() << " in_use: " << procs.second->in_use() << " - average memory=" << procs.second->average_memory_consumption() << " - max memory=" << procs.second->max_memory_consumption() << " -- accs=" << procs.second->_ram_memory._nbr_accesses << " -- cumm=" << procs.second->_ram_memory._cumulative_use<< endl;

            Detalles de los valores de Salida:
                procs.second->to_string()                       Llama al método to_string() del objeto procs.second (que es un puntero a un objeto Processor) y concatena su resultado en la salida  
                    to_string()                                 Este método realiza la siguiente concatenación ("Proc_" + _name) donde _name es el identificador del procesador (10.0.0.1 en este caso)
                                                                Esta línea de código se encarga de imprimir el Identificar o nombre del procesador (PROC_10.0.0.1 en este caso)
                procs.second->in_use()                          Llama al método in_use() del objeto procs.second y concatena su resultado en la salida
                procs.second->average_memory_consumption()      Llama al método average_memory_consumption() del objeto procs.second y concatena su resultado en la salida
                    average_memory_consumption()                Método que retorna el consumo promedio de memoria RAM del procesador
                                                                Este valor es de tipo double y es producto de la siguiente ecuación(Espacio usado acumulado/Nro de accesos)
                procs.second->max_memory_consumption()          Llama al método average_memory_consumption() del objeto procs.second y concatena su resultado en la salida
                    max_memory_consumption()                    Método que retorna el consumo maximo de memoria RAM del procesador
                                                                Este valor es de tipo uint32_t
                procs.second->_ram_memory._nbr_accesses()       LLama al método _nbr_accesses() del objeto procs.second y concatena su resultado en la salida
                    _nbr_accesses()                             Número de veces que fue accedida la memoria RAM del procesador
                procs.second->_ram_memory._cumulative_use()     Accede al miembro _cumulative_use de la estructura _ram_memory del objeto procs.second y concatena su valor en la salida
                    _cumulative_use()                           Espacio usado acumulado de la memoria RAM del procesador

        Glosario detallado de Valores:
            PROCESSOR:                  Indica que la información siguiente está relacionada con un procesador 
                Proc_10.0.0.1           Identificador o nombre del procesador, en este caso hace referencia al procesador (10.0.0.1)
            in_use: 0                   Indica el tiempo de uso que tuvo ese procesador (0 en este caso)
            average memory=200          Espacio promedio de uso de memoria que el procesador utilizó (200 en este caso)
            max memory=300              Espacio maximo usado de memoria que el procesador utilizó (300 en este caso)
            -accs=3                     Número de accesos que ha tenido el procesador (3 accesos o solicitudes tuvo en este caso)
            --cumm=600                  Espacio usado acumulado (600 en este caso)               

    PROCESSOR: Proc_10.0.0.1 - CORE: Core_0 time_in_use: 0 total_time: 0.0916714 utilization: 0
    
        CÓDIGO DE DONDE PROVIENE: (Se recalca al igual que en el caso anterior que en este caso estamos recorriendo los núcleos pertenecientes a cada procesador almacenado con anterioridad)

            cout << "PROCESSOR: " << procs.second->to_string() << " - CORE: " << cores->to_string() << " time_in_use: " << cores->_in_use << " total_time: " << SIM_TIME << " utilization: " << (double)(cores->_in_use/SIM_TIME) << endl;

             Detalles de los Valores de Salida:
                procs.second->to_string()                       Llama al método to_string() del objeto procs.second (que es un puntero a un objeto Processor) y concatena su resultado en la salida  
                    to_string()                                 Este método realiza la siguiente concatenación ("Proc_" + _name) donde _name es el identificador del procesador (10.0.0.1 en este caso)
                                                                Esta línea de código se encarga de imprimir el Identificar o nombre del procesador (PROC_10.0.0.1 en este caso)
                cores->to_string()                              Llama al método to_string() del objeto 'cores'(que es un puntero a un objeto 'Core') y concatena su resultado en la salida
                cores->_in_use                                  Tiempo que estuvo en uso el núcleo
                SIM_TIME                                        Tiempo de simulación REAL, no el definido por _simulation_time
                (double)(cores->_in_use/SIM_TIME)               Este valor corresponde a la Utilización del Núcleo. Es una medida que indica la fracción de tiempo que el núcleo ha estado ocupado
                                                                en relación con el tiempo total que duró la simulación

        Glosario detallado:
            PROCESSOR:          Indica que la información siguiente corresponde al identificador del procesador
             Proc_10.0.0.1      El procesador se identifica como 'Proc_10.0.0.1' y hace referencia al procesador (10.0.0.1)
            CORE:               Identificador del núcleo del procesador
                Core_0          El núcleo se identifica como 'CORE_0'
            time_in_use:        Tiempo que el núcleo ha estado en uso
                0               Valor que representa el tiemppo que el núcleo ha estado en uso (0 en este caso)
            total_time:         Tiempo total de actividad registrado para el núcleo
                0.0916714       Valor que representa el tiempo total de actividad registrado para el núcleo (0.0916714 en este caso)
            utilization:        Utilización del núcleo, posiblemente en porcentaje
                0               Valor que representa la fracción de tiempo que el núcleo ha estado utilizado en relación con el tiempo total que duró la simulación(0 en este caso)
    
    PROCESSOR UTILIZATION: 0.00125739

        CÓDIGO DE DONDE PROVIENE:       
            cout << "PROCESSOR utilization: " << (double)(tpo/CANT_CORES/SIM_TIME);
            
            Detalles de las variables:
                tpo:                
                CANT_CORES:         VARIABLE QUE SE INICIALIZA CON EL VALOR DE '32' en la clase glob.h (#define CANT_CORES 32)                
                SIM_TIME:           TIEMPO DE SIMULACION (REAL), no el definido por _simulation_time. Porque las tuplas se pueden haber terminado de procesar antes
            
            Notas del Código:
            Esta línea de código imprime el mensaje "PROCESSOR utilization: " seguido de la utilización calculada del procesador
            La utilización se calcula como el tiempo total de procesamiento (tpo) dividido por el número de núcleos (CANT_CORES) y luego dividido por el tiempo total de simulación (SIM_TIME)
            El resultado de esta expresión se convierte a double para asegurar la precisión de la división de coma flotante
