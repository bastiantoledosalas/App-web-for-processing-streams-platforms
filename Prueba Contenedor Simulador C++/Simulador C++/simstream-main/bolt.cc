#include "bolt.h"                 // Incluye el archivo de cabecera de la clase Bolt
#include "processor/processor.h"  // Incluye el archivo de cabecera del procesador

// Método que ejecuta el Bolt y procesa una tupla
double Bolt::run( double timestamp ){
  //ASSERT para evitar que no haya tuplas que procesar por el Bolt
  //cout << this->to_string( ) << " pulling tuple - tuple_queue_size()=" << _processor->tuple_queues_size_for_bolt( this->to_string() ) << endl; 
  assert( !_processor->tuple_queues_empty( this->to_string() ) );

  // Extrae (pull) tupla de la cola.
  _tupla = this->pull_tuple( );
  //cout << this->to_string() << " - tupla PULLED - tupla_id=" << _tupla->id() << endl;

  // Actualiza timestamp de la tupla
  _tupla->timestamp( timestamp );

  // Retorna la tupla procesada y el tiempo de Hold
  double tpo = process_tuple( _tupla );
  std::cout << "SERVICE_TIME " << this->to_string() << " " << tpo << std::endl;
	
  // Para medir tiempos y throughput
  this->increment_tpo_servicio( tpo );
  this->increment_tuplas_procesadas( );

  //cout << this->to_string() << " - tupla PROCESSED - tupla_id=" << _tupla->id() << endl;

  // Retorna el tiempo de Procesamiento
  return tpo;
}

// Método que envía una tupla procesada a los Bolts Correspondientes
double Bolt::send_tuple( ){

/**
* emit_tuple alojara las tuplas procesadas en la(s) colas que correspondan (nodo source).
* nodo source despues debera despertar al nodo target para que este haga el pull.
* process_tuple target debera hacer pull de la cola, luego de ser despertado por source.
*/
  // Genera el número de tuplas a enviar
  std::cout << "Distribution: " << this->_nbr_output_tuples << std::endl;
  uint32_t nroTuplasEnviar = _wrapper.gen_discrete( this->_nbr_output_tuples );
  std::cout << "NUMBER_OF_TUPLES " << this->to_string() << " " << nroTuplasEnviar << std::endl;

  if( nroTuplasEnviar != 0 ){
    double tpo_emit = 0.0;
    // Itera y envía cada tupla
    for(uint32_t i = 0; i < nroTuplasEnviar; i++){
      shared_ptr<Tupla> t = make_shared<Tupla>( *_tupla );
      // Marca la copia de la tupla
      t->copia( i );
      // Envía la tupla
      tpo_emit += this->emit_tuple( t );
      //cout << this->to_string( ) << " tupla EMITTED - tupla_id=" << t->id() << " id_tramo=" << t->id_tramo() << " nro_local=" << t->nro_tupla() << " copia=" << t->copia() << " nroTuplas=" << nroTuplasEnviar << endl;
    } //endfor
    // Retorna el tiempo total de emisión
    return tpo_emit;
  }

  //cout << this->to_string() << " tuplas a enviar=" << nroTuplasEnviar
  //     << " is acting as a final node, not sending anything - tupla_id=" << _tupla->id()
  //     << " nro_local=" << _tupla->nro_tupla() << " smart_ptr.count=" << _tupla.use_count() << endl;

  //Assuming a super fast network
  // Si no hay tuplas para enviar, retorna un valor pequeño
  return 1e-9;
}

// Método que procesa una tupla y retorna el tiempo de servicio
double Bolt::process_tuple( shared_ptr<Tupla> tupla ){
  //cout << this->to_string( ) << " tupla PROCESSING" << endl;
  // Genera el tiempo de servicio
  return  this->_wrapper.gen_continuous( this->_avg_service_time );
}

// Extrae una tupla de la lista desde Processor
shared_ptr<Tupla> Bolt::pull_tuple( ){
  shared_ptr<Tupla> t = _processor->pull_tuple( this->to_string( ) );
  // Retorna la tupla extraida
  return t;
}

//Retorna la ultima tupla extraida desde la cola
shared_ptr<Tupla> Bolt::get_current_tuple( ){
  // Retorna la tupla actual
  return _tupla;
}