Documentación de la clase node.h:

    Include Guards:

        #ifndef NODE_H      Verifica si 'NODE_H' no ha sido definido previamente
                            Tecnica común para prevenir la inclusión múltiple de archivos de cabecera
        #define NODE_H     Define 'NODE_H' para que no se incluya este archivo más de una vez en la compilación
    
    Inclusiones:

        #include "glob.h"                    Incluye el archivo de cabecera 'glob.h' que contiene las definiciones globales y dependencias necesarias 
        #include "distributions/wrapper.h"   Incluye el archivo de cabecera 'distributions/wrapper.h' que contiene las dependencias necesarias
        
        Incluye los archivos necesarios para los tipos de datos que se utilizan en la clase Node
        #include <map>                       
        #include <vector>                       
        #include <list>
        #include <string>
        #include <memory>

    
    Definición adelantada clase Processor:

        class Processor;

        Adelanto de la declaración de la clase Processor, esto está bien si Processor no está definido antes de esta clase
    
    Definición Clase Node:

        class Node

            La clase Node parece ser una clase base para representar nodos en un sistema distribuido o de procesamiento de flujos de datos
            La palabra clave protected indica que los miembros definidos a continuación solo serán accesibles dentro de esta clase y de sus clases derivadas

        protected:

            // Stream Grouping
            enum stream_grouping_option {SHUFFLE_GROUPING=0/*RR*/, FIELD_GROUPING/*HASH*/, GLOBAL_GROUPING, ALL_GROUPING};
            
            Se define una enumeración stream_grouping_option. Una enumeración es un tipo de dato que consiste en un conjunto de valores constantes
            En este caso, stream_grouping_option define las siguientes constantes:

                SHUFFLE_GROUPING:   Asociado con el valor 0     Esta opción probablemente se refiere a un esquema de agrupamiento "round-robin" (RR)
                                                                Donde las tuplas (o datos) se distribuyen equitativamente entre un conjunto de nodos destino

                FIELD_GROUPING:     Asociado con el valor 1     Esta opción probablemente se refiere a un esquema de agrupamiento basado en un campo específico de las tuplas
                                                                Similar a un "hash" de ese campo para determinar el nodo destino.

                GLOBAL_GROUPING: Asociado con el valor 2        Esta opción probablemente se refiere a un esquema donde todas las tuplas se envían a un solo nodo destino global

                ALL_GROUPING: Asociado con el valor 3           Esta opción probablemente se refiere a un esquema donde las tuplas se envían a todos los nodos destino
            
            La enumeración stream_grouping_option se utiliza para especificar el método de distribución de las tuplas entre los nodos
            Dependiendo del valor de stream_grouping_option seleccionado
            La lógica de la clase Node (y posiblemente de sus clases derivadas) aplicará un método diferente para determinar cómo y a qué nodos enviar las tuplas

    Verificación Wrapper y Tupla:

        // Tupla procesada/generada en run() de Spout o Bolt
        Wrapper _wrapper;                   Wrapper parece ser una clase o una estructura (struct) definida en otro lugar del código
                                            El propósito de _wrapper es encapsular o envolver la tupla
    
        std::shared_ptr<Tupla> _tupla;      Puntero inteligente en C++ que mantiene una referencia compartida a un objeto
                                            El objeto será destruido cuando el último std::shared_ptr que lo apunte sea destruido o deje de apuntar a él
                                            El propósito de _tupla es almacenar una referencia a una tupla que es procesada o generada por un nodo (ya sea un Spout o un Bolt)
        
        Se asegura que la tupla puede ser compartida de manera segura entre diferentes partes del programa sin preocuparse por la gestión manual de la memoria

    Lista de nodos:

        std::map<std::string, std::list<Node*>> _node_map_list;

        Lista de nodos hacia los cuales se envía tuplas (en realidad siempre serán Bolts)
        Después de producir la(s) tuplas y de que hayan sido encoladas, se debe activar los bolts correspondientes
        Se utiliza en SHUFFLE GROUPING (RR)
    
    Vector de Nodos:

        std::map<std::string, std::vector<Node*>> _node_map_vector;

        Vector de nodos hacia los cuales se envía tuplas (en realidad siempre serán Bolts)
        Después de producir la(s) tuplas y de que hayan sido encoladas, se debe activar los bolts correspondientes
        Se utiliza en FIELD GROUPING (HASH)
    
    Declaración de Variables:

        uint32_t _rep_id;       Identifica a una réplica dentro de un mismo Spout/Bolt, puede repetirse pero para diferentes Bolts
                                El propósito de _rep_id es identificar una réplica de un Spout o Bolt dentro de la topología del procesamiento de flujos de datos
                                _rep_id puede repetirse, pero para diferentes Bolts. Esto sugiere que si tienes múltiples Bolts con el mismo nombre
                                cada uno podría tener réplicas con el mismo _rep_id

        uint32_t _rep_level;    Podría estar relacionado con la jerarquía o el nivel de réplica de un nodo
                                Esto podría ser útil para identificar la posición o prioridad de la réplica dentro de un conjunto de réplicas

        std::string _node_id;   Almacena el identificador único del nodo. Este identificador es probablemente una combinación del nombre del nodo y el _rep_id
                                Garantiza que cada réplica de un nodo tenga un identificador único

        std::string _name;      Almacena el nombre del nodo
                                Utilizado para identificar el tipo de nodo (Spout o Bolt) y su propósito dentro de la topología de procesamiento de flujos de datos
        
        
        std::string _avg_service_time;                  Tiempo de servicio del nodo (HOLD)

        int _stream_grouping;                           Tipo de stream grouping para el nodo

        enum node_states {NODE_IDLE=0, NODE_BUSY};      Estados de un nodo (idle, busy)
  
        node_states _node_state;                        Estado del nodo (node_states= NODE_IDLE, NODE_BUSY)

        Processor *_processor;                          Referencia al procesador que aloja al nodo
                                                        _processor es un puntero a Processor
        
    Constructor de la clase Node:

        Node(const std::string& name,
            const node_type& n_type,                Referencia constante a un objeto de tipo 'node_type'
                                                    El símbolo '&' indica que 'n_type' es una referencia, esto evita la copia del valor
                                                    Puede ser un SPOUT o un BOLT, definiendo el rol del nodo dentro del sistema

            const uint32_t& rep_id,                 Se utiliza para identificar una réplica específica del nodo dentro del sistema
                                                    Este valor es importante para diferenciar entre múltiples instancias del mismo tipo de nodo
                                                    (por ejemplo, varias réplicas de un SPOUT o un BOLT)
            const uint32_t& rep_level,              Se utiliza para identificar el nivel de réplica del nodo dentro del sistema
                                                    Este valor es importante para diferenciar entre múltiples niveles de réplicas de nodos
                                                    (por ejemplo, varias réplicas de un SPOUT o un BOLT en diferentes niveles)
            const std::string& avg_service_time,    Almacena el tiempo promedio de servicio del nodo
                                                    Este valor es importante para definir el rendimiento esperado del nodo en el sistema
            const int& stream_grouping)             Almacena el tipo de agrupamiento de stream que se debe usar para el nodo
                                                    Este valor es crucial para definir cómo se deben manejar y distribuir las tuplas en el sistema

            
        Inicialización del Constructor de la Clase Node:

            :   _name(name), _node_type(n_type), _rep_id(rep_id), _rep_level(rep_level),
                _avg_service_time(avg_service_time), _stream_grouping(stream_grouping)

                _name(name):

                    _name:      Miembro de datos de la clase Node.
                    name:       Parámetro del constructor.
                    Propósito:  Inicializa el miembro de datos _name con el valor del parámetro name

                _node_type(n_type)

                    _node_type: Miembro de datos de tipo node_type (enum).
                    n_type:     Parámetro del constructor de tipo node_type.
                    Propósito:  Inicializa el miembro de datos _node_type con el valor del parámetro n_type

                _rep_id(rep_id)

                    _rep_id:    Miembro de datos de tipo uint32_t.
                    rep_id:     Parámetro del constructor de tipo uint32_t.
                    Propósito:  Inicializa el miembro de datos _rep_id con el valor del parámetro rep_id

                _rep_level(rep_level)

                    _rep_level: Miembro de datos de tipo uint32_t.
                    rep_level:  Parámetro del constructor de tipo uint32_t.
                    Propósito:  Inicializa el miembro de datos _rep_level con el valor del parámetro rep_level
                
                _avg_service_time(avg_service_time)

                    _avg_service_time:  Miembro de datos de tipo std::string.
                    avg_service_time:   Parámetro del constructor de tipo std::string.
                    Propósito:          Inicializa el miembro de datos _avg_service_time con el valor del parámetro avg_service_time
                
                _stream_grouping(stream_grouping)

                    _stream_grouping:   Miembro de datos de tipo int.
                    stream_grouping:    Parámetro del constructor de tipo int.
                    Propósito:          Inicializa el miembro de datos _stream_grouping con el valor del parámetro stream_grouping

            La lista de inicialización se usa para asignar valores a los miembros de datos de la clase Node usando los parámetros pasados al constructor
            Esto asegura que los miembros se inicializan antes de que el cuerpo del constructor se ejecute
            La lista de inicialización es más eficiente que la asignación dentro del cuerpo del constructor porque evita la creación y destrucción temporales de objetos

        Cuerpo del Constructor:

            {
                this->_rep_id = rep_id;
                this->_rep_level = rep_level;
                this->_stream_grouping = stream_grouping;

                _name = name;

                this->_node_id = (name + "_" + std::to_string(_rep_id));
                this->_avg_service_time = avg_service_time;
                this->_node_type = n_type;
            }

                this->_rep_id:  Se refiere al miembro de datos _rep_id de la instancia actual de la clase Node
                rep_id:         Parámetro pasado al constructor
                Propósito:      Asigna el valor del parámetro rep_id al miembro de datos _rep_id de la instancia

                this->_rep_level:   Se refiere al miembro de datos _rep_level de la instancia actual
                rep_level:          Parámetro pasado al constructor
                Propósito:          Asigna el valor del parámetro rep_level al miembro de datos _rep_level de la instancia

                this->_stream_grouping: Se refiere al miembro de datos _stream_grouping de la instancia actual
                stream_grouping:        Parámetro pasado al constructor
                Propósito:              Asigna el valor del parámetro stream_grouping al miembro de datos _stream_grouping de la instancia

                _name:      Se refiere al miembro de datos _name de la instancia actual
                name:       Parámetro pasado al constructor
                Propósito:  Asigna el valor del parámetro name al miembro de datos _name de la instancia
            
                this->_node_id:                       Se refiere al miembro de datos _node_id de la instancia actual
                name + "_" + std::to_string(_rep_id): Concatena el nombre del nodo y el ID de réplica para formar una identificación única
                Propósito:                            Genera un identificador único para el nodo basado en su nombre y su ID de réplica, y lo asigna al miembro de datos _node_id

                this->_avg_service_time:    Se refiere al miembro de datos _avg_service_time de la instancia actual
                avg_service_time:           Parámetro pasado al constructor
                Propósito:                  Asigna el valor del parámetro avg_service_time al miembro de datos _avg_service_time de la instancia

                this->_node_type:   Se refiere al miembro de datos _node_type de la instancia actual
                n_type:             Parámetro pasado al constructor
                Propósito:          Asigna el valor del parámetro n_type al miembro de datos _node_type de la instancia
            
        Este constructor inicializa varios miembros de datos de la clase Node utilizando los parámetros que se le pasan.
        Utiliza la palabra clave this para distinguir entre los miembros de datos de la instancia y los parámetros del constructor cuando tienen el mismo nombre.
        Asigna valores a _rep_id, _rep_level, _stream_grouping, _name, _node_id, _avg_service_time, y _node_type

        Comparación con la Lista de Inicialización:

            Lista de Inicialización:    Inicializa los miembros de datos antes de que el cuerpo del constructor se ejecute
                                        Más eficiente y necesaria para inicializar constantes y referencias
            
            Cuerpo del Constructor:     Asigna valores a los miembros de datos después de que se han creado
                                        Menos eficiente porque puede implicar una inicialización por defecto seguida de una asignación
        
    Declaración de Funciones Virtuales:

        // Reemplaza a metodo inner_body(), procesa la tupla
        virtual double run(double timestamp = 0.0);

        
            Descripción:    Método virtual puro que procesa la tupla
            Parámetros:     timestamp (valor por defecto 0.0)
            Propósito:      Implementar el procesamiento de la tupla en clases derivadas

        
        // Asigna el nodo a un processor
        virtual double send_tuple();

            Descripción:    Método virtual puro para enviar una tupla
            Propósito:      Implementar el envío de tuplas en clases derivadas

    Asignación y Conexión de Procesadores:

        // Establece conexion del nodo source (this) con el nodo target (Node)
        void set_processor(Processor*);

            Descripción:    Asigna el nodo a un procesador
            Parámetros:     Puntero a un objeto de tipo Processor
            Propósito:      Asociar el nodo con un procesador específico

        // Establece conexion del nodo source (this) con el nodo target (Node)
        void add_node(Node*);

            Descripción:    Establece una conexión entre el nodo fuente (this) y el nodo objetivo (Node)
            Parámetros:     Puntero a un objeto de tipo Node
            Propósito:      Configurar las conexiones entre nodos para la transmisión de tuplas
        
    Emisión de Tuplas:

        // Agrega/pone la tupla a la cola de salida del source; y entrada del target
        double emit_tuple(std::shared_ptr<Tupla>);

            Descripción:    Agrega o pone la tupla en la cola de salida del nodo fuente y en la cola de entrada del nodo objetivo
            Parámetros:     std::shared_ptr<Tupla>
            Propósito:      Emitir una tupla para ser procesada por otro nodo
        
        double emit_tuple_SHUFFLE_GROUPING(std::shared_ptr<Tupla>);
        
            Descripción:    Emite una tupla usando la estrategia SHUFFLE_GROUPING
            Parámetros:     std::shared_ptr<Tupla>
            Propósito:      Implementar el envío de tuplas en SHUFFLE_GROUPING (round-robin)

        double emit_tuple_FIELD_GROUPING(std::shared_ptr<Tupla>);

            Descripción:    Emite una tupla usando la estrategia FIELD_GROUPING
            Parámetros:     std::shared_ptr<Tupla>
            Propósito:      Implementar el envío de tuplas en FIELD_GROUPING (hashing)
        
        double emit_tuple_GLOBAL_GROUPING(std::shared_ptr<Tupla>);

            Descripción:    Emite una tupla usando la estrategia GLOBAL_GROUPING
            Parámetros:     std::shared_ptr<Tupla>
            Propósito:      Implementar el envío de tuplas en GLOBAL_GROUPING

        double emit_tuple_ALL_GROUPING(std::shared_ptr<Tupla>);

            Descripción:    Emite una tupla usando la estrategia ALL_GROUPING
            Parámetros:     std::shared_ptr<Tupla>
            Propósito:      Implementar el envío de tuplas en ALL_GROUPING
        
    Funciones de Estado y Métricas:

        // Tiempo de servicio (tiempo HOLD)
        std::string avg_service_time();

            Descripción: Devuelve el tiempo de servicio promedio del nodo
            Propósito: Obtener el tiempo de servicio promedio
        
        // Retorna el id de replica
        int replica_id();

            Descripción:    Retorna el ID de la réplica
            Propósito:      Obtener el identificador único de la réplica del nodo
        
        // Retorna el nombre del objeto junto concatenado a su id replica
        std::string to_string();

            Descripción:    Retorna el nombre del objeto junto con su ID de réplica
            Propósito:      Representar el nodo como una cadena única

        // Retorna el nombre del objeto (Bolt_0 o Spout_1) sin numero de replica
        std::string name();

            Descripción:    Retorna el nombre del objeto sin el número de réplica
            Propósito:      Obtener el nombre del nodo sin el ID de réplica

        int get_node_state();

            Descripción:    Devuelve el estado actual del nodo
            Propósito:      Obtener el estado del nodo
        
        void set_node_idle();

            Descripción:    Establece el estado del nodo a idle (inactivo)
            Propósito:      Cambiar el estado del nodo a inactivo
        
        void set_node_busy();

            Descripción:    Establece el estado del nodo a busy (ocupado)
            Propósito:      Cambiar el estado del nodo a ocupado
        
    Funciones de Métricas:

        double tpo_servicio();

            Descripción:    Devuelve el tiempo de servicio acumulado
            Propósito:      Obtener el tiempo de servicio del nodo
        
        void tpo_servicio(double);

            Descripción:    Establece el tiempo de servicio
            Parámetros:     double representando el tiempo de servicio
            Propósito:      Configurar el tiempo de servicio
        
        void increment_tpo_servicio(double tpo_servicio);

            Descripción:    Incrementa el tiempo de servicio en una cantidad dada
            Parámetros:     double tpo_servicio para incrementar
            Propósito:      Aumentar el tiempo de servicio acumulado
        
        uint32_t tuplas_procesadas();

            Descripción:    Devuelve el número de tuplas procesadas
            Propósito:      Obtener el número de tuplas procesadas por el nodo
        
        void tuplas_procesadas(uint32_t);

            Descripción:    Establece el número de tuplas procesadas
            Parámetros:     uint32_t representando el número de tuplas
            Propósito:      Configurar el número de tuplas procesadas

        void increment_tuplas_procesadas(uint32_t tup=1);

            Descripción:    Incrementa el número de tuplas procesadas en una cantidad dada (por defecto 1)
            Parámetros:     uint32_t tup para incrementar (por defecto 1)
            Propósito:      Aumentar el conteo de tuplas procesadas
        

    Destructor de la Clase Node:

        protected:
        ~Node(){}

            Descripción: Destructor protegido
            Propósito: Limpiar recursos si es necesario al destruir la instancia de Node