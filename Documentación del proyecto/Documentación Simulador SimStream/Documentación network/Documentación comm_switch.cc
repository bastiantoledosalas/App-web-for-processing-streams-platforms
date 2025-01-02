Documentación comm_switch.cc:


    Clase CommSwitch:

        #include "comm_switch.h"
        #include "net_iface.h"

        map<std::string/*nombre*/, NetIface *> CommSwitch::_network;

        Deglose Detallado:
            _network        'Map' estático que asocia nombres de 'NetIface' (interfaces de red) con punteros a objetos 'NetIface'
                            Este mapa se utiliza para mantener la red de interfaces de comunicación
        
        Métodos de la Clase 'CommSwitch':

            Método 'inner_body':

                void CommSwitch::inner_body( ){

                    //Este bucle Infinito simula el comportamiento continuo de un switch de red que siempre está listo para procesar paquetes
                    while( true ){

                        //Si no hay tuplas ni en colas de entrada ni en colas de salida, entonces dormir
                        //Se verifica si hay paquetes en las colas de entrada 'obtainInputPackages' y en las colas de sa
                        if( !this->obtainInputPackages( ) || !this->packagesAtOutputQueue( ) ){
                            _comm_switch_state = COMM_SWITCH_IDLE;
                            passivate( );
                            continue; //Para que una vez despierto vuelva a intentar obtener las tuplas
                        }

                        Proposito General:
                            Se verifica si hay paquetes en las colas de entrada 'obtainInputPackage' y en las colas de salida 'packagesAtOutputQueue'
                            Si no hay paquetes en ambas, el switch se inactiva cambiando su estado a 'COMM_SWITCH_IDLE' y llama a 'passivate' para esperar hasta que se active de nuevo
                            La declaración 'continue' se usa para volver al inicio del bucle  después de la activación

                        //Si hay paquetes, el switch cambia su estado a ocupado 'COMM_SWITCH_BUSY'
                        _comm_switch_state = COMM_SWITCH_BUSY;
                        
                        //Se mantiene el estado ocupado por un breve periodo de tiempo (1 nanosegundo) simulando el tiempo de procesamiento del switch
                        hold( 1e-9 );

                        //Procesamiento de Paquetes en las Colas de Salida
                        //Se recorre cada cola de salida '_queue_out'. Si una cola no está vacía, se extrae el primer paquete 'front' y se elimina de la cola 'pop_front'
                        for(map<int, list< Package *> >::iterator q_out = _queue_out.begin(); q_out != _queue_out.end(); q_out++){
                            if( !q_out->second.empty( ) ){
                                Package *p = q_out->second.front( );
                                q_out->second.pop_front( );

                               //Se obtiene la IP destino del paquete y se divide en partes usando el método 'tokenizeStringToInt'
                               std::vector< uint32_t > ip_parts = Utilities::tokenizeStringToInt( p->tupla()->IP_destino( ), '.' );

                                switch( _comm_switch_type ){
                                    case SW_CORE:
                                        _ports_switch[ ip_parts[ 1 ]/*indica pod destino*/ ]->receivePackage( p );
                                        break;

                                     case SW_AGGREGATION:  
                                        if( _pod == ip_parts[ 1 ]){ //Destino esta en el mismo POD, va hacia abajo, usar preffix
                                            _ports_switch[ _preffix_routing_table[ ip_parts[ 2 ]/*subnet o nroSwitch*/ ] ]->receivePackage( p );
                                        }else{
                                            _ports_switch[ _suffix_routing_table[ ip_parts[3] ] ]->receivePackage( p );}             
                                        break;

                                     case SW_EDGE:
                                        if( _pod == ip_parts[ 1 ] && _sw == ip_parts[ 2 ] ){
                                            _ports_host[ _preffix_routing_table[ ip_parts[ 3 ] ]/*output port*/]->receivePackage( p );
                                        }else{
                                            _ports_switch[ _suffix_routing_table[ ip_parts[3] ] ]->receivePackage( p ); }
                                        break;
                                }//end switch

                                Deglose Detallado:
                                    SW_CORE             El paquete se envía a otro switch basado en la segunda parte de la IP destino (indica el POD destino)
                                    SW_AGGREGATION      Si el destino está en el mismo POD, el paquete se envía hacia abajo usando la tabla de ruteo de prefijo '_preffix_routing_table'
                                                        Si el destino está en otro POD, el paquete se envía hacia arriba usando la tabla de ruteo de sufijo '_suffix_routing_table'
                                    SW_EDGE             Si el destino está en el mismo POD y en el mismo switch, el paquete se envía a un host usando la tabla de ruteo de prefijo
                                                        Si el destino está en otro switch, el paquete se envía a otro switch usando la tabla de ruteo de sufijo
                            }//end if
                        }//end for
                    }//end while true
                }//end inner_body function

                Proposito General del Método:
                    El método 'inner_body' es el núcleo de la lógica de conmutación del 'CommSwitch' se ejecuta continuamente en un bucle infinito
                    Verifica si hay paquetes para procesar. Si no hay paquetes, el switch se inactiva pero en el caso de haber paquetes, el switch es el encargado
                    de procesar cada paquete, determinando su destino basado en el tipo de switch y las tablas de ruteo.
                    De esta forma el método maneja tanto la entrada como la salida de paquetes, asegurando que cada paquete llegue a su destino adecuado en la red
