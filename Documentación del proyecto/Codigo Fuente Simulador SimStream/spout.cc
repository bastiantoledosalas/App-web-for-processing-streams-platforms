#include "spout.h"

//Es STATIC para que todos los generadores utilicen nros consecutivos diferentes de tuplas (id).
int Spout::_nro_tupla=0;

double Spout::run( double timestamp ){
 
  //Id de tupla consta de NombreSpout_NroTupla
  _tupla = make_shared<Tupla>( _nro_tupla );

  //Actualiza timestamp de la tupla
  _tupla->timestamp( timestamp );

  _nro_tupla++;

  //Genera el tiempo de servicio para este requerimiento
  double avg_s_time = _wrapper.gen_continuous( this->_avg_service_time );

  //Para medir tiempos y throughput
  this->increment_tpo_servicio( avg_s_time );
  this->increment_tuplas_procesadas( );

  return avg_s_time;
}

double Spout::send_tuple( ){
  double tpo_emit = this->emit_tuple( _tupla );
  return tpo_emit;
}

