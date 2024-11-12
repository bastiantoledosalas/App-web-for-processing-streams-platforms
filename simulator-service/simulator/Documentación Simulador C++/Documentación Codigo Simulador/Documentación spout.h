Documentación Clase spout.h:

    Include Guards:

        #ifndef SPOUT_H     Verifica si 'SPOUT_H' no ha sido definido previamente
                            Tecnica común para prevenir la inclusión múltiple de archivos de cabecera
        #define SPOUT_H     Define 'SPOUT_H' para que no se incluya este archivo más de una vez en la compilación

    
    Inclusiones:

        #include "glob.h"   Incluye el archivo de cabecera 'glob.h' que contiene las definiciones globales y dependencias necesarias
        #include "node.h"   Incluye el archivo de cabecera 'node.h' que contiene la definición de la clase 'Node' de la cual 'Spout' hereda

    
    Declaración de la Clase Spout:

        class Spout: public Node    Declara la clase Spout que hereda públicamente de la clase 'Node'
    
    Sección Privada:

        private:        Inicia la sección privada de la clase
    
    Sección Protegida:

        protected:
            static int _nro_tupla;      Nro de tupla actual
                                        Declara una variable estática protegida '_nro_tupla' que mantiene el número actual de tupla
    
    Sección Publica:

        public:     Inicia la sección pública de la clase

    Contructor:

        Spout( const string& name,      Define el constructor de la clase Spout que toma varios parámetros de entrada (name, id, rep_level, avg_service_time, stream_grouping)
            const uint32_t& id,
            const uint32_t& rep_level,
            const std::string& avg_service_time,
            const int& stream_grouping
	        
            //LLama al constructor de la clase base Node con los parámetros proporcionados y el tipo de nodo 'Node::SPOUT'
            ) : Node( name, Node::SPOUT, id, rep_level, avg_service_time, stream_grouping ) 
            {
            this->_node_state = NODE_IDLE;  Inicializa el estado del nodo a 'NODE_IDLE'
            }

    Métodos run and send_tuple:

        double run( double timestamp = 0.0 );   Declaración del método run que toma un timestamp (por defecto 0.0) y devuelve un double
        double send_tuple( );                   Declaración del método send_tuple que devuelve un double

    Destructor:

         ~Spout(){      Define el destructor de la clase Spout
        }

    Finalización del include Guard:

        #endif    Finaliza el include Guard

      




        
