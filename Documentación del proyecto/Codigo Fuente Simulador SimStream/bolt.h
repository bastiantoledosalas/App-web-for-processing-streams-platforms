#ifndef BOLT_H
#define BOLT_H

#include "glob.h"  // Incluye el archivo de cabecera global
#include "node.h"  // Incluye el archivo de cabecera del nodo

//#include "processor/processor.h"
//class Processor;

// Definición de la clase Bolt que hereda de Node
class Bolt: public Node
{
public:
  //Distribucion que indica si el Bolt emite un tweet, multiples o los filtra
  std::string _nbr_output_tuples;

protected:
  // Método interno vacío
  void inner_body( void ){;}

public:
  // Constructor de la clase Bolt
  Bolt( const string& name,
        const uint32_t& id,
        const uint32_t& rep_level,
        const std::string& avg_service_time, 
        const std::string& nbr_output_tuples,
        const int& stream_grouping
	) : Node( name, Node::BOLT, id, rep_level, avg_service_time, stream_grouping )
  {
    this->_node_state = NODE_IDLE;                 // Establece el estado del nodo como IDLE
    this->_nbr_output_tuples = nbr_output_tuples;  // Asigna la distribución de tuplas de salida

   //cout << "Bolt name=" << name << " id=" << id << "dist_avg_service_time=" <<"Nodo Bolt=" <<Node::BOLT << avg_service_time << " grouping=" << stream_grouping << " dist_output_tuples=" << _nbr_output_tuples << endl;
  }

  double run(double timestamp = 0.0);      // Método run de Bolt
  double send_tuple();                     // Método send_tuple de Bolt

  // Procesa la tupla (la puede modificar) y la retorna con el tiempo de hold
  double/*hold*/ process_tuple( shared_ptr<Tupla> );

  // Realiza un pull de la cola del Processor para obtener una tupla.
  shared_ptr<Tupla> pull_tuple( );

  // Obtiene la tupla actual
  shared_ptr<Tupla> get_current_tuple( );

  ~Bolt(){
    //node_list.clear( );
  }
};
#endif
