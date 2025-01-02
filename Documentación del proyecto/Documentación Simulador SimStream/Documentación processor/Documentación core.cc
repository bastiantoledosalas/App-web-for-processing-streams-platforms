Documentación Clase core.cc:

Inclusiones de Archivos:

    #include "core.h"
    #include "processor.h"

Definición de Variable Global:

    double Core::SIM_TIME = 0.0     Se inicializa la variable estática 'SIM_TIME' con el valor 0.0

Función inner_body:

    Declaración de la función:

        void Core::inner_body()         La función inner_body no recibe ningún parametro de entrada y no retorna ningún valor al ser declarada con el tipo 'void'
    
    Cuerpo de la función:

        Declaración Variable bool_no_nodes_to_process:

        bool_no_nodes_to_process = false;       Variable utilizada para indicar si los nodos de la cola estan marcados como ocupados (por otro core)
    
        Revisión de Spouts/Bolts:

            if (this->_processor->nodes_queue_empty() || _no_nodes_to_process) {                       
                this->_state = CORE_IDLE;
                SIM_TIME = this->time();
                passivate(); // Suspende la ejecución del `Core` hasta que haya trabajo
            }

            Deglose Detallado:

                this->_processor->nodes_queue_empty()   Verifica si la cola de nodos del procesador está vacía
                                  nodes_queue_empty()   Si esta función devuelve 'true' significa que no hay nodos disponibles para ser procesados en ese momento
                _no_nodes_to_process                    Variable booleana utiliza para indicar si no hay nodos disponibles para procesar en el 'Core'
                                                        Si esta variable tiene valor 'true' significa que previamente no se pudo obtener un nodo para procesar
                this->_state = CORE_IDLE                Cambia el estado del 'Core' a 'CORE_IDLE', Este estado indica que el 'Core' no está ocupado procesando ningún nodo
                SIM_TIME = this->time()                 Se actualiza la variable estática 'SIM_TIME' con el valor del tiempo actual del 'Core'
                        this->time()                    Devuelve el tiempo actual del simulador o del 'Core' en ejecución
                passivate()                             Se llama a esta función para suspender la ejecución del 'Core'
                                                        El 'Core' deja de estar activo y pasa a estado de 'suspensión' hasta ser reactivado por la llegada de un nuevo para procesar
            Proposito General:
                En este código se realiza la revisión en caso de haber algún Spout/Bolt que necesite procesamiento

        Obtener Bolt/Spout que necesita ser Procesado:

            Node *node;
            if( !this->_processor->get_next_node( &node ) ){    Verifica si 'get_next_node' devuelve 'false', esto indicaria que no hay nodos disponibles para procesar
                _no_nodes_to_process = true;
                continue;
            }

            Deglose Detallado:

                Node *node                                  Declaración de un puntero a un objeto de tipo 'Node', donde 'node' sera usado para apuntar a un nodo que necesita ser procesado
                this->_processor->get_next_node( &node )    Llamada a la función 'get_next_node' del objeto '_processor'
                    get_next_node(&node)                    Función que intenta obtener el siguiente nodo disponible que necesita ser procesado y asigna su dirección al puntero 'node'
                    &node                                   El operador & pasa la dirección de node para que get_next_node pueda modificar el puntero directamente
                no_nodes_to_process = true                  Esta asignación de valor 'true' a la variable indica que no hay nodos disponibles para ser procesados en este momento
                continue                                    Hace que el bucle 'while' salte a la siguiente iteración inmediatamente
                                                            No se ejecutará el código restante en la iteración actual del bucle, se volverá a comprobar si hay nodos disponibles para ser procesados en el próximo ciclo

            Proposito General:
                intenta obtener un nodo (Bolt o Spout) que necesita ser procesado. Si no hay nodos disponibles (get_next_node devuelve false)
                se marca la variable _no_nodes_to_process como true y el bucle while continúa con la siguiente iteración, volviendo a intentar obtener un nodo en la próxima vuelta del bucle

        Cambio de Estado del Core:

            this->_state = CORE_BUSY;
            _no_nodes_to_process = false;
            node->set_node_busy();

            Deglose Detallado:
                this->_state = CORE_BUSY        Establece el estado del 'Core' a 'ocupado' o 'CORE_BUSY', importante para que el sistema sepa que este Core está activo y trabajando
                    this->_state                Miembro de la clase 'Core' que representa el estado actual del Core
                _no_nodes_to_process = false    Esta asignación de valor 'false' indica que hay nodos para procesar, ya que acabamos de obtener uno
                node->set_node_busy()           Cambia el estado del nodo para indicar que está siendo procesado, importante para evitar que el mismo nodo sea asignado a otro 'Core' mientras esta en proceso
                                                Asegura que el nodo no sea procesado simultáneamente por múltiples 'Cores'
        
        Bases para manejar el procesamiento de nodos en el núcleo:

            double tpo_hold;
            Node::node_type n_type = node->_node_type;

            Deglose Detallado:
                double tpo_hold                             Esta declaración se utilizará posteriormente para almacenar tiempos de espera o tiempos de procesamiento
                Node::node_type n_type = node->_node_type   Esta enumeración define diferentes tipos de nodos que pueden existir en el sistema.
                                                            Por ejemplo, podría haber nodos de tipo 'SPOUT' y 'BOLT' donde cada uno tiene diferentes comportamientos y requerimientos de procesamiento
        
        Bloque SWITCH:

            switch( n_type )        Este switch determina el tipo de nodo 'SPOUT' o 'BOLT' y ejecuta el procesamiento correspondiente basado en ese tipo
                    n_type          Tipo de nodo que se obtuvo anteriormente ('Node::SPOUT' o 'Node::BOLT')
                
            Caso 'Node::SPOUT':

                case Node::SPOUT:   Declaración del caso para el Nodo 'SPOUT'

                Ejecución del Nodo:

                    tpo_hold = node->run( this->time( ) );
                    this->_in_use += tpo_hold;
                    this->_processor->increment_in_use( tpo_hold );

                    Deglose Detallado:
                        node->run(this->time())                 Llama al método 'run()' del objeto 'node' pero es sobreescrito por la clase 'spout.cc'
                                                                generando un tiempo de servicio a partir de una distribución estadistica y asignado a este 'NODO SPOUT'
                            this->time()                        Pasa el tiempo actual al método 'run()'
                        tpo_hold                                Se asigna el tiempo de servicio retornado a la variable 'tpo_hold'
                        this->_in_use += tpo_hold                           Se incrementa el tiempo en uso del 'Core' (this->_in_use) usando la variable 'tpo_hold'
                        this->_processor->increment_in_use(tpo_hold)        Se incrementa el tiempo de uso del 'Procesador' usando la variable 'tpo_hold'

                Manejo de la ejecución:

                    hold( tpo_hold )        Este método se llama con el 'tiempo de servicio del NODO SPOUT' para simular el tiempo de procesamiento del nodo
                
                Envio de Tuplas:

                    tpo_hold = node->send_tuple( );                 Se llama al método 'send_tuple()' que es sobreescrito por la clase 'spout.cc' ( Spout::send_tuple( ))
                                                                    y devuelve el tiempo necesario para enviar las tuplas 'tpo_emit' para ser asignado a la variable 'tpo_hold'
                    this->_in_use += tpo_hold;                      Se incrementa la variable '_in_use' del 'Core' con el tiempo 'tpo_hold' que se tomó para enviar la tupla
                    this->_processor->increment_in_use( tpo_hold ); Se llama al método 'increment_in_use' del 'Procesador' pasando 'tpo_hold' como argumento
                                                                    Este método actualiza el tiempo de uso del 'Procesador',es decir, cuanto tiempo ha estado en uso el 'Procesador'
                    hold( tpo_hold );                               Se simula el tiempo de espera o de procesamiento necesario, asegurandose que el simulador avance el tiempo
                                                                    en función del tiempo de envío de la tupla, representando la carga de trabajo en el 'Core'
                    break;

                    Proposito General:
                        Este codigo se centra en el proceso de envío de tuplas por parte del nodo. El tiempo que se tarda para enviar la tupla se mide y se usa para actualizar
                        las metricas del 'Core' y del 'Procesador', Además de simular el tiempo de espera correspondiente en la simulación
                        Asegurando que el 'Core' y el 'Procesador' reflejen correctamente el tiempo invertido en el envío de tuplas y que la simulación avance de acuerdo
                        con el tiempo requerido para esta operación
                
            Caso 'Node::BOLT':

                case Node::BOLT:    Declaración del caso para el Nodo 'BOLT'

                Cambio de Estado del Nodo:

                    node->_node_state = Node::NODE_BUSY

                    Deglose Detallado:
                        node->_node_state = Node::NODE_BUSY     El estado del nodo se cambia a 'NODE_BUSY' indicando que esta siendo procesado

                Ejecución del nodo:

                    tpo_hold = node->run( this->time() );           Llama al método 'run()' del objeto 'node' pero es sobreescrito por la clase 'bolt.cc'
                                                                    Generando un tiempo de servicio por la función 'Bolt::process_tuple()' a partir de una distribución estadistica
                                                                    y retornando este valor (variable 'tpo' de la clase Bolt) a este 'NODO BOLT' para ser asignado a 'tpo_hold'
                                                                    Esto determina cuanto tiempo se ha invertido en procesar la tupla en el nodo 
                    this->_in_use += tpo_hold;                      Se actualiza o incrementa la métrica '_in_use' del 'Core' agregando el tiempo 'tpo_hold'
                                                                    Esto refleja cuanto tiempo adicional ha estado en uso el 'Core' debido al procesamiento de la tupla
                    this->_processor->increment_in_use( tpo_hold ); Se llama al método 'increment_in_use' del 'Procesador' pasando 'tpo_hold' como argumento
                                                                    Este método actualiza el tiempo de uso del 'Procesador', es decir, cuanto tiempo ha estado en uso el 'Procesador'
                    
                Manejo de la ejecución:

                    hold( tpo_hold )        Este método se llama con el 'tiempo de servicio del NODO BOLT' para simular el tiempo de procesamiento del nodo
                
                Envio de Tuplas:
                    
                    tpo_hold = node->send_tuple();                      Se llama al método 'send_tuple()' que es sobreescrito por la clase 'bolt.cc' (Bolt::send_tuple( ))
                                                                        y devuelve el tiempo necesario para enviar las tuplas 'tpo_emit' para ser asignado a la variable 'tpo_hold'
                    this->_in_use += tpo_hold;                          Se incrementa la variable '_in_use' del 'Core' con el tiempo 'tpo_hold' que se tomó para enviar la tupla
                    this->_processor->increment_in_use( tpo_hold );     Se llama al método 'increment_in_use' del 'Procesador' pasando 'tpo_hold' como argumento
                                                                        Este método actualiza el tiempo de uso del 'Procesador',es decir, cuanto tiempo ha estado en uso el 'Procesador'
                    hold ( tpo_hold )                                   Se simula el tiempo de espera o de procesamiento necesario, asegurandose que el simulador avance el tiempo
                                                                        en función del tiempo de envío de la tupla, representando la carga de trabajo en el 'Core'
                
                Eliminar Tupla de la MEMORIA RAM:
                    
                    this->_processor->removeTuple( ((Bolt*)node)->get_current_tuple() );    Se obtiene la tupla actual del nodo, que es un objeto de tipo 'Bolt'
                                                                                            Para ser eliminada esa tupla de la memoria del 'Procesador'

                Restablecer el Estado del Nodo:
                    
                    node->_node_state = Node::NODE_IDLE;    
                    
                    Proposito General:
                        Se procede a cambiar el estado del nodo a 'NODE_IDLE', indicando que el nodo está inactivo y disponible para el siguiente procesamiento
                        Permite que el nodo esté disponible para manejar nuevas tuplas o tareas una vez que el envío de la tupla actual haya sido completado
        
        Método set_node_idle():

            node->set_node_idle()

                Proposito General:
                    El método 'set_node_idle()' cambia el estado del nodo a 'inactivo' o 'idle'
                    Indicando que el nodo ha terminado su tarea actual y está disponible para recibir nuevas tuplas
                
                Contexto en el Código:
                    Tras procesar y enviar la tupla, este método se llama para marcar el nodo como inactivo
                    Antes de esta llamada, el estado del nodo podria haber sido 'NODE_BUSY' indicando que ese nodo estaba realizando una tarea de procesamiento
                
                Ejemplo:
                Si se tiene un nodo que está procesando datos y, una vez que ha terminado de procesar y enviar los datos, 
                debes asegurarte de que el nodo esté disponible para procesar más datos
                Aquí es donde este método juega un papel crucial al asegurarse que el nodo vuelva a su estado inicial 'IDLE' permitiendo que sea considera para nuevos procesamientos


Función get_node_from_processor:

    Declaración de la función:

        void Core::get_node_from_processor( ){}     Esta función no se encuentra implementada pero su objetivo es obtener un nodo del procesador y almacenarlo en 'Core'
                                                    Esto con el fin de obtener un nodo que necesite procesamiento

Función set_processor:

    Declaración de la función:

        void Core::set_processor(Processor *processor)      Esta función recibe un puntero 'processor' al objeto 'Processor' que se quiere asociar con el 'Core'

    Cuerpo de la función:

        this->_processor = processor;       Se asigna el puntero recibido como parámetro 'processor' al miembro de la clase 'Core' '_processor'
                                            Esto permite que el 'Core' tenga una referencia al 'Processor' que lo contiene

    Contexto del Código:
        Una vez que se ha asociado un 'Processor' con un 'Core' mediante esté método, el 'Core' puede utilizar el 'Processor' para obtener nodos que necesiten procesamiento,
        actualizar el estado del procesador, etc.
        Esto facilita la comunicación entre el 'Core' y el 'Processor' permitiendo al 'Core' acceder a funcionalidades y datos del 'Processor'

Función Core::to_string:

    Declaración de la función:

        std::string Core::to_string()       Esta función retorna una variable de tipo std::string

    Cuerpo de la función:

        return _name                        Devuelve el valor del miembro de datos '_name' representa el nombre o identificador del objeto 'Core'
                                                