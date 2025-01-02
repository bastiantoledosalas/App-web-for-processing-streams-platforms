Archivo de Topologías:
    Cada línea consiste  de pares de nodos de forma nodo_origen - nodo_objetivo (hacia donde va):

        Ejemplo:

            Spout_0 Bolt_0      (El nodo Spout_0 envía sus tuplas al nodo Bolt_0)


Archivo de Especificación de Nodos:

    En cada línea se tienen los siguientes datos:

        Node_Name:      El nombre de un nodo de la topología
        Tipo     :      S se utiliza para un Spout u origen de datos de la topología (una topología necesita de al menos 1 Spout)
                        B se utiliza para un Bolt o elemento de procesamiento de la topología
        Replicación:    El número de replicas para el nodo
        Agrupamiento:   El tipo de agrupamiento utilizado para las tuplas, existen 4 tipos de agrupamiento pero los ultimos 2 son iguales:

                SHUFFLE_GROUPING:   Este agrupamiento itera sobre un MAPA para enviar una replica de cada Bolt de destino
                                    Corresponde a un esquema de agrupamiento 'Round Robin' donde las tuplas se distribuyen equitativamente entre un conjunto de nodos destino
                                
                                
                                '0' es el identificador que se utiliza para seleccionar este tipo de agrupamiento en el archivo de especificación de nodos   

                FIELD_GROUPING: Este agrupamiento HASH se utiliza para determina el nodo de destino para las tuplas
                                
                                '1' es el identificador que se utiliza para seleccionar este tipo de agrupamiento en el archivo de especificación de nodos

                GLOBAL_GROUPING & ALL_GROUPING:    Estos dos ultimos agrupamientos no realizan ninguna acción y solamente retornan un valor 1e-9 de tipo 'double'
                                
                                '2' es el identificador que se utiliza para seleccionar el tipo de agrupamiento GLOBAL_GROUPING en el archivo de especificación de nodos
                                
                                '3' es el identificador que se utiliza para seleccionar el tipo de agrupamiento ALL_GROUPING en el archivo de especificación de nodos
        
       
        Procesamiento:  Dirección IP de la máquina simulada que aloja el nodo
    
    En el caso de los nodos SPOUT (type=S) se agregan los siguiente campos adicionales:

        Tasa de llegada:                Corresponde al nombre de una distribución estadistica para la generación de números aleatorios del formArrivalRate(STRING) 
        Tiempo promedio de servicio:    Corresponde al nombre de una distribución estadistica para la generación de números aleatorios del formulario                   
                                        AvgServiceTimeFunction(STRING) para representar el tiempo promedio de servicio para el nodo

    En el caso de los nodos BOLT (Type=B) se agregan los siguientes campos adicionales:

        Tipo de Bolt:   El tipo de procesamiento que realiza el nodo a cada tupla que procesa. El tipo de Bolt puede ser:
                        '0' Normal (Cada tupla produce una salida)
                        '1' Filtro (Algunas tuplas producen una salida)
                        '2' Splitter (Produce una salida para cada nodo conectado)
                        '3' Final (No produce ninguna salida)

        NOTA IMPORTANTE: RESPECTO AL TIPO DE BOLT Y REVISANDO EL CODIGO CORRESPONDIENTE AL MAIN.CC SE LOGRA DETERMINAR QUE ESTA DESCRIPCIÓN QUE ESTA DOCUMENTADA EN EL ARCHIVO README.TXT DEL SIMULADOR EN C++ NO CORRESPONDE, PUESTO QUE COMO SE PUEDE NOTAR EN EL ARCHIVO NODES.TXT UTILIZADO PARA REALIZAR LAS SIMULACIONES LA LÍNEA QUE CORRESPONDE A LA DESCRIPCIÓN DE UN BOLT ESTE VALOR NO CORRESPONDE AL TIPO DE BOLT SINO MÁS BIEN AL 'nro_tuplas_output'. A CONTINUACIÓN SE MUESTRA UN EJEMPLO DE LO DICHO:

            EJEMPLO DE ESPECIFICACIÓN DE UN BOLT EN EL ARCHIVO NODES.TXT:

                TwitterFilter                  B   10   0   10.2.0.2   nbinom(1,0.26063,0.0,1.0)   expon(1.646999997256628e-05,0.00040570702420820206)

                COMO SE PUEDE DENOTAR LUEGO DE PASAR EL PROCESADOR: 10.2.0.2 EL VALOR SIGUIENTE: nbin(1,0.26063,0,1.0) CORRESPONDE A:
                    
                        nro_tuplas_output = nbin(1,0.26063,0,1.0)
                
                Y EL VALOR SIGUIENTE CORRESPONDE A avg_service_time:

                        avg_service_time = expon(1.646999997256628e-05,0.00040570702420820206)
                        
        Tiempo promedio de servicio:    Corresponde al nombre de una distribución estadistica para la generación de números aleatorios del formulario
                                        AvgServiceTimeFunction(STRING) para representar el tiempo promedio de servicio para el nodo        

---------------------------------------------------------------------------------------------------------------------------------------------------------------------

    Ejemplo Linea del Archivo de Especificación de Nodos:

    KafkaSpout    S         10              0        10.0.0.2     fixed(0.0)                  expon(-1.0389139971820532e-11,0.024674476149550005)

        Esta linea del archivo se trabaja de la siguiente forma:

            Se crea un objeto 'stringstream' llamado 'st' utilizando esta línea completa almacenandola en la variable string 'linea' del archivo de configuración
            'stringstream' permite operar extrayendo los elementos individuales de la linea

            Se extrae el primer elemento de 'linea' y se almacena en la variable 'node_name'
            En este caso esta variable queda de la siguiente forma:

                node_name = KafkaSpout
            
            Luego se extrae el siguiente elemento de 'linea' y se almacena en la variable 'node_type'
            Este valor corresponde al tipo de nodo:

                node_type = S
            
            Se extrae el siguiente elemento de 'linea' y se almacena en la variable 'replication_level'
            Este valor indica cuántas réplicas de este nodo se deben crear:

                replication_level = 10
            
            IMPORTANTE: UNA RESTRICCIÓN QUE TIENE EL SIMULADOR ES QUE replication_level debe ser siempre mayor a 0
                        NO TIENE SENTIDO CREAR UN NODO SIN NINGUNA RÉPLICA

            Se extrae el siguiente elemento de 'linea' y se almacena en la variable 'grouping_type'
            Este valor corresponde al tipo de agrupamiento que se usará para distribuir las tuplas entre los nodos:

                grouping_type = 0
            
            Se extrae el siguiente elemento de 'linea' y se almacena en la variable 'proc_name'
            Este valor corresponde a la dirección del procesador al que se asignará el nodo:

                proc_name = 10.0.0.2
            
            Luego de esto Se verifica si el procesador (Processor) '10.0.0.2' existe en el mapa 'processors'

                Si no existe, se creara una nueva instancia de 'Processor' y se crea una instancia de 'NetIface' que representa la interfaz de red del procesador
                utilizando 'proc_name'
                Se creara un nuevo 'Processor' con el nombre, cantidad de núcleos 'CANT_CORES', la interfaz de red creada y un tamaño de memoria máximo 'MAX_MEMORY':

                    //Para fines de ruteo los CommonSwitchs utilizan IPs que comienzan con 10 y terminan en 1 donde el formato es el siguiente:
                    //IP=10.pod.sw.1

                    Processor _name = 10.0.0.2
                    Processor _IP = 10.0.0.2
                    CANT_CORES = 32 
                    net_iface = 10.0.0.2     Este será el nombre '_name' que se le asignará a este nuevo objeto de tipo NetIface
                    _ram_memory =            Se creará una memoria Ram a partir del procesador creado con anterioridad
                        _name = Mem_10.0.0.2
                        _capacity = 32
                        _in_use = 0
                        _free_space = 32
                        _cumulative_use = 0
                        _max_use = 0.0
                        _mbr_accesses = 0
            
            Luego si la variable 'node_type' = S entonces se almacena el valor siguiente en la variable 'avg_service_time'

                avg_service_time = fixed(0.0)
            
                Luego se almacena el valor siguiente en la variable 'arrival_rate' que es de tipo std::string
                Este valor corresponde a la tasa de arribo al Spout

                arrival_rate = expon(-1.0389139971820532e-11,0.024674476149550005)

                Luego se inserta este nodo Spout en el mapa 'nodes' con el nombre del nodo, un vector de réplicas del tamaño 'replication_level y el tipo 'S'
                Posterior a esto, se crea un 'Generator' para los Spouts y replicas que usan el mismo Spout
                Este 'Generator' se encargará de producir las tuplas para los Spouts

            Si la variable 'node_type' == B entonces se almacenan los valores siguientes en las siguientes variables

                nro_tuplas_output = nbinom(1,0.26063,0.0,1.0)
                avg_service_time = expon(1.646999997256628e-05,0.00040570702420820206)

                Se inserta el nodo Bolt en el mapa 'nodes' con el nombre del nodo, un vector de réplicas del tamaño 'replication_level0 y el tipo B'
                Se crea el nuevo bolt de tipo 'Bolt' pasando el nombre del nodo, su id de replica, su replication_level, avg_service_time, nro_tuplas_output, grouping_type
                Finalmente se asigna el Bolt a un procesador a traves de la función 'assign_bolt( bolt) '
            


