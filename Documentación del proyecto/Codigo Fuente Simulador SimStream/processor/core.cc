#include "core.h"

#include "processor.h"
//#include "../node.h"
//#include "../bolt.h"

double Core::SIM_TIME = 0.0;

void Core::inner_body( ){

  //Indica si los nodos de la cola estan marcados como ocupados (por otro core)
  bool _no_nodes_to_process = false;

  while( true ){

    //Revisamos si hay algun Spout/Bolt que necesite procesamiento.
    if( this->_processor->nodes_queue_empty( ) || _no_nodes_to_process ){
      this->_state = CORE_IDLE;
      SIM_TIME = this->time();
      passivate( );
    }

    //cout << this->to_string( ) << " getting node to process (qty left=" << this->_processor->nodes_queue_size()  << ") time()=" << time() << endl;

    //Obtenemos el Bolt/Spout que demanda servicio
    Node *node;
    if( !this->_processor->get_next_node( &node ) ){
      _no_nodes_to_process = true;
      continue;
    }

    this->_state = CORE_BUSY;
    _no_nodes_to_process = false;
    node->set_node_busy( );

    double tpo_hold;
    Node::node_type n_type = node->_node_type;
    switch( n_type ){
      case Node::SPOUT:

        //Mediciones
        tpo_hold = node->run( this->time( ) );
        this->_in_use += tpo_hold;
        this->_processor->increment_in_use( tpo_hold );
        //Probando/revisando Tiempos

        hold( tpo_hold );

        //Mediciones
        tpo_hold = node->send_tuple( );
        this->_in_use += tpo_hold;
        this->_processor->increment_in_use( tpo_hold );

        hold( tpo_hold );

        break;
      case Node::BOLT:
        //Do whatever a Bolt should do
        node->_node_state = Node::NODE_BUSY;
        tpo_hold = node->run( this->time( ) );

        //Mediciones
        this->_in_use += tpo_hold; 
        this->_processor->increment_in_use( tpo_hold );

        hold( tpo_hold );
        tpo_hold = node->send_tuple( );

        //Mediciones
        this->_in_use += tpo_hold; 
        this->_processor->increment_in_use( tpo_hold );

        hold( tpo_hold );

        //Remove Tuple from Ram Memory
        this->_processor->removeTuple( ((Bolt*)node)->get_current_tuple() );

        node->_node_state = Node::NODE_IDLE;

        break;
    }
    node->set_node_idle( );

  }
}

void Core::get_node_from_processor( ){
  //this->_processor->get_next_node( this->_node );
}

/*
* enlaza a procesador que lo contiene
*/
void Core::set_processor( Processor *processor){
  this->_processor = processor;
}

std::string Core::to_string(){
  return _name;
}
