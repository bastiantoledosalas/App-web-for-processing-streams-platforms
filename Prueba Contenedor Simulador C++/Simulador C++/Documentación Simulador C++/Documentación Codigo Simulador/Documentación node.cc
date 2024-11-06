Documentación de la Clase node.cc:

    Inclusiones:

        #include "node.h"
        #include "processor/processor.h"

        Se incluyen los encabezados necesarios para la implementación de la clase Node y su interacción con la clase Processor
    
    Implementaciones de Métodos:

        double Node::run(double timestamp)

            Método virtual para procesar la tupla. Actualmente, no tiene implementación
    
        double Node::send_tuple()

            Método virtual para enviar una tupla. Actualmente, no tiene implementación
        
        void Node::set_processor(Processor *processor) {
            this->_processor = processor;
            }

            Asigna un Processor al nodo
            Parámetros: Processor *processor - puntero al objeto Processor
            Propósito: Asociar el nodo con un procesador específico
        
        void Node::add_node(Node *_node) {
            this->_node_map_list[_node->name()].push_back(_node);
            this->_node_map_vector[_node->name()].push_back(_node);
            }

            Establece conexiones entre el nodo fuente y los nodos objetivo
            Parámetros: Node *_node - puntero a otro nodo
            Propósito: Configurar las conexiones de topología entre nodos
        
        double Node::emit_tuple(std::shared_ptr<Tupla> t) {
            switch (_stream_grouping) {
                case SHUFFLE_GROUPING:
                    return emit_tuple_SHUFFLE_GROUPING(t);
                case FIELD_GROUPING:
                    return emit_tuple_FIELD_GROUPING(t);
                case GLOBAL_GROUPING:
                    return emit_tuple_GLOBAL_GROUPING(t);
                case ALL_GROUPING:
                    return emit_tuple_ALL_GROUPING(t);
                default:
                    return 1e-9;
            }
        }

            Emite una tupla basándose en el tipo de stream_grouping
            Parámetros: std::shared_ptr<Tupla> t - puntero compartido a la tupla
            Propósito:  Enviar la tupla según el tipo de agrupamiento
        
    Función emit_tuple_SHUFFLE_GROUPING:

        double Node::emit_tuple_SHUFFLE_GROUPING( shared_ptr<Tupla> tupla )

        Método de la clase Node que recibe un puntero compartido a una instancia de Tupla y devuelve un valor de tipo double
        Realiza Round Robin sobre los elementos de destino

        Cuerpo de la Función:

            Inicilización de contador:

                uint32_t i = 0;   La variable i se utiliza como contador para llevar el seguimiento del índice en el proceso de emisión de tuplas
                                Se inicializa con valor 0
            
            Inicio del Bucle:

                for (std::map<std::string, std::list<Node*>>::iterator it = _node_map_list.begin(); it != _node_map_list.end(); ++it) {
     
                Deglose del Bucle:

                    std::map<std::string, std::list<Node*>>::iterator it:   Define el tipo del iterador 'it'
                        std::map<std::string, std::list<Node*>>             Es el tipo del contenedor, donde cada clave es un std::string
                                                                            y el valor asociado es una std::list de punteros a Node
                        iterator                                            Es el tipo del iterador para std::map
                                                                            Este iterador permite recorrer el mapa y acceder a sus elementos
                    
                    it = _node_map_list.begin():    Inicializa el iterador it al primer elemento del mapa 
                        _node_map_list. begin()     Devuelve un iterador que apunta al primer par clave-valor del mapa
                    
                    it != _node_map_list.end():     Verifica si el iterador it no ha llegado al final del mapa
                        end()                       Devuelve un iterador que apunta a una posición fuera del final del mapa
                                                    La condición it != _node_map_list.end() asegura que el bucle continúe mientras el iterador no haya recorrido todos los elementos

                    ++it:       Incrementa el iterador para que apunte al siguiente elemento en el mapa
                                En cada iteración, it se mueve al siguiente par clave-valor del mapa

                Este bucle for recorre todos los elementos de _node_map_list
                Que es un mapa donde las claves son cadenas (std::string) y los valores son listas de punteros a Node
            
                En cada Iteración del Bucle:
                    it->first: Proporciona la clave actual del mapa (una std::string)
                    it->second: Proporciona el valor asociado a la clave actual, que es una std::list<Node*>

                    Clonación de la Tupla:

                        std::shared_ptr<Tupla> t = std::make_shared<Tupla>(*tupla);     Se crea una copia de la tupla recibida utilizando std::make_shared<Tupla>
                                                                                        Esto asegura que cada nodo destino reciba su propia instancia de la tupla
                    Copiamos una nueva tupla para cada destino

                    Selección de Nodo y Rotación:

                        Obtenemos el nodo (de forma RR) y se envia al final de la lista

                        Node* temp_node = it.second.front();
                        it.second.pop_front();
                        it.second.push_back(temp_node);
                    
                        Selección:  temp_node obtiene el primer nodo en la lista de nodos (it.second.front())
                        Rotación:   El nodo se elimina de la parte frontal de la lista (it.second.pop_front()) y se agrega al final de la lista (it.second.push_back(temp_node))
                                    Esto implementa un esquema de "Round Robin" para distribuir las tuplas
                    
                    Obtenemos el nodo (de forma RR) y se envia al final de la lista
                    
                    Generación del ID de Tramo de Tupla:

                        Modificamos el ID de envio entre el Spout/Bolt origen y el Bolt destino

                        std::string id_tramo_tupla = (this->to_string() + "_" + temp_node->to_string() + "_" + std::to_string(_nro_tupla_local) + "_" + std::to_string(tupla->copia()) + "_" + std::to_string(i));
                        t->id_tramo(id_tramo_tupla);

                    Se crea un identificador único para la tupla que incluye información del nodo origen, nodo destino, número de tupla local, copia de la tupla y el índice i
                    Este ID se asigna a la tupla clonada (t->id_tramo(id_tramo_tupla))
                    Modificamos el ID de envio entre el Spout/Bolt origen y el Bolt destino

                    Asignación de Atributos a la Tupla Clonada:

                        Se duplica (porque ahora puede tener varios destinos cuando hay un fork)

                        t->nro_tupla(this->_nro_tupla_local);           nro_tupla: Se asigna el número de tupla local del nodo actual
                                                                        Utilizado para diferenciar una tupla de otra

                        t->id_destino(temp_node->to_string());          id_destino y IP_destino: Se asignan el identificador y la dirección IP del nodo destino
                        t->IP_destino(temp_node->_processor->_IP);      id_destino y IP_destino: Se asignan el identificador y la dirección IP del nodo destino

                        t->id_origen(this->to_string());                id_origen y IP_origen: Se asignan el identificador y la dirección IP del nodo origen
                        t->IP_origen(this->_processor->_IP);            id_origen y IP_origen: Se asignan el identificador y la dirección IP del nodo origen

                    Envío de Tupla:

                        this->_processor->send_tuple(t);        La tupla clonada (t) se envía al procesador del nodo actual usando el método send_tuple del procesador

                        Pide al Processor que aloja al Spout/Bolt actual que ponga la tupla en el Bolt de destino
                    
                    Actualización de Contadores:

                        this->_nro_tupla_local++;       Se incrementa el número de tupla local (_nro_tupla_local) para la siguiente emisión
                        i++;                            Se incrementa el contador i para la siguiente iteración
                    
                    Valor de Retorno:

                        return 1e-9;        La función retorna un valor muy pequeño (1e-9)
                                            Esto podría ser un valor estándar para indicar que la función se ejecutó correctamente sin errores significativos
                    
                    Procesadores de destino son encargados de despertar a los que reciben las tuplas

    Función emit_tuple_FIELD_GROUPING:
        
        double Node::emit_tuple_FIELD_GROUPING(shared_ptr<Tupla> tupla)

        Función encargada de enviar una tupla a nodos de destino utilizando un esquema de agrupamiento basando en hash
        En este esquema, las tuplas se distribuyen entre los nodos de destino según un hash calculado a partir del contenido de la tupla

            shared_ptr<Tupla> tupla:    Parámetro de entrada que representa la tupla que se va a enviar a los nodos de destino.

        Cuerpo de la Función:
            
            Bucle for:
            for (std::map<std::string, std::vector<Node*>>::iterator it = _node_map_vector.begin(); it != _node_map_vector.end(); ++it) {
            
            Deglose del Bucle for:

                Declaración de un iterador 'it' de tipo std::map<std::string, std::vector<Node*>>::iterator:

                    std::map<std::string, std::vector<Node*>>::iterator it

                    El iterador 'it' se utiliza para recorrer un mapa 'std::map' donde las claves son 'std::string'
                    Los valores son vectores 'std::vector' de punteros a objetos Node

                _node_map_vector.begin():   Inicializa el iterador 'it' apuntando al primer elemento del mapa '_node_map_vector'
                _node_map_vector:           Nombre del mapa que se va a recorrer
                begin():                    Función que retorna un iterador al primer elemento del mapa

                Condición de Continuación del Ciclo for:

                    it != _node_map_vector.end();       Verifica si el iterador 'it' no ha alcanzado el final del mapa
                    end():                              Función que retorna un iterador al elemento que sigue al último elemento del mapa
                                                        Este elemento no existe realmente, pero sirve como marcador de final del contenedor
                                                        El bucle continuará ejecutándose mientras it no sea igual a _node_map_vector.end()

                Incremento del iterador:

                ++it        Incrementa el iterador 'it' para que apunte al siguiente elemento del mapa
                            Usar ++it en lugar de it++ es una práctica común para los iteradores, ya que ++it puede ser más eficiente

                
                    Calculo del Hash:

                        uint32_t hash = Utilities::hash(tupla->contenido());

                        uint32_t hash       Variable de tipo uint32_t que representa un entero sin signo de 32 bits
                                            Variable que se utiliza para almacenar el valor del hash calculado                
                        Utilities::hash     Función que calcula el hash de un valor y el archivo glob.h contiene la definición de esta función
                        tupla->contenido()  Llama a la función contenido() del objeto 'tupla' y obtiene su valor
                                            Método que devuelve un valor que puede ser hasheado (probablemente una cadena de texto)
                    
                    Selección del Nodo:

                        uint32_t selected_node = hash % it->second.size();

                        selected_node:      Es una variable de tipo uint32_t que almacenará el índice del nodo seleccionado
                        
                        Deglose de la función hash % it->second.size():     Calcula el índice del nodo seleccionado usando el operador módulo (%)

                            hash:                   Valor calculado en la función Utilities::hash(tuplas->contenido())
                            it->second.size():      Obtiene el tamaño del vector de nodos en el mapa
                            it:                     Iterador del mapa 'std::map<std::string, std::vector<Node*>>'
                            it->second:             Vector de punteros a 'Node' correspondiente a la clave actual del iterador 'it'
                            %                       El resultado de este operador módulo garantiza el índice estará dentro de los límites del vector
                                                    es decir, entre '0' y 'size()-1'
                    
                    Obtención del Nodo:
                        
                        Node* temp_node = it->second.at(selected_node);

                            Node*:                          Es un puntero a un objeto de tipo 'Node'
                            temp_node:                      Variable de tipo 'Node' que almacenará el puntero al nodo seleccionado
                            it->second.at(selected_node):   Accede al elemento en la posici´n 'select_node' del vector de nodos
                                Deglose:
                                
                                    it->second:             Vector de punteros a 'Node' correspondiente a la clave actual del iterador 'it'
                                    at(selected_node):      Función del vector que devuelve una referencia al elemento en la posición 'selected_node'
                                                            at() realiza una verificación de límities y lanzar una excepción si el ínidice está fuera del rango del vector

                    Copia de la Tupla:

                        Copiamos una nueva tupla para cada destino (hay fork):
                        shared_ptr<Tupla> t = make_shared<Tupla>(*tupla)        Crea una nueva tupla copiando la tupla original
                                                                                't' es un 'shared_ptr' que apunta a esta nueva tupla

                    Modificación del ID de Envío:

                        Modificamos el ID de envio entre el Spout/Bolt origen y el Bolt destino:
                        std::string id_tramo_tupla = (this->to_string() + "_" + temp_node->to_string() + "_" + std::to_string(_nro_tupla_local) + "_" + std::to_string(tupla->copia()));
                        t->id_tramo(id_tramo_tupla);

                        id_tramo_tupla:                 Construye un identificador único para la tupla que incluye el origen, el destino, el número local de la tupla y el número de copia
                        t->id_tramo(id_tramo_tupla):    Asigna el identificador construido a la tupla t

                    Asignación de Atributos de la Tupla:

                        t->nro_tupla(this->_nro_tupla_local);           Utilizado para diferenciar una tupla de otra
                                                                        Asigna el número local de la tupla.
                        t->id_destino(temp_node->to_string());          Asigna el identificador del nodo destino
                        t->IP_destino(temp_node->_processor->_IP);      Asigna la dirección IP del nodo destino
                        t->id_origen(this->to_string());                Asigna el identificador del nodo origen
                        t->IP_origen(this->_processor->_IP);            Asigna la dirección IP del nodo origen

                    Envío de la Tupla:

                        Después de que todos los atributos de la tupla t hayan sido configurados adecuadamente (como el ID de tramo, el número de tupla, el ID de destino,
                        la IP de destino, el ID de origen y la IP de origen), la tupla t está lista para ser enviada

                        La llamada a 'send_tuple' pasa la tupla 't' al procesador '_processor', que es responsable de manejar el envío de tuplas a sus respectivos destinos

                        this->_processor->send_tuple(t)

                        Deglose:
                                this:       Hace referencia a la instancia actual de la clase 'Node' desde la cual se llama al método 'emit_tuple_FIELD_GROUPING'
                            _processor:     Miembro de la clase 'Node'
                                            Puntero a una instancia de otra clase que tiene la capacidad de manejar el envío de tuplas
                            send_tuple      Método de la clase del objeto '_processor'
                                            Se encarga de enviar una tupla a otro nodo o proceso
                            (t)             Argumento que se pasa al método 'send_tuple'
                                            Es un 'shared_ptr<Tupla>' que contiene una copia de la tupla original con todos los atributos modificados

                    Incremento del Número de Tuplas Local:

                        this->_nro_tupla_local++        Incrementa el contador local de tuplas

                    Fin del Bucle y Retorno:

                        El bucle termina después de haber procesado todos los elementos en '_node_map_vector'
                        
                        Return 1e-9         Devuelve un valor muy pequeño
                                            Este valor puede ser un indicador de éxito o simplemente un valor de retorno por defecto


    Función emit_tuple_GLOBAL_GROUPING:

        Declaración de la Función:
            
            double Node::emit_tuple_GLOBAL_GROUPING(std::shared_ptr<Tupla> tupla)

            double:                         El tipo de retorno de la función es double
            Node::                          Indica que esta función es un método de la clase Node
            emit_tuple_GLOBAL_GROUPING:     El nombre del método
            std::shared_ptr<Tupla> tupla:   El parámetro de la función
                                            Es un puntero inteligente 'shared_ptr' a un objeto de tipo 'Tupla'
        
        Cuerpo de la Función:

            return 1e-9     La función devuelve el valor '1e-9' y esto es una notación cientifica para el valor '0.000000001'

        Propósito General:

            La función emit_tuple_GLOBAL_GROUPING parece estar diseñada para manejar un tipo específico de distribución de tuplas llamado "GLOBAL_GROUPING"
            En sistemas de procesamiento de flujo de datos distribuidos, el "GLOBAL_GROUPING" típicamente envía todas las tuplas a un único nodo de destino global
            En esta implementación particular, la función no realiza ninguna operación y simplemente devuelve un pequeño valor constante
        
    Función emi_tuple_ALL_GROUPING:

        Declaración de la Función:
    
            double Node::emit_tuple_ALL_GROUPING( shared_ptr<Tupla> tupla ){
  
        Cuerpo de la Función:
        
            return 1e-9;        La función devuelve el valor '1e-9' y esto es una notación cientifica para el valor '0.000000001'

    Función avg_service_time:

        Declaración de la función:

            //Retorna el tiempo de servicio (tiempo HOLD)
            std::string Node::avg_service_time( )

            std::string:            El tipo de retorno de la función es std::string, lo que significa que la función devolverá una cadena de texto
            Node:::                 Indica que esta función es un método de la clase Node
            avg_service_time():     Nombre del método, esta función no toma ningún parámetro de entrada

        Cuerpo de la Función:

            return this->_avg_service_time

            return:                         La instrucción return indica que la función devolverá un valor
            this->_avg_service_time:        'this' es un puntero implícito a la instancia actual de la clase
            Node.this->_avg_service_time:   Accede al miembro de datos '_avg_service_time' de esa instancia
        
        Propósito General:

            La función avg_service_time está diseñada para devolver el valor del miembro de datos _avg_service_time de una instancia de la clase Node
            Este miembro de datos probablemente almacena el tiempo promedio de servicio del nodo en forma de cadena de texto
        
        Posible Contexto de Uso:

            En el contexto de un sistema que gestiona nodos (por ejemplo, una red de procesamiento distribuido)
            La función avg_service_time podría usarse para obtener el tiempo promedio que un nodo tarda en procesar una tarea o una solicitud
            Este valor puede ser útil para el monitoreo del rendimiento, la optimización de recursos y la toma de decisiones en el sistema
    
    Función replica_ID:
    
        Declaración de la función:

            //Retorna el id de replica
            int Node::replica_id( )
        
            int:            El tipo de retorno de la función es int, lo que significa que la función devolverá un número entero.
            Node:::         Indica que esta función es un método de la clase Node.
            replica_id():   El nombre del método. Los paréntesis vacíos indican que la función no toma parámetros

        Cuerpo de la Función:

            return _rep_id

            return:     La instrucción return indica que la función devolverá un valor
            _rep_id:    Es un miembro de datos de la instancia actual de la clase Node

        Propósito General:

            La función replica_id está diseñada para devolver el valor del miembro de datos _rep_id de una instancia de la clase Node
            Este miembro de datos probablemente almacena el identificador de réplica del nodo

    Función to_string:

        Declaración de la función:    
    
            //Retorna el nombre del objeto junto concatenado a su id replica
            std::string Node::to_string()
            
            Deglose:

                std::string             Tipo de retorno de la función. Indica que la función devuelve un objeto de tipo 'std::string'
                Node::to_string()       Nombre completo de la función, que incluye el nombre de la clase 'Node' y el nombre del método 'to_string()'
                                        Este ultimo método 'to_string()' es un método miembro de la clase 'Node'
        Cuerpo de la Función:
  
            return this->_node_id;

            Deglose:

                this:       Puntero implícito a la instancia actual del objeto de la clase 'Node' desde la cual se esta llamando la función
                            Permite acceder a las variables y funciones del objeto actual

                _node_id:   Variable miembro privada de la clase 'Node'. Se espera que sea de tipo 'std::string'
                            Se hace referencia a la variable miembro de '_node_id' del objeto actual

        Propósito General:

            Devuelve el identificador del nodo '_node_id'
            La función to_string() tiene como propósito devolver una representación en forma de cadena de caracteres (std::string) del identificador del nodo
            Esta función puede ser utilizada cuando se necesita una cadena de caracteres que represente al nodo
            Por ejemplo, para propósitos de depuración, registro de eventos, o cuando se necesite mostrar el identificador del nodo en una interfaz de usuario o en la salida estándar
    
    Función Node::name:

        Declaración de la función:
        
            std::string Node::name()

            Deglose:

                std::string         Tipo de retorno de la función. Indica que la función devuelve un objeto de tipo 'std::string'
                Node::name()        Nombre completo de la función, incluye el nombre de la clase 'Node' y el nombre de método 'name()'
                                    Indica que 'name()' es un método miembro de la clase 'Node'

        Cuerpo de la función:

            return this->_name;

            Deglose:

                this:       Puntero implícito a la instancia actual del objeto de la clase 'Node' desde la cual se esta llamando la función
                            Permite acceder a las variables y funciones del objeto actual

                _name:      Variable miembro privada de la clase 'Node'. Se espera que sea tipo 'std::string'
                            Se hace referencia a la variable miembro de '_name' del objeto actual

        Propósito General:

            Devuelve el nombre del nodo '_name'
            La función name() tiene como propósito devolver el nombre del nodo en forma de cadena de caracteres (std::string)
            Esta función puede ser utilizada cuando se necesita una cadena de caracteres que represente el nombre del nodo, por ejemplo
            Para propósitos de identificación, depuración, registro de eventos, o cuando se necesite mostrar el nombre del nodo en una interfaz de usuario o en la salida estándar

    Función get_node_state:

        Declaración de la función:

            int Node::get_node_state()

            Deglose:

                Node::get_node_state()      Nombre completo de la función, incluyendo el nombre de la clase 'Node' y  el nombre del método
                get_node_state()            Método miembro de la clase 'Node'

        Cuerpo de la función:

            return this->_node_state;

            Deglose:

                this:           Puntero implícito a la instancia actual del objeto de la clase Node desde la cual se está llamando la función
                                Permite acceder a las variables y funciones del objeto actual
                
                _node_state:    Variable miembro privada de la clase 'Node'. Se espera que sea de tipo 'int'
                                Se hace referencia a la variable miembro de '_node_state' del objeto actual

        Propósito General:

            La función get_node_state() tiene como propósito devolver el estado actual del nodo en forma de un valor entero (int)
            Esta función puede ser utilizada cuando se necesita conocer el estado del nodo, por ejemplo
            Para determinar si está activo, inactivo, ocupado, libre, o cualquier otro estado definido por la implementación de la clase Node

    Función set_node_idle:

        Declaración de la función:

            void Node::set_node_idle()

            Deglose:

                void                        Indica que la función no devuelve ningún valor
                Node::set_node_idle()       Nombre de la función, incluyendo el nombre de la clase 'Node' y el nombre del método
                set_node_idle()             Método miembro de la clase 'Node'    
        
        Cuerpo de la función:

            this->_node_state = Node::NODE_IDLE;        Asigna el valor de la constante NODE_IDLE a la variable miembro _node_state del objeto actual      

            Deglose:

                this:           Puntero implícito a la instancia actual del objeto de la clase Node desde la cual se está llamando la función
                                Permite acceder a las variables y funciones del objeto actual
                _node_state:    Variable miembro privada de la clase 'Node'. Se espera que sea de tipo 'int' o algún otro tipo que represente el estado del nodo
            Node::NODE_IDLE:    Constante o enumeración definida dentro de la clase 'Node' que representa el estado 'idle' (inactivo) del nodo

        Propósito General:

            La función set_node_idle() tiene como propósito establecer el estado del nodo como "idle" (inactivo)
            Esto se logra asignando el valor de la constante NODE_IDLE a la variable miembro _node_state
            Esta función puede ser utilizada cuando se necesita marcar un nodo como inactivo, por ejemplo,
            Cuando el nodo ha terminado su trabajo actual y está esperando nuevas tareas

    Función set_node_busy:

        Declaración de la función:

            void Node::set_node_busy()

            Deglose:

                void                        Indica que la función no devuelve ningún valor
                Node::set_node_busy()       Es el nombre completo de la función, incluyendo el nombre de la clase Node y el nombre del método set_node_busy()

        Cuerpo de la función:

            this->_node_state = Node::NODE_BUSY;

            Deglose:

                this:           Puntero implícito a la instancia actual del objeto de la clase Node desde la cual se está llamando la función
                                Permite acceder a las variables y funciones del objeto actual
                _node_state:    Variable miembro privada de la clase 'Node'. Se espera que sea de tipo 'int' o algún otro tipo que represente el estado del nodo
            Node::NODE_BUSY:    Es una constante o una enumeración definida dentro de la clase Node que representa el estado "busy" (ocupado) del nodo
        
        Propósito General:

            La función set_node_busy() tiene como propósito establecer el estado del nodo como "busy" (ocupado)
            Esto se logra asignando el valor de la constante NODE_BUSY a la variable miembro _node_state
            Esta función puede ser utilizada cuando se necesita marcar un nodo como ocupado, por ejemplo,
            Cuando el nodo está realizando una tarea y no está disponible para otras tareas

    Función tpo_servicio():

        Declaración de la función:

            double Node::tpo_servicio()

            Deglose:

                double:                 La función devuelve un valor de tipo 'double'
                Node::tpo_servicio()    Es el nombre completo de la función, incluyendo el nombre de la clase 'Node' y el nombre del método 'tpo_servicio()'

        Cuerpo de la función:

            return this->_tpo_servicio;     Devuelve el valor de la variable miembro _tpo_servicio del objeto actual

            Deglose:

                this:           Puntero implícito a la instancia actual del objeto de la clase Node desde la cual se está llamando la función
                                Permite acceder a las variables y funciones del objeto actual
                _tpo_servicio   Variable miembro privada de la clase 'Node'.
                                Se espera que sea de tipo 'double' y que almacene algún tipo de información relacionada con el tiempo de servicio del nodo

        
        Propósito General:

            La función tpo_servicio() tiene como propósito devolver el valor almacenado en la variable miembro _tpo_servicio, que representa el tiempo de servicio del nodo
            Esta función se utiliza cuando se necesita obtener el valor del tiempo de servicio del nodo actual
            Puede ser útil para tareas como monitorear el rendimiento, hacer cálculos relacionados con el tiempo de procesamiento, etc

    Función tpo_servicio(double tpo_servicio):

        Declaración de la función:

            void Node::tpo_servicio(double tpo_servicio)

            Deglose:

                void:                                           Indica que la función no devuelve ningún valor
                Node::tpo_servicio(double tpo_servicio):        Es el nombre completo de la función, incluyendo el nombre de la clase Node y el nombre del método tpo_servicio     
                (double tpo_servicio):                          Es un parámetro de entrada de tipo double llamado tpo_servicio

        Cuerpo de la función:

            this->_tpo_servicio = tpo_servicio;             Asigna el valor del parámetro tpo_servicio a la variable miembro _tpo_servicio del objeto actual

            Deglose:

                this:               Es un puntero implícito a la instancia actual del objeto de la clase Node desde la cual se está llamando la función
                                    Permite acceder a los miembros (variables y funciones) del objeto actual
                _tpo_servicio:      Variable miembro privada de la clase 'Node'
                                    Se espera que sea de tipo double y que almacene algún tipo de información relacionada con el tiempo de servicio del nodo
                tpo_servicio:       Asigna el valor del parámetro de entrada tpo_servicio a la variable miembro _tpo_servicio
        
        Propósito General:

            La función tpo_servicio(double tpo_servicio) tiene como propósito establecer el valor de la variable miembro _tpo_servicio con el valor proporcionado como argumento
            Esta función se utiliza cuando se necesita actualizar el valor del tiempo de servicio del nodo actual

    Función increment_tpo_servicio(double tpo_servicio):

        Declaración de la función:

            void Node::increment_tpo_servicio(double tpo_servicio)

            Deglose:

            void:                                               Indica que la función no devuelve ningún valor.
            Node::increment_tpo_servicio(double tpo_servicio):  Es el nombre completo de la función, incluyendo el nombre de la clase Node
                                                                y el nombre del método increment_tpo_servicio. 
                                                                Esto indica que increment_tpo_servicio es un método miembro de la clase Node
            (double tpo_servicio):                              Es un parámetro de entrada de tipo double llamado tpo_servicio
        
        Cuerpo de la función:

            this->_tpo_servicio += tpo_servicio;        Incrementa el valor de la variable miembro _tpo_servicio del objeto actual en el valor del parámetro tpo_servicio

            Deglose:

                this:               Es un puntero implícito a la instancia actual del objeto de la clase Node desde la cual se está llamando la función
                                    Permite acceder a los miembros (variables y funciones) del objeto actual
                _tpo_servicio:      Variable miembro privada de la clase 'Node'
                                    Se espera que sea de tipo double y que almacene algún tipo de información relacionada con el tiempo de servicio del nodo
            +=tpo_servicio:         Incrementa el valor actual de la variable '_tpo_servicio' en la cantidad proporcionada por el parámetro 'tpo_servicio'             

        Propósito General:

            La función increment_tpo_servicio(double tpo_servicio) tiene como propósito aumentar el valor de la variable miembro _tpo_servicio en el valor proporcionado como argumento
            Esta función se utiliza cuando se necesita agregar un valor adicional al tiempo de servicio actual del nodo

    Función tuplas_procesadas:

        Declaración de la función:

            uint32_t Node::tuplas_procesadas()

            Deglose:

                uint32_t:                   La función devuelve un valor entero de 32 bits sin signo
                tuplas::procesadas():       Es el nombre completo de la función, incluyendo el nombre de la clase Node
                                            y el nombre del método 'tuplas_procesadas'
                ():                         La función no toma ningún parámetrode entrada

        Cuerpo de la función:

            return this->_tuplas_procesadas;    Devuelve el valor de la variable miembro _tuplas_procesadas del objeto actual

            Deglose:

                this:               Es un puntero implícito a la instancia actual del objeto de la clase Node desde la cual se está llamando la función
                                    Permite acceder a los miembros (variables y funciones) del objeto actual
                _tuplas_procesadas: Variable miembro privada de la clase 'Node'
                                    Se espera que sea de tipo 'uint32_t' y que almacene la cantidad de tuplas procesadas por el nodo
        
        Propósito General:

            La función tuplas_procesadas() tiene como propósito devolver la cantidad de tuplas procesadas por el nodo
            Esta función se utiliza cuando se necesita obtener la cantidad de tuplas que han sido procesadas por un nodo

    Función tuplas_procesadas(uint32_t tuplas_procesadas):

        Declaración de la función:

            void Node::tuplas_procesadas(uint32_t tuplas_procesadas)

            Deglose:

                void:                                               Es el tipo de retorno de la función, indicando que la función no devuelve ningún valor.
            Node::tuplas_procesadas(uint32_t tuplas_procesadas):    Es el nombre completo de la función, incluyendo el nombre de la clase Node 
                                                                    y el nombre del método tuplas_procesadas
                                                                    Esto indica que tuplas_procesadas es un método miembro de la clase Node
            uint32_t tuplas_procesadas:                             Es un parámetro de la función. uint32_t es el tipo del parámetro
                                                                    Indicando que se espera un valor de 32 bits sin signo
                                                                    y tuplas_procesadas es el nombre del parámetro      
        Cuerpo de la función:

            this->_tuplas_procesadas = tuplas_procesadas;       Actualiza el valor de la variable miembro _tuplas_procesadas del objeto actual con el valor pasado como parámetro

            Deglose:

                this:               Es un puntero implícito a la instancia actual del objeto de la clase Node desde la cual se está llamando la función
                                    Permite acceder a los miembros (variables y funciones) del objeto actual
                _tuplas_procesadas: Es una variable miembro privada de la clase Node
                                    Se espera que sea de tipo uint32_t y que almacene la cantidad de tuplas procesadas por el nodo
                tuplas_procesadas:  Asigna el valor del parámetro tuplas_procesadas a la variable miembro _tuplas_procesadas                   
        
        Propósito General:

            La función tuplas_procesadas(uint32_t tuplas_procesadas) tiene como propósito establecer (o actualizar) la cantidad de tuplas procesadas por el nodo
            Esta función se utiliza cuando se necesita actualizar la cantidad de tuplas procesadas por un nodo, posiblemente después de algún procesamiento 
            o al inicializar el nodo
    
    Función increment_tuplas_procesadas(uint32_t tup):

        Declaración de la función:

            void Node::increment_tuplas_procesadas(uint32_t tup)

            Deglose:

                void:                                               Es el tipo de retorno de la función, indicando que la función no devuelve ningún valor.
                Node::increment_tuplas_procesadas(uint32_t tup):    Es el nombre completo de la función, incluyendo el nombre de la clase Node
                                                                    y el nombre del método increment_tuplas_procesadas
                                                                    Esto indica que increment_tuplas_procesadas es un método miembro de la clase Node
                uint32_t tup:                                       Es un parámetro de la función. uint32_t es el tipo del parámetro
                                                                    Indicando que se espera un valor de 32 bits sin signo y 'tup' es el nombre del parámetro

        Cuerpo de la función:

            this->_tuplas_procesadas += tup;    Incrementa el valor de la variable miembro _tuplas_procesadas del objeto actual en la cantidad especificada por el parámetro tup

            Deglose:

                this:               Es un puntero implícito a la instancia actual del objeto de la clase Node desde la cual se está llamando la función
                                    Permite acceder a los miembros (variables y funciones) del objeto actual
                _tuplas_procesadas: Variable miembro privada de la clase Node. Se espera que sea de tipo uint32_t
                                    Almacena la cantidad de tuplas procesadas por el nodo
                += tup:             Operación de incremento que añade el valor del parámetro 'tup' al valor actual de la variable '_tuplas_procesadas'
        
        Propósito General:

            La función increment_tuplas_procesadas(uint32_t tup) tiene como propósito aumentar la cantidad de tuplas procesadas 
            por el nodo en un valor especificado por el parámetro tup
            Esta función se utiliza cuando se necesita incrementar el contador de tuplas procesadas por el nodo, por ejemplo,
            Después de procesar un lote de tuplas
