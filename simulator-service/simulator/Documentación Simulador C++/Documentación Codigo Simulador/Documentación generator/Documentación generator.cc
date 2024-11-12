Documentación de la clase generator.cc:

    Encabezado del Archivo generator.cc:

        #include "generator.h"      Incluye el archivo de cabecera 'generator.h', que declara la clase 'Generator'
                                    Es necesario para que la implementación en 'generator.cc' pueda usar la definición de la clase y sus miembros

    Declaración de Variables:

        uint32_t Generator::_generated_tuples = 0;
        uint32_t Generator::_max_tuples = 0;
        
        Deglose:
            uint32_t                Tipo de dato entero sin signo de 32 bits
            Generator::             Especifica que la variable es un miembro estático de la clase 'Generator'
                                    El operador '::' se usa para definir variables o funciones que pertenecen a una clase especifica fuera del cuerpo de la clase
            _generated_tuples       Variable que probablemente se utiliza para llevar un recuento del número de tuplas generadas por la instancia de la clase 'Generator'
            _max_tuples             Variable que probablemente se utiliza para establecer un límite máximo en el número de tuplas que puede ser generadas por la instancia
                                    de la clase 'Generator'
    
    Función inner_body de la clase Generator:

        Declaración de la función:

            void Generator::inner_body(void)

                Detalles:
                    Tipo de retorno:    void        La función no retorna ningún valor
                    Parámetros:         void        La función no toma ningún parámetro de entrada

        Cuerpo de la función:

                Bucle Infinito:
                    
                    while(true)     La función continuará ejecutandose indefinidamente hasta que se detenga explícitamente

                    Verificación de Condición para Generar Tuplas:

                        if (_generated_tuples > _max_tuples) {
                            passivate();
                        }

                        Proposito General:
                            
                            El propósito de esta condición es verificar si el número de tuplas generadas '_generated_tuples' supera el número máximo permitido '_max_tuples'
                            Si '_generated_tuples' es mayor que '_max_tuples' se llama a la función 'passivate()'
                            'passivate()' Se utiliza para detener la generación de tuplas cuando se alcanza el número máximo permitido, esperando una reactivación explícita
                    
                    Incremento del Contador de Tuplas Generadas:

                        _generated_tuples++;        Incrementa el contador de tuplas generadas '_generated_tuples'
                    
                    Generación de la Tasa de Arribo:

                            double arrival_rate = this->_wrapper.gen_continuous(this->_arrival_rate);

                            Detalle:
                                gen_continuous:     Genera un valor continuo basado en la tasa de arribo '_arrival_rate'
                                                    Este valor representa la próxima duración hasta que se genere un nuevo evento de arribo
                                                    El valor generado es almacenado en la variable 'arrival_rate'

                            std::cout << "ARRIVAL_RATE " << arrival_rate << std::endl;

                            Detalle:
                                    std::cout       Imprime le valor de 'arrival_rate' en la consola
                                                    La salida tendrá el formato: 'ARRIVAL_RATE <valor>', donde <valor> es el valor de 'arrival_rate'

                            hold(arrival_rate);

                            Detalle:
                                    hold()              Método de la clase base 'process', encargado de suspender el proceso actual por la duración especificada por 'arrival_rate'
                                                        Durante esta suspensión, el proceso no realizará ninguna acción y el control se puede transferir a otro procesos en el sistema
                                Parámetro de entrada:   'arrival_rate' corresponde a la duración durante la cual el proceso se suspenderá

                        Proposito General:

                            Utiliza '_wrapper' para generar una tasa de arribo continua basada en '_arrival_rate'
                            Imprime la tasa de arribo generada 'arriva_rate' en la consola
                            Suspende el proceso por la duración de 'arrival_rate' utilizando la función hold(arrival_rate)
                    
                    Selección del Próximo 'Spout':

                        _current_spout = this->nex_spout();

                        Detalle:
                            Llama a la función 'next_spout()' para seleccionar el siguiente 'Spout' de la lista '_spout_list' y lo asigna a la variable '_current_spout'
                    
                    Programación del Procesamiento del Spout:

                        this->_processor->schedule_spout_processing(_current_spout->to_string());

                        Detalle:
                            Llama a 'schedule_spout_processing()' en '_processor' para programar el procesamiento del 'Spout' actual ('_current_spout')
                            Pasandole la representación en cadena del Spout
    
    Función set_processor:

        Declaración de la función:

            void Generator::set_processor( Processor *proc)
            
            Detalle:
                Tipo de retorno:                            La función no devuelve ningún valor
                                                            La función es un método de la clase 'Generator'
                Parámetro de entrada:   Processor *proc     Puntero a un objeto de tipo 'Processor'
                                                            'proc' es el nombre del parámetro que representa el procesador que se va a asignar al generador

        Cuerpo de la función:

            this->_processor = proc;

            Detalle:
                this            Puntero implícito al objeto actual de la clase 'Generator'
                _processor      Variable miembro de la clase 'Generator'
            
        Proposito General:
            Asigna el puntero 'proc' al miembro '_processor' del objeto 'Generator' actual
            Esto asocia el generador con el procesador proporcionado
            Permite configurar el procesador que se utilizará para procesar las tareas generadas por el generador
    
    Función add_spout:

        Declaración de la función:

            void Generator::add_spout(Spout *spout)

            Detalle:
                Tipo de retorno:                            La función no devuelve ningún valor
                                                            La función es un método de la clase 'Generator'
                Parámetro de entrada:   Spout *spout        Puntero a un objeto de tipo 'Spout'
                                                            'spout' es el nombre del parámetro que representa el spout que se va a añadir a la lista del generador
        
        Cuerpo de la función:

            this->_spout_list.push_back(spout);

            Detalle:
                this            Puntero implícito al objeto actual de la clase 'Generator'
                _spout_list     Variable miembro de la clase 'Generator' que guarda una lista de punteros a objetos 'Spout'
                push_back       Añade el elemento proporcionado al final de la lista '_spout_list'
                                'spout' es el puntero al objeto 'Spout' que se añade a la lista
        
        Proposito General:
            La función permite gestionar y mantener una lista de spouts asociados con el generador
            Facilita la configuración del generador al permitir añadir multiples spouts que se procesarán
            Este método es esencial para permitir que el generador maneje múltiples spouts, añadiéndolos a una lista interna
            y permitiendo así una gestión organizada y estructurada de los spouts que se procesarán en el futuro

    Función next_spout:

        Declaración de la función:

            Spout* Generator::next_spout()

            Detalle:
                Tipo de Retorno:        La función devuelve un puntero a un objeto de tipo 'Spout'
                Parámetro de entrada:   La función no toma ningún parámetro de entrada

        Cuerpo de la función:

            Obtener el Primer Spout de la lista:

                Spout *spout = _spout_list.front();

                Detalle:
                    _spout_list         Variable que guarda una lista de punteros a objetos 'Spout'
                    front()             Devuelve una referencia al primer elemento de la lista '_spout_list'
                    *spout              El puntero 'spout' apunta al primer 'Spout' en la lista '_spout_list'
            
            Eliminar el Primer Spout de la lista:

                _spout_list.pop_front();

                Detalle:
                    pop_front()         Función que elimina el primer elemento de la lista '_spout_list'     
            
            Añadir el Spout al final de la lista:

                _spout_list.push_back(spout);

                Detalle:
                    push_back()         Añade el elemento proporcionado al final de la lista '_spout_list'
                    spout               Puntero al objeto 'Spout' que se añade al final de la lista

            Retornar el Spout:

                return spout;           La función retorna el puntero 'spout' que apunta al primer elemento 'Spout' de la lista, que ahora ha sido movido al final de la lista
            
        Proposito General:
            Esta función es crucial para la gestión de spouts en el generador, permitiendo una rotación ordenada y asegurando que cada spout en la lista tenga la oportunidad de ser procesado en un ciclo continuo

            

              