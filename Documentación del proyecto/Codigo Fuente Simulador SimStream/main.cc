#include "glob.h"
#include "spout.h"
#include "bolt.h"
#include "processor/processor.h"
#include "processor/core.h"
#include "network/net_iface.h"
#include "network/comm_switch.h"
#include "generator/generator.h"

#include <unistd.h> //Para funcion getopt de parametros requeridos por linea de comando

class sistema: public process
{
private:
  double _simulation_time;
  uint32_t _qty_tuples; //Cantidad de tuplas a generar entre todos los spouts
  string _topology_file;
  string _nodes_file;
  string _arrival_rate_file;

  //Guarda Spouts y Bolts, se diferencian por char del pair.
  map<string, pair<vector</*posicion es el id replica*/ Node*>, char/*S:spout/bolt*/>> nodes;

  //Procesadores
  map<string, Processor*> processors;

  //Generadores
  list<handle<Generator>> generators;

  //handle<CommSwitch> comm_switch;
  map<string, handle< CommSwitch > > comm_switches;

public:
  sistema( const string& _name,
           double simulation_time,
           uint32_t qty_tuples,
	   string topology_file,
           string nodes_file
         ) : process( _name )
  {
    _simulation_time = simulation_time;
    _qty_tuples = qty_tuples;
    _topology_file = topology_file;
    _nodes_file = nodes_file;
    _arrival_rate_file = "";
  }

  sistema( const string& _name,
           double simulation_time,
           uint32_t qty_tuples,
           string topology_file,
           string nodes_file,
           string arrival_rate_file
         ) : process( _name )
  {
    _simulation_time = simulation_time;
    _qty_tuples = qty_tuples;
    _topology_file = topology_file;
    _nodes_file = nodes_file;
    _arrival_rate_file = arrival_rate_file;
  }

  uint32_t number_of_processors( );

protected:
  void inner_body( void );
  void load_nodes_from_file( string );
  void build_topology_from_file( string );
  void connectSwitchesAndNodes( );

  //Construccion del Fat-Tree
  // Construye tablas de ruteo de acuerdo a paper "A Scalable, Commodity Data Center Network Architecture"
  // Mohamed Al-Fares, et al.
  void build_fat_tree( );
  uint32_t calculate_k( uint32_t );
};

void sistema::inner_body( void ){

  //Llena los arreglos "spouts" y "bolts",
  load_nodes_from_file( _nodes_file );

  //Construye el Fat-Tree
  build_fat_tree( );

  //Definimos la cantidad maxima de tuplas a generar (entre todos los generadores)
  Generator::set_max_tuples( _qty_tuples );

  //Crea la topologia y establece los enlaces entre Spouts/Bolts
  build_topology_from_file( _topology_file );

  //Conecta los hosts a los switches Edge
  connectSwitchesAndNodes( );

  //Activar Generators
  for( auto gens : generators ){
    gens->activate();
  }

  ////////////////////////////////////////////////
  ////////////// FIN SIMULACION //////////////////
  hold( _simulation_time );

  //TIEMPO DE SIMULACION (REAL), no el definido por _simulation_time.
  //Porque las tuplas se pueden haber terminado de procesar antes.
  double SIM_TIME = Core::SIM_TIME;

  //Metricas de uso de Procesador y Memoria
  //cout << "--------------------------------------------------------------------------------------" << endl << endl;
  double tpo = 0.0;
  for( auto procs : processors){
    if(!procs.second){
      std::cerr << "Procesador nulo detectado" << procs.first << std::endl;
      continue;
    }
    cout << "PROCESSOR: " << procs.second->to_string() << " in_use: " << procs.second->in_use() << " - average memory=" << procs.second->average_memory_consumption() << " - max memory=" << procs.second->max_memory_consumption() << " -- accs=" << procs.second->_ram_memory._nbr_accesses << " -- cumm=" << procs.second->_ram_memory._cumulative_use<< endl;
    for( auto cores : procs.second->cores( ) ){
      cout << "PROCESSOR: " << procs.second->to_string() << " - CORE: " << cores->to_string() << " time_in_use: " << cores->_in_use << " total_time: " << SIM_TIME << " utilization: " << (double)(cores->_in_use/SIM_TIME) << endl;
      tpo += cores->_in_use;
    }
    cout << "PROCESSOR utilization: " << (double)(tpo/CANT_CORES/SIM_TIME) << endl << endl;
  }

  //Metricas de Nodos (Spouts/Bolts)
  uint32_t tuplas_proc_final = 0; //Tuplas procesadas por los nodos final
  for( auto nde : nodes ){
    tpo = 0.0;
    uint32_t tuplas_proc = 0; 
    string nombre;
    
    for( auto elem : nde.second.first ){
      cout << "NODE: " << elem->to_string()
         << " use_time: " << elem->tpo_servicio()
         << " total_time:" << SIM_TIME
         << " utilization:" << (double)(elem->tpo_servicio()/SIM_TIME)
         << " throughput:" << (double)(elem->tuplas_procesadas()/SIM_TIME)
         << " avg_resp_time:" << (double)(elem->tpo_servicio()/elem->tuplas_procesadas())
         << " tuples: " << elem->tuplas_procesadas()
         << " replica: " << elem->_rep_id
         << endl;

      tpo += elem->tpo_servicio();
      tuplas_proc += elem->tuplas_procesadas();
      nombre = elem->_name;
    }
    cout << "utilization:"  << (double)(tpo/nde.second.first.size()/SIM_TIME) 
        << " throughput:" << (double)(tuplas_proc/SIM_TIME) 
        << " replicas:" << nde.second.first.size() << endl;
    
    cout << endl;
  }
  cout << "\t tuples generated:" << _qty_tuples 
      <<" tuples processed:" << tuplas_proc_final 
      << " throughput topology:" << (double)(tuplas_proc_final/SIM_TIME) 
      << " average tuple response time:" << (double)( SIM_TIME/tuplas_proc_final ) 
      << " total simulation time:" << SIM_TIME << endl;

  cout << endl << endl;
  for(auto gens: generators){
    if(!gens ->terminated()){
      std:cerr  << "Generador no terminado: "<< gens->to_string() << std::endl;
      }
  }
  end_simulation( );
}

/*
* Construye tablas de ruteo de acuerdo a paper "A Scalable, Commodity Data Center Network Architecture"
* Mohamed Al-Fares, et al.
*/
void sistema::build_fat_tree( ){

  uint32_t n_procs = number_of_processors( );
  uint32_t K = 4;

  uint32_t cant_core_sw  = pow( ( K / 2 ) , 2 );
  uint32_t cant_aggr_sw  = ( K / 2 ) * K;
  uint32_t cant_edge_sw  = ( K / 2 ) * K;
  uint32_t cant_pods     = K;
  uint32_t cant_hosts    = pow( ( K / 2 ), 2 ) * K;
  uint32_t cant_hosts_pod = pow( ( K / 2 ) , 2 );
  
  //Construye el Fat-Tree   
 for( uint32_t current_pod = 0; current_pod < K; current_pod++){
    //Capa inferior SWs POD (Edge Switches)
    for( uint32_t current_sw = 0; current_sw < (K/2); current_sw++ ){
      string sw_ip = "10." + std::to_string( current_pod ) + "." + std::to_string( current_sw ) + ".1";
      //Crea SW EDGE
      comm_switches[ sw_ip ] = new CommSwitch("SW:" + sw_ip, K, sw_ip, CommSwitch::SW_EDGE );
      comm_switches[ sw_ip ]->IP( sw_ip );
      //Estableciendo conexion entre SW EDGE con SW AGGREGATION (current_sw con upper_sw)
      for( uint32_t upper_sw = (K/2); upper_sw < K; upper_sw++ ){
        string remote_sw_ip = "10." + std::to_string( current_pod ) + "." + std::to_string( upper_sw ) + ".1";
        //Crear SW AGGREGATION
        //Para evitar sobreescribir el objeto en el mapa si hay muchos puertos
        if( comm_switches.count( remote_sw_ip ) == 0 )
          comm_switches[ remote_sw_ip ] = new CommSwitch("SW:" + remote_sw_ip, K, remote_sw_ip, CommSwitch::SW_AGGREGATION );
        comm_switches[ remote_sw_ip ]->IP( remote_sw_ip );

        //Conecta Edge con Aggregation
        comm_switches[ sw_ip ]->connectToCommSwitch( upper_sw/*current_sw*/, comm_switches[ remote_sw_ip ] );
        //Conecta Aggregation con Edge
        comm_switches[ remote_sw_ip ]->connectToCommSwitch( current_sw/*upper_sw*/, comm_switches[ sw_ip ] );
      }//for Switches Aggregation en Pod
    }//for Switches Edge en Pod
  }//for Pods

  //Crea SWs Core. Hay (K/2)^2 Core Switches.
  //IPs Core SWs forma 10.k.i.j
  for( uint32_t i = 1; i <= (K/2); i++ ){
    for( uint32_t j = 1; j <= (K/2); j++ ){
      string sw_ip = "10." + std::to_string( K ) + "." + std::to_string( i ) + "." + std::to_string( j );
      comm_switches[ sw_ip ] = new CommSwitch("SW:"+ sw_ip, K, sw_ip, CommSwitch::SW_CORE );
      comm_switches[ sw_ip ]->IP( sw_ip );
      //Conectar el SW CORE recien creado con un SW de cada POD
      for( uint32_t current_pod = 0; current_pod < K; current_pod++ ){
        string aggregation_ip = "10." + std::to_string( current_pod ) + "." + std::to_string( (K/2)+(i-1) ) + ".1";
        //Conecta Core con Aggregation
        comm_switches[ sw_ip ]->connectToCommSwitch( current_pod, comm_switches[ aggregation_ip ] );
        //Conecta Aggregation con Core
        comm_switches[ aggregation_ip ]->connectToCommSwitch( (K/2) + (j-1), comm_switches[ sw_ip ] );
      }
    }
  }
}

/*
* Dado el numero de hosts (computadores o procesadores) indica la cantidad K de puertos
* que deben tener los Switches que componen el Fat-Tree.
*/
uint32_t sistema::calculate_k( uint32_t n_procs ){
  uint32_t K = 1;

  while( 1 ){
    if( n_procs <= ( pow( K, 3 ) / 4 ) && ( (K % 2) == 0) )
      break;
    K++;
  }
  cout << "K value: " << K << endl;
  return K;
}

void sistema::load_nodes_from_file( string filename ){
  std::ifstream fin( filename ); 
  assert( fin.is_open() );

  //Carga y construye los diferentes nodos (Spouts y/o Bolts)
  string linea;
  string node_name;
  char node_type;
  int grouping_type;
  int replication_level;
  string proc_name;
  std::string avg_service_time;

  uint32_t generator_id = 0;

  while( getline(fin, linea ) ){
    if( linea[0] == '#' ){ //Caracter de comentario, solo lo admite al inicio de la linea
      continue;
    }

    stringstream st( linea );
    st >> node_name;
    st >> node_type;
    st >> replication_level;
    st >> grouping_type;

    //Creamos Processor
    st >> proc_name;
    Processor *proc;
    if( processors.count(proc_name) == 0 ){
      //Creacion interface de red
      NetIface *net_iface = new NetIface( proc_name );

      proc = new Processor( proc_name, CANT_CORES, net_iface, /*memory size*/ MAX_MEMORY );
      processors[ proc_name ] = proc;
    }else
      proc = processors[ proc_name ];

    assert( replication_level > 0 );//No puede haber cero replicas de un nodo

    //Estructura del contenedor de Nodos (Spouts y/o Bolts)
    if( node_type == 'S'){
        st >> avg_service_time;  //TODO: Spout y Bolt usan AvgServiceTime, modificar y usar solo una variable.

	std::string arrival_rate;
        st >> arrival_rate;  //Tasa de arrivo al spout

        nodes[ node_name ] = make_pair(vector< Node* /*Replicas*/>(replication_level), 'S');

        //Creamos el Generator para el/los Spout(s). Spout y replicas usan el mismo Spout.
        handle<Generator> gen;
        gen = new Generator("Generator", generator_id, arrival_rate);
        generators.push_back( gen );
        generator_id++;

        //cout << "MAIN creating " << replication_level << " spouts - assigned to " << gen->to_string() << endl;
        for( int i = 0; i<replication_level; i++){
          //Creamos al Spout
          Spout *spout = new Spout(node_name, i/*id rep*/, replication_level, avg_service_time, grouping_type);
          spout->set_processor( proc );

          //Relacionamos los elementos entre si.
          gen->set_processor( proc );
          gen->add_spout( spout );
          proc->assign_spout( spout );

          //Finalmente guardamos el Spout en el arreglo de nodos
          nodes[ node_name ].first.at(i)=(Node*)spout;
          //cout << "MAIN Generator " << gen->to_string( ) << " assigned spout " << spout->to_string() << endl;
        }
    }else{
      if( node_type == 'B'){
        std::string nro_tuplas_output;
        st >> nro_tuplas_output;

        st >> avg_service_time;

        nodes[ node_name ] = make_pair(vector< Node* /*Replicas*/>(replication_level), 'B');
        for( int i = 0; i<replication_level; i++){
          Bolt *bolt = new Bolt(node_name, i/*id replica*/, replication_level, avg_service_time, nro_tuplas_output, grouping_type );
          bolt->set_processor(proc);

          //Asignamos el Bolt a un procesador
          proc->assign_bolt( bolt );

          nodes[ node_name ].first.at(i)=(Node*)bolt;
        }     
      }
    }  
  }
}

/**
* Retorna la cantidad de procesadores utilizados para alojar tanto a los spouts como a los bolts
**/
uint32_t sistema::number_of_processors( ){
  return (uint32_t) processors.size( );
}

/**
* Carga topologia desde un archivo y establece conexiones entre los diferentes Sputs/Bolts
* Conexiones son referencias entre Spuots/Bolts
*/
void sistema::build_topology_from_file( string filename ){
  map<string, list<string>> topology;
  set<string> nodos_origen; // Conjunto para nodos que son origen de otros nodos.
  ifstream fin( filename );

  assert( fin.is_open( ) );
  if (!fin.is_open()) {
    std::cerr << "Error: No se pudo abrir el archivo " << filename << std::endl;
    }

  //Define la topologia sin considerar nivel de replicacion, se utiliza luego para conectar nodos.
  string linea,
         source,
         target;
  while( getline(fin, linea) ){
    if( linea.at(0) == '#' ){ //Caracter de comentario, solo lo admite al inicio de la linea
      continue;
    }
    stringstream st( linea );
    st >> source;
    st >> target;

    topology[ source ].push_back( target );
    // Agrega el nodo de origen al conjunto de nodos que son orígenes.
    nodos_origen.insert(source);
  }

  int connection_count = 0; // Contador de conexiones
  //ESTABLECE CONEXIONES ENTRE TODAS LAS REPLICAS DE ORIGEN/DESTINO
  for( auto iter_topology_sources : topology){                                // Recorre las fuentes (sources)
    for( auto iter_topology_targets : iter_topology_sources.second ){         // Recorre los destinos (targets)
      source = iter_topology_sources.first;                                   //Fuentes
      for( auto iter_nodes_source : nodes[source].first){                     // Recorre todas las réplicas de source 
        target = iter_topology_targets;                                 
        for( auto iter_nodes_targets : nodes[target].first ){                 // Recorre las replicas de target
          ( ( Node* )( iter_nodes_source ) )->add_node( iter_nodes_targets ); // Añade la conexión
          connection_count++; // Aumentar el contador por cada conexión
        }
      }
    }
  } 

  // Imprimir nodos que no son origen de ningún otro nodo
    int non_origin_node_count = 0; // Contador de nodos que no son origen
    for (auto& node_pair : nodes) {
        string node_name = node_pair.first;
        if (nodos_origen.find(node_name) == nodos_origen.end()) {
            // Si el nodo no está en el conjunto de nodos_origen, es un nodo que no es origen de ningún otro nodo
            non_origin_node_count++;
        }
    }
  //Topology no se necesita mas, se usa solo para establecer las conexiones entre nodos
  topology.clear();
}

void sistema::connectSwitchesAndNodes( ){

  //cout << "MAIN Fat-Tree: connecting switches and nodes" << endl;
  for( auto proc : processors ){

    //Construye IP del SW EDGE al que se debe conectar la NetIface
    std::vector< string > ip_parts = Utilities::tokenizeString( proc.second->get_IP( ), '.' );
    string ip_sw = "10." + ip_parts[ 1 ] + "." + ip_parts[ 2 ] + ".1";

    //Conecta la iface con el switch de comm, y viceversa.
    if( comm_switches.count( ip_sw ) == 0 ){
      exit( -1 );
    }

    comm_switches[ ip_sw ]->connectToNode( proc.second->_net_iface );
    proc.second->_net_iface->connectToCommSwitch( (handle<CommSwitch>)comm_switches[ ip_sw ] );
  }
}

int main( int argc, char* argv[] )
{

  string topology_file,
         nodes_file,
         arrival_rate_file;
  double simulation_time = 1000e100;
  uint32_t qty_tuples = 0;

  char c;
  extern char *optarg;
  uint32_t tflag = 0;
  uint32_t nflag = 0;
  uint32_t aflag = 0;
  uint32_t pflag = 0;

  while ((c = getopt(argc, argv, "t:p:n:l:r:")) != -1)
    switch (c) {
      case 't':
        topology_file = optarg;
        tflag = 1;
        break;
      case 'n':
        nodes_file = optarg;
        nflag = 1;
        break;
      case 'l':
        simulation_time = std::stod( optarg );
        break;
      case 'r'://Para el caso en que la tasa de arribo debe variar durante la simulacion
        arrival_rate_file = optarg;
        aflag = 1;
        break;
      case 'p':
        qty_tuples = std::stoul( optarg );
        pflag = 1;
        break;
      default:
        exit( -1 );
        break;
  }

  if( tflag == 0 ){
    cout << "Mandatory parameter -t (topology file) needed" << endl;
    exit( -1 );
  }
 
  if( nflag == 0 ){
    cout << "Mandatory parameter -n (nodes file) needed" << endl;
    exit( -1 );
  }

  if( pflag == 0 ){
    cout << "Mandatory parameter -p (amount of tuples to generate) needed" << endl;
    exit( -1 );
  }
  
  // Inicializa la simulacion
  simulation::instance( )->begin_simulation( new sqsDll( ) );

  handle<sistema> sis;
  if(aflag == 0 )
    sis = new sistema("System main", simulation_time, qty_tuples, topology_file, nodes_file);
  else
    sis = new sistema("System main", simulation_time, qty_tuples, topology_file, nodes_file, arrival_rate_file);

  handle<sistema> system( sis /*new sistema("System main", simulation_time, topology_file, nodes_file)*/ );
  system->activate();

  simulation::instance( )->run( );

  simulation::instance( )->end_simulation( );


  return 0;
}
