Documentación clase processor.cc:

    Método get_next_node:

        Declaración de la función:

            bool Processor::get_next_node(Node **node_address)

            Deglose Detallado:
                
                bool                        Tipo de retorno de la función 'get_next_node', nos devuelve un valor booleano (true or false)
                Processor::get_next_node    'Processor' es el nombre de la clase a la cual pertenece esta función
                                            'get_next_node' es el nombre de la función encargada de obtener el siguiente nodo disponible
                Node **node_address         Parametro de entrada 'node_address' que es un puntero a un puntero de un objeto de tipo 'Node'
                                            Permite que la función modifique la dirección del puntero 'node_address' para que apunte al nodo que se va a procesar
                                            Si la función encuentra un nodo inactivo, asignará la dirección de este nodo al puntero 'node_address'
            
            Proposito General:
                Buscar un nodo que no esté en uso (inactivo) dentro de una cola de nodos y al encontrar uno, actualiza el puntero 'node_address' para que apunte a ese nodo
                y devuelve el valor 'true'.Si no encuentra ningún nodo inactivo, la función devolvera un valor 'false'
        
        Cuerpo de la función:

            bool resp = false;              La variable booleana 'resp' se incializa con el valor 'false' y será la respuesta del método 'get_next_node'   
            list<Node*> auxiliary_list;     'auxiliary_list' se utiliza para almacenar temporalmente nodos que están en uso (NODE_BUSY)

            Bucle Principal:
                
                 //Extrae nodo a nodo hasta encontrar el primero que no este en uso (NODE_IDLE), mientras los guarda en list auxiliar
                while (!_nodes_queue.empty()) {
                Node *node = _nodes_queue.front();
                _nodes_queue.pop_front();
                
                Deglose Detallado:
                    while (!_nodes_queue.empty())       Esta línea de codigo se encarga de ejecutarse mientras '_nodes_queue' no este vacía
                    Node *node = _nodes_queue.front()   Se extrae una referencia al primer elemento de la lista '_nodes_queue' sin eliminarlo de la misma
                                                        Luego asigna esta referencia o dirección de memoria al puntero de tipo 'Node' llamado 'node'
                    _nodes_queue.pop_front()            Aqui se elimina el primer nodo de la cola '_nodes_queue', en el contexto donde se está procesando el primer nodo
                                                        Es necesario una vez este primer nodo ya es procesado y no se necesita en la lista, permitiendo que el siguiente nodo
                                                        en la cola avance para ser procesado
            
                Verificación del estado del nodo:

                    // Verifica que no esté en uso (en ejecución en algún otro core)
                     if( node->get_node_state() == Node::NODE_IDLE ){
                        resp = true;
                        *node_address = node;  
                        break;
                    }else{
                        auxiliary_list.push_back( node );
                    }

                    Deglose Detallado:

                        if( node->get_node_state() ==Node::NODLE_IDLE)  Aqui se verifica si el estado del nodo 'node->get_node_state()' es 'node::NODE_IDLE'
                                                                        Esto significa que el nodo no está en uso actualmente
                        resp = true                                     Se establece con valor 'true' indicando que se ha encontrado un nodo que no está en uso
                        *node_address = node                            Asigna la dirección del nodo a 'node_address', el nodo encontrado se pasa a la dirección proporcionada
                                                                        para su posterior procesamiento en el 'core'
                        break                                           Se utiliza para salir del bucle 'while' ya se ha encontrado un nodo que cumple la condición de no estar en uso
                        auxiliary_list.push_back (node)                 Si el nodo no está en estado 'NODE_IDLE', se añade a 'auxiliary_list'
                                                                        Se guarda el nodo en una lista auxiliar para procesarlo más tarde

    Método send_tuple:

        Declaración de la función:

            //Sobrecarga del metodo
            //Envia fisicamente la tupla al procesador de destino del Spout/Bolt
            void Processor::send_tuple( string bolt_id, shared_ptr<Tupla> tupla )

            Deglose Detallado:
                
                void                        El método 'send_tuple' no retorna ningún valor
                Processor::send_tuple()     Indica que este método pertenece a la clase 'Processor' y 'send_tuple' es el nombre del método
                                            Se realiza una sobrecarga del método 'send_tuple'
                string bolt_id              Parámetro que representa el 'ID' del 'BOLT' al que se enviará la tupla
                shared_ptr<Tupla> tupla     Parámetro que representa la tupla que se va a enviar, usando un puntero inteligente 'shared_ptr' para la gestión de memoria
        
        Cuerpo de la función:

            this->send_tuple(tupla)         Se llama a otra sobrecarga del método 'send_tuple' pasando la tupla 'tupla' como parámetro de entrada o argumento
                                            Dentro del mismo objeto 'Processor' hay otro método 'send_tuple' que toma un 'shared_ptr<Tupla>' como parámetro de entrada
        
        Propósito General:
            Este método realiza una sobrecarga que facilita el envío de una tupla a un 'Bolt' especifico identificado por 'bolt_id'. Sin embargo en su implementación actual
            no usa el parametro 'bolt_id' directamente. En lugar de eso delega la tarea de envío a otro método 'send_tuple' que toma solo la tupla como argumento
    
    Método send_tuple:

        Declaración de la función:

            //Envia "fisicamente" la tupla al procesador de destino del Spout/Bolt
            void Processor::send_tuple( shared_ptr<Tupla> t )

            Deglose Detallado:
                void                        El método no retorna ningún valor
                Processor::send_tuple()     Indica que este método pertenece a la clase 'Processor' y 'send_tuple' es el nombre del método
                shared_ptr<Tupla> t         Parámetro que representa la tupla que se va a enviar, usando un puntero inteligente 'shared_ptr' para la gestión de memoria
        
        Cuerpo de la función:

            this->_net_iface->sendMessage( t );     Aquí se llama al método 'sendMessage' de '_net_iface' pasando la tupla 't' como argumento
                                                    '_net_iface' es probablemente un puntero o referencia a una clase de interfaz de red que se encarga de la comunicación
                                                    entre procesadores o nodos
                                                    'sendMessage(t)' envía la tupla al destino correspondiente utilizando la interfaz de red definida en '_net_iface'
        
        Propósito General del Método:
            Envía fisicamente una tupla a su destino utilizando la interfaz de red asociada al procesador. Este método encapsula la lógica necesaria para transferir una tupla
            desde un nodo 'Spout/Bolt' a otro procesador o nodo en el sistema
    
    Método insert_tuple:

        Declaración de la función:

            //Agrega tupla para ser procesada por Spout/Bolt en algun Core del Processor actual
            //Y agenda la ejecucion del Bolt en algun core
            void Processor::insert_tuple( shared_ptr<Tupla> t )

            Deglose Detallado:

                void                            El método no retorna ningún valor
                Processor::insert_tuple()       Indica que este método pertenece a la clase 'Processor' e 'inser_tuple' es el nombre del método      
                shared_ptr<Tupla> t             Parámetro que representa la tupla que se va a enviar, usando un puntero inteligente 'shared_ptr' para la gestión de memoria

        Cuerpo de la función:

            this->_tuple_queue[ t->id_destino() ].push_back( t );       Inserta la tupla 't' en una cola especifica para que Bolt la extraiga
                                                                        '_tuple_queue' es un mapa donde las claves son los destino 'id_destino' de la tupla y los valores son colas 'listas' de tuplas
                                                                        'push_back(t)' añade la tupla 't' al final de la cola correspondiente
            this->malloc( t->tamanio() );                               Tambien reservamos y asignamos espacio de memoria RAM para almacenar la tupla 't->tamanio' retorna el tamaño de la tupla
                                                                        Reserva espacio en memoria
            this->storeTuple( t );                                      Guarda efectivamente la tupla en la memoria reservada
            Bolt *bolt = _bolts[ t->id_destino() ];                     Ahora se inserta al Bolt en la cola para que algun Core lo ejecute
                                                                        Se obtiene el Bolt correspondiente al destino de la tupla desde el mapa '_bolts'. La clave es el 'id_destino' de la tupla
            _nodes_queue.push_back( ( Node*) bolt );                    Tupla es 'smart_ptr', por lo que no es necesario llevar contador de referencias para decidir su borrado
                                                                        Realiza un cast de bolt a Node*, ya que _nodes_queue es una cola de punteros a Node
            this->activate_core( );                                     Despertar a algun Core para que el Spout/Bolt procese la tupla
                                                                        Llama al método activate_core() para despertar algún Core disponible y que el Spout o Bolt procese la tupla
                                                                        'active_core()' revisará la lista de cores y activará el primero que este libre 'CORE_IDLE'
    
    Método schedule_spout_processing:

        Declaración de la función:

            void Processor::schedule_spout_processing( string spout_name )

            Deglose Detallado:

                void                                    El método no retorna ningún valor
                Processor::schedule_spout_processing    Indica que este método pertenece a la clase 'Processor' y 'schedule_spout_processing' es el nombre del método
                string spout_name                       'spout_name' es un parámetro de tipo 'string' que representa el nombre del Spout que se va a programar para procesamiento
        
        Cuerpo de la función:

             _nodes_queue.push_back( ( Node * ) _spouts[ spout_name ] );
             this->activate_core( );

             Deglose Detallado:

                _nodes_queue                Es una cola(lista) de punteros a 'Node' que contiene los nodos que deben ser procesados
                _spouts[spout_name]         Se obtiene el 'Spout' correspondiente a 'spout_name' desde el mapa '_spouts'
                    _spouts                 Mapa donde las claves son nombres de 'Spouts' y los valores son 'punteros' a objetos 'Spout'
                Node* _spouts[spout_name]   Realiza un cast de 'Spout' a 'Node*' ya que '_nodes_queue' es una cola de punteros a 'Node'
                activate_core()             Despierta algún 'Core' disponible y que el 'Spout' sea ejecutado
                                            Revisará la lista de cores y activará el primero que esté libre (en estado 'CORE_IDLE')
    
    Método activate_core:

        Declaración de la función:

            void Processor::activate_core() Función que no retorna ningún valor
        
        Cuerpo de la Función:

            Bucle for:

                for( unsigned int i =0; i < this->_cores.size(); i++)       Itera sobre todos los 'cores' en '_cores'
                                                                            this->_cores.size() obtiene el número de cores en el procesador

                    handle<Core> c = this->_cores.front()       this->_cores.front() obtiene el primer elemento de la cola '_cores'
                                                                handle<Core> c: Crea un manejador (handle) al core obtenido
                    this->_cores.pop_front()                    Elimina el primer core de la cola '_cores'
                    this->_cores.push_back(c)                   Añade el core 'c' al final de la cola '_cores'
                                                                Este ultimó metodo se asegura que todos los cores se roten y no se procesen siempre en el mismo orden
                    
                    Verificación del Estado del Core:

                        if(c->_state == Core::CORE_IDLE)        Comprueba si el core 'c' está en en estado 'CORE_IDLE' (linre y disponible para activarse)
                            c->activate()                       Si el core está libre, se activa llamando al método 'activate()' del core 'c'
    
    Método pull_tuple:

        Declaración de la función:

            shared_ptr<Tupla> Processor::pull_tuple( string id)
            
            Deglose Detallado:
                shared_ptr<Tupla>       Indica que el método retorna un puntero inteligente a un objeto 'Tupla'
                string id               Toma un parámetro 'id' de tipo 'string' que representa el nombre del Spout o Bolt
        
        Cuerpo de la función:

            shared_ptr<Tupla> t = this->_tuple_queue[ id ].front( );
            this->_tuple_queue[ id ].pop_front();
            return t;

            Deglose Detallado:
                this->_tuple_queue[id]                  Accede a la cola de tuplas asociada con el 'id' proporcionado
                .front()                                Obtiene el primer elemento de la cola sin eliminarlo
                shared_ptr<Tupla> t                     Crea un puntero inteligente 't' que apunta a esta tupla
                this->_tuple_queue[id].pop_front()      Elimina el primer elemento de la cola '_tuples_queue' que es la tupla que se acaba de obtener en el paso anterior
                return t                                Retorna el puntero inteligente 't' que apunta a la tupla extraida
    
    Método nodes_queue_size:

        int Processor::nodes_queue_size( ){             
            return _nodes_queue.size( );
            }
        
        Deglose Detallado:
            int Processor::nodes_queue_size()           Método de la clase 'Processor'
                                                        Devuelve un valor de tipo 'int'
            return _nodes_queue.size()                  Obtiene el número de elementos 'nodos' presentes en '_nodes_queue'
    
    Método nodes_queue_empty:

        //Indica si hay Spouts/Bolts que requieren servicio en algun Core del Processor
        bool Processor::nodes_queue_empty(){            Método de la clase 'Processor'
                                                        Devuelve un valor de 'true' o 'false'
            return _nodes_queue.empty();                Comprueba si la cola de nodos está vacía
        }

    Método tuples_queues_empty:

        //Indica si la cola de tuplas del Bolt esta vacia
        bool Processor::tuple_queues_empty( string id ){    Método de la clase 'Processor'   
                                                            Devuelve un valor de 'true' o 'false'
                                                            Toma el identificador del 'Spout o Bolt' como parámetro de entrada
            return _tuple_queue[ id ].empty();              Comprueba si la cola de tuplas asociada con un 'Spout o Bolt' especifico 'id' está vacía y devuelve 'true'
                                                            Sí esa cola contiene una o más tuplas devuelve 'false'
            }

    Método tuples_queues_size_for_bolt:

        int Processor::tuple_queues_size_for_bolt( string id ){ Método de la clase 'Processor'
                                                                Devuelve un valor de tipo 'int'
                                                                Toma el identificador del 'Bolt' como parámetro de entrada
            return _tuple_queue[ id ].size();                   Obtiene el número de tuplas que están actualmente en la cola asociada con un bolt especifico 'id'
            }

    Método assign_bolt:

        //Guardamos los Bolts en un mapa (separado de los Spouts)
        void Processor::asign_bolt( Bolt *bolt)     
            this->malloc( 100 );                                Se llama al método 'malloc' para solicitar espacio de memoria para el Bolt
            this->_bolts[ bolt->to_string() ] = bolt;           Asigna el 'Bolt' al mapa '_bolts' utilizando el nombre del 'Bolt' como clave

    Método assign_spout:

        //Guardamos los Spouts en un mapa diferente a los Bolts
        void Processor::assign_spout( Spout *spout )        
            this->malloc( 100 );                                Se llama al método 'malloc' para solicitar espacio de memoria para el 'Spout'   
            this->_spouts[ (spout)->to_string() ] = spout;      Asigna el 'Spout' al mapa '_spouts' utilizando el nombre del 'Spout' como clave

    Método malloc:

        //Solicita espacio de memoria
        void Processor::malloc( uint32_t required_space )
            bool free_space = this->_ram_memory.malloc( required_space );
            assert ( free_space );
        
        
        Proposito General:
            Se llama al método 'malloc' del objeto '_ram_memory' para solicitar espacio de memoria
            Se verifica con 'assert' que el espacio de memoria fue asignado correctamente ('free_space' es true)

    Método storeTuple:

        //Almacena una tupla
        void Processor::storeTuple( shared_ptr<Tupla> t )
            this->_ram_memory.storeTuple( t );
        
        Proposito General:
            Se llama al método 'storeTuple' del objeto '_ram_memory' para almacenar la tupla


    Método removeTuple:

        //Remueve una tupla
        void Processor::removeTuple( shared_ptr<Tupla> t )
            this->_ram_memory.removeTuple( t );
            this->_ram_memory.free( t->tamanio() );

        Proposito General:
            Se llama al método 'removeTuple' del objeto '_ram_memory' para remover la tupla 't'
            Se llama al método 'free' del objeto '_ram_memory' para liberar el espacio de memoria ocupado por la tupla
    
    Método average_memory_consumption:

        double Processor::average_memory_consumption( )
            return this->_ram_memory.average_use();

        Proposito General:
            Se llama al método 'average_use' del objeto '_ram_memory' y devuelve el resultado como un valor 'double'
    
    Método max_memory_consumption:

        uint32_t Processor::max_memory_consumption( )
            return this->_ram_memory.max_memory_consumption( );

        Proposito General:
            Se llama al método 'max_memory_consumption' del objeto '_ram_memory' y devuelve el resultado como un valor 'uint32_t'
    
    Método to_string:

        string Processor::to_string( )
            return "Proc_" + _name;
        
        Proposito General:
            Se concatena el prefijo 'Proc_' con el nombre del procesador '_name' y devolver la cadena resultante
    
    Método get_IP:

        string Processor::get_IP( )
            return _IP;

        Proposito General:
            Devuelve el valor de la variable '_IP'

    Método increment_in_use:

        void Processor::increment_in_use( double tpo )
            this->_in_use += tpo;

        Proposito General:
            Se incrementa la variable '_in_use' por el valor de 'tpo',es decir, se incrementa el tiempo de uso del procesador
    
    Método in_use:

        double Processor::in_use( )
            return this->_in_use;
        
        Proposito General:
            Devuelve el valor de la variable '_in_use'

    Método in_use:

        void Processor::in_use( double tpo )
            this->_in_use = tpo;
        
        Proposito General:
            Establece el valor de la variable '_in_use' a 'tpo'

    Método cores:

        std::list<handle<Core>> Processor::cores()
            return this->_cores;

        Proposito General:
            Devuelve la lista de núcleos '_cores' asociados con el procesador
