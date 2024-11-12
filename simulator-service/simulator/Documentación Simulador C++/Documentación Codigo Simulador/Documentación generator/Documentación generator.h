Documentación Clase generator.h:

    Inclusiones:

        #ifndef GENERATOR_H         Comprueba si GENERATOR_H no ha sido definido anteriormente
        #define GENERATOR_H         Define GENERATOR_H para evitar múltiples inclusiones del archivo
    
    Inclusión de Cabeceras:

        #include "glob.h"                           Incluye el archivo de cabecera glob.h, que probablemente contiene definiciones globales necesarias para el proyecto
        #include "../spout.h"                       Incluye la definición de la clase Spout, que parece ser una clase relacionada con el procesamiento de eventos o datos
        #include "../processor/processor.h"         Incluye la definición de la clase Processor, la cual es usada en la clase Generator
        #include "../distributions/wrapper.h"       Incluye la definición de la clase Wrapper, que parece estar relacionada con la generación de distribuciones
    
    Definición de la Clase Generator:

        class Generator : public process

        Deglose:

            class Generator:        Define la clase 'Generator'
            public process:         'Generator' hereda de la clase 'process'
        
    Miembros Privados:

        private:
            Wrapper _wrapper;                   Objeto de la clase 'Wrapper' usado para manejar distribuciones o la generación de datos

            int _rep_id;                        Identificador de réplica para el generador, sugiere una relación 1:1 con los 'Spouts'
            string _generator_id;               Identificador único del generador
            Processor *_processor;              Puntero a un objeto de la clase 'Processor' que aloja al 'Spout'
            std::list<Spout *> _spout_list;     Lista de punteros a 'Spout' indicando que el generador puede manejar múltiples 'Spouts'
            Spout *_current_spout;              Puntero al 'Spout' actual asociado con el generador
                                                Spout al que se le generan eventos de arribo/procesamiento de streams

            static uint32_t _generated_tuples;  Contador estático de tuplas generadas  
            static uint32_t _max_tuples;        Límite estático de tuplas generadas

            std::string _arrival_rate;          Tasa de llegada en formato de cadena de caracteres
        
    Métodos Protegidos:

        protected:
            void inner_body( void );        Método protegido que probablemente define el cuerpo de la funcionalidad principal del generador
                                            Está protegido porque puede ser utilizado solo por clases derivadas o amigos
    Métodos Públicos:

        public:
            Generator( const string& name,          Constructor de la clase Generator que inicializa el generador con un nombre, un identificador de réplica y una tasa de llegada
                const int& rep_id,
                const std::string& arrival_rate
            ) : process( name )
            {
            this->_arrival_rate = arrival_rate;                                     Establece la tasa de llegada
            this->_rep_id = rep_id;                                                 Establece el identificador de réplica
            this->_generator_id = (this->name() + "_" + std::to_string(_rep_id));   Genera un identificador único para el generador combinando el nombre y el ID de réplica
            }
    
    Método Estático set_max_tuples( const uint32_t& m_tuples ):

        Definición de la función:

            static void set_max_tuples( const uint32_t& m_tuples )

            Deglose:

                void:                       El método no devuelve ningún valor. Su propósito es realizar una acción o modificar el estado de la clase sin proporcionar una salida
                const uint32_t& m_tuples
                    Deglose:
                        const:              Indica que el parámetro 'm_tuples' no debe ser modificado
                                            Esto asegura que el valor pasado al método no sea alterado
                                                    
                        uint32_t:           Tipo de dato del parámetro( entero sin signo de 32 bits)
                        &:                  Indica que el parámetro se pasa por referencia
                                            Esto evita la copia del valor, lo que puede ser más eficiente, especialmente para tipos de datos grandes
                                            Dado que es 'const', la referencia no permite modificar el valor original
        Cuerpo de la función:

            Generator::_max_tuples = m_tuples;
            
            Deglose:
                Generator::_max_tuples:     Se refiere a la variable estática _max_tuples de la clase Generator    
                                            Las variables estáticas son compartidas por todas las instancias de la clase
                                            Por lo que Generator::_max_tuples se refiere a la variable de la clase en lugar de una instancia específica
                m_tuples:                   Asigna el valor del parámetro 'm_tuples' a la variable estática '_max_tuples'
                                            Esto actualiza el valor máximo de tuplas que puede generar el 'Generator'

        Propósito General:

            La función set_max_tuples es un método estático que permite establecer el valor de una variable estática _max_tuples en la clase Generator
            No devuelve ningún valor y toma un parámetro m_tuples que se pasa por referencia constante
            El método modifica el valor de la variable estática _max_tuples de la clase Generator para reflejar el nuevo valor proporcionado
    
    Función to_string:

        Declaración de la función:

            std::string to_string()

            Deglose:

                std::string     La función devuelve un valor de tipo std::string. Esto significa que el método produce una cadena de texto como resultado
                to_string()     Método que generalmente se usa para obtener una representación en cadena de un objeto
                                En este caso devuelve un atributo especifico del objeto
        
        Cuerpo de la función:

            return _generator_id;       Retorna el valor de la variable miembro '_generator_id' como una cadena de texto(std::string)
            
            Deglose:

                return:             Devuelve el valor de '_generator_id' al llamador del método
                _generator_id:      Variable miembro de la clase 'Generator' de tipo 'std::string' que almacena un identificador único del generador
                
    Función set_processor:

        Declaración de la función:

            void set_processor(Processor *processor)
        
            Deglose:

                void:                   La función no retorna ningún valor. El propósito es realizar una acción sin proporcionar una salida
                set_processor():        Método que se utiliza para asignar un valor a la variable miembro '_processor'
                Processor *:            Puntero a un objeto de tipo 'Processor'
                                        Permite pasar una referencia a un objeto 'Processor' a la función
                processor:              Nombre del parámetro, se espera qe sea un puntero a un objeto de tipo 'Processor'
            
        Cuerpo de la función:

    
    Función next_spout:

        Declaración de la función:

            Spout* next_spout()
            
            Deglose:

                Spout*:         Función que retorna un puntero a un objeto de tipo 'Spout'
                                El método proporciona la dirección en memoria de un objeto 'Spout'
                next_spout():   Método que obtiene el siguiente 'Spout' en la secuencia o lista
    
    Función add_spout:

        Declaración de la función:

            void add_spout(Spout *spout)     La función add_spout añade un puntero al objeto Spout al final de la lista _spout_list en la clase Generator

            Deglose:
                void:           El método no retorna ningún valor
                add_spout()     Método que se utiliza para añadir un 'Spout' a la lista de 'Spout' en la clase 'Generator'
                Spout *:        Puntero a un objeto de tipo 'Spout'
                spout:          Representa el puntero al objeto 'Spout' que se quiere añadir a la lista
        
        Cuerpo de la función:

    
    Destructor ~Generator:

        Declaración del destructor:

            ~Generator()        El destructor es un método especial que se llama automáticamente cuando un objeto de la clase 'Generator' es destruido
                                Los destructores no toman parámetros
        
        Cuerpo del Destructor:  El destructor tiene un cuerpo vacío. No contiene ninguna instrucción o lógica adicional
                                Este destructor no realiza ninguna acción especifica cuando el objeto 'Generator' se destruye