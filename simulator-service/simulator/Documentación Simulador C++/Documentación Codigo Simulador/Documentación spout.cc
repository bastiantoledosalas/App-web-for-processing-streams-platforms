Documentación de la Clase spout.cc:

    Inclusiones y Variables Estáticas:

        #include "spout.h"  :       Incluye el archivo de cabecera 'spout.h', que probablemente contiene la definición de la clase 'Spout'

        int Spout::_nro_tupla=0;    Es STATIC para que todos los generadores utilicen nros consecutivos diferentes de tuplas (id)
                                    Define e inicializa una variable estática 'Spout::_nro_tupla' a 0
                                    Esta variable es compartida por todas las instancias de la clase 'Spout' y se usa para asignar números consecutivos a las tuplas generadas
    
    Método run:

        double Spout::run( double timestamp ){}

        Define el método 'run' de la clase 'Spout' que toma un 'timestamp' como argumento y devuelve un 'double'

        _tupla = make_shared<Tupla>( _nro_tupla);   Crea una nueva tupla con un ID único '_nro_tupla' y la asigna el puntero compartido '_tupla'
                                                    Id de tupla consta de NombreSpout_NroTupla

        _tupla->timestamp( timestamp );             Actualiza el 'timestamp' de la tupla recién creada
        
        _nro_tupla++;       Incrementa el contador estático '_nro_tupla' para garantizar que la próxima tupla tenga un ID único

        // Genera el tiempo de servicio para este requerimiento
        // Genera un tiempo de servicio continuo basado en la distribución especificada por '_avg_service_time' y lo asigna a 'avg_s_time'
        double avg_s_time = _wrapper.gen_continuous( this->_avg_service_time );


        //Para medir tiempos y throughput
        this->increment_tpo_servicio( avg_s_time );     Incrementa el tiempo de servicio total con 'avg_s_time'
        this->increment_tuplas_procesadas( );           Incrementa el contador de tuplas procesadas

        return avg_s_time;     Devuelve el timpo de servicio generado para esta tupla

    Método send_tuple:

        double Spout::send_tuple( )     Define el método send_tuple de la clase Spout, que no toma argumentos y devuelve un double
            
            double tpo_emit = this->emit_tuple( _tupla );   Llama al método emit_tuple para enviar la tupla _tupla y asigna el tiempo de emisión resultante a tpo_emit
            return tpo_emit;                                Devuelve el tiempo de emisión de la tupla
        
    


