#include "generator.h"

uint32_t Generator::_generated_tuples = 0;
uint32_t Generator::_max_tuples = 0;

void Generator::inner_body( void ){

  while(true){
      //Verificamos si debemos seguir generando tuplas
      if( _generated_tuples > _max_tuples ){
        passivate( );
      }

      //Incrementamos contador de generacion de tuplas
      _generated_tuples++;

      double arrival_rate = this->_wrapper.gen_continuous( this->_arrival_rate );
    std::cout << "ARRIVAL_RATE " << arrival_rate << std::endl; 
      hold( arrival_rate );

      _current_spout = this->next_spout( );
      this->_processor->schedule_spout_processing( _current_spout->to_string() );
  }
}

void Generator::set_processor( Processor *proc){
  this->_processor = proc;
}

void Generator::add_spout( Spout *spout){
  this->_spout_list.push_back( spout );
}

Spout* Generator::next_spout( ){
  Spout *spout = _spout_list.front( );
  _spout_list.pop_front( );
  _spout_list.push_back( spout );
  return spout;
}
