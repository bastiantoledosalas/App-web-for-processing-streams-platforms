Documentación clase bolt.cc:

    Método run:

        Definición del método run:

            double Bolt::run(double timestamp)

            Este método ejecuta la logica del Bolt en cada ciclo de procesamiento, utilizando el timestamp para actualizar el estado de las tuplas

        
        Comprobación de tuplas:

            // ASSERT para evitar que no haya tuplas que procesar por el Bolt
            assert( !_processor->tuple_queues_empty( this->to_string() ) );

            Asegura que no se intente procesar si no hay tuplas en la cola
            Si la cola esta vacia, se genera un error en tiempo de ejecución

        Extracción de la tupla:

            // Extrae (pull) tupla de la cola
            _tupla = this->pull_tuple( );

            Obtiene la siguiente tupla de la cola del procesador
  
        Actualización de timestamp de la tupla:

            // Actualiza timestamp de la tupla
            _tupla->timestamp( timestamp );

            Actualiza el timestamp de la tupla extraída con el tiempo actual

        Procesamiento de la tupla

            // Devuelve tupla procesada y tiempo de Hold
            double tpo = process_tuple( _tupla );
        
            Procesa la tupla y obtiene el tiempo que se necesita para hacerlo

        Imprime el tiempo de servicio para este Bolt:

            // Tiempo de Hold
            std::cout << "SERVICE_TIME " << this->to_string() << " " << tpo << std::endl;
	
        Incremento de Métricas:

            // Para medir tiempos y throughput
            this->increment_tpo_servicio( tpo );            
            this->increment_tuplas_procesadas( );

            Actualiza las métricas del Bolt incrementando el tiempo de servicio total y el número de tuplas procesadas

        Retorno del tiempo que tomó procesar la tupla:

            return tpo;

    Método send_tuple:

        double Bolt::send_tuple()

        Método que se encarga de enviar las tuplas procesadas a las colas correspondientes

    Generación de tuplas a enviar:

        uint32_t nroTuplasEnviar = _wrapper.gen_discrete(this->_nbr_output_tuples);

        Utiliza un generador de números discretos para determinar cuántas tuplas se enviarán
    
    Imprime el número de tuplas que se van a enviar:

        std::cout << "NUMBER_OF_TUPLES " << this->to_string() << " " << nroTuplasEnviar << std::endl;

    Envío de tuplas:

        // Solo se procede si se van a enviar tuplas
        if( nroTuplasEnviar != 0 ){
            double tpo_emit = 0.0;
            // Este bucle se ejecuta nroTuplasEnviar veces
            // nroTuplasEnviar es el número de tuplas que se desea enviar
            // Determinado previamente por el método _wrapper.gen_discrete
            for(uint32_t i = 0; i < nroTuplasEnviar; i++){
                // Se crea una nueva tupla 't' como una copia de la tupla actual '_tupla'
                // Se utiliza make_shared para crear un shared_ptr que gestiona la nueva tupla
                shared_ptr<Tupla> t = make_shared<Tupla>( *_tupla );
                // Se establece el valor de la copia en la tupla 't' usando el indice 'i'
                // Este indice 'i' varía de 0 a 'nroTuplasEnviar - 1' asignando el número único a cada copia
                // Diferenciar las copias de la tupla
                // Esto es útil en escenarios donde un Bolt debe generar múltiples versiones de la misma tupla para enviarlas a diferentes destinos o realizar diferentes tareas con ellas.
                t->copia( i );
            // emit_tuple alojara las tuplas procesadas en la(s) colas que correspondan (nodo source)
            // Se llama al método emit_tuple para enviar la tupla t. El tiempo necesario para emitir la tupla se agrega a tpo_emit.
            // emit_tuple maneja la lógica de envío de la tupla a las colas correspondientes
            // La acumulación del tiempo de emisión 'tpo_emit' permite rastrear el tiempo total dedicado a enviar todas las tuplas
            tpo_emit += this->emit_tuple( t );
            }
            // Devuelve el puntero compartido a la tupla actual
            return tpo_emit;
        }
            // Condición else. Si 'nroTuplasEnviar' es igual a cero (es decir, no hay tuplas para enviar) se devuelve el valor 1e-9
            // Devolver un valor extremadamente pequeño asegura que la función send_tuple siempre devuelve un número positivo
            return 1e-9;
    
    Método process_tuple:

        double Bolt::process_tuple( shared_ptr<Tupla> tupla ){
            // Generación de un Tiempo de Servicio:
            return  this->_wrapper.gen_continuous( this->_avg_service_time );
        }

        Indica que una tupla está siendo procesada
        Devuelve un tiempo de servicio para procesar la tupla utilizando una distribución continua basada en el tiempo promedio de servicio (_avg_service_time)
        La función 'get_continuous' del objeto '_wrapper' genera un valor continuo
        En el contexto de una simulación, este método puede ser utilizado para simular el tiempo que toma procesar una tupla en un nodo Bolt
        El uso de gen_continuous sugiere que los tiempos de servicio no son constantes, sino que siguen una distribución, lo cual es común en simulaciones para modelar variabilidad en el procesamiento
    
    Método pull_tuple:

        shared_ptr<Tupla> Bolt::pull_tuple( ){
            // Declara una variable t de tipo shared_ptr<Tupla>
            // Llama al método 'pull_tuple' del objeto '_processor' pasando como argumento 'this->to_string()
            // this->to_string() convierte el objeto Bolt a una representación en cadena (probablemente el nombre del Bolt o su identificador)
            shared_ptr<Tupla> t = _processor->pull_tuple( this->to_string( ) );
            // Retorna la variable t, que es un shared_ptr a un objeto Tupla
            return t;
        }

        Obtiene (extrae) una tupla desde el objeto _processor asociado con el Bolt
        Usa la representación en cadena del Bolt para identificar la cola de tuplas específica de la que debe extraer la tupla
        Interactúa con un procesador (_processor) para extraer una tupla específica para el Bolt
        Utiliza la representación en cadena del Bolt para identificar la cola correcta desde donde extraer la tupla
        Gestiona la tupla mediante un shared_ptr para asegurar la correcta administración de la memoria
    
    Método get_current_tuple:

        shared_ptr<Tupla> Bolt::get_current_tuple( ){
            // Retorno de la Variable _tupla
            return _tupla;
        }

        Devuelve la tupla actual que el Bolt está procesando
        Proporciona un mecanismo para acceder a la tupla sin modificarla
        Permite a otros componentes del sistema consultar cuál es la tupla que el Bolt está procesando actualmente
        En un sistema de procesamiento de flujos, este método puede ser útil para depuración, monitoreo, o para operaciones que necesiten saber cuál es la tupla en curso
    
    