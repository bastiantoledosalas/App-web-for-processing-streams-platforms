Documentación Main.cc 2:

Documentación de la clase main.cc (Linea 1 hasta 437):

    Declaración de la clase 'sistema' que hereda de la clase 'process':

        class sistema: public process{}

    Se definen variables privadas:

        private:
            double _simulation_time;    //Almacena el tiempo total de simulación
            uint32_t _qty_tuples;       //Cantidad de tuplas a generar entre todos los spouts
            string _topology_file;      //Archivo que contiene la información de la topología
            string _nodes_file;         //Archivo que contiene la información de los nodos
            string _arrival_rate_file;  //Archivo que contiene la tasa de llegada o arribo

    Contenedores Privados:

            map<string, pair<vector<Node*>, char>> nodes;   //Guarda Spouts y Bolts que se diferencian por un caracter (char) donde S representa un Spout y B un Bolt
                                                            //Utiliza un mapa para almacenar Spouts y Bolts
            map<string, Processor*> processors;             //Utiliza un mapa para almacenar los procesadores
            list<handle<Generator>> generators;             //Utiliza una lista para almacenar los manejadores de los generadores
            map<string, handle<CommSwitch>> comm_switches;  //Utiliza un mapa para almacenar switches de comunicación


    Definición de Constructores:

        Constructor que inicializa la clase sin un archivo de tasa de llegada (arrival_rate_file):

        public:
            sistema(const string& _name,
                double simulation_time,
                uint32_t qty_tuples,
                string topology_file,
                string nodes_file)
                : process(_name)
            {
            _simulation_time = simulation_time;
            _qty_tuples = qty_tuples;
            _topology_file = topology_file;
            _nodes_file = nodes_file;
            _arrival_rate_file = "";
            }

        Constructor que incluye un archivo de tasa de llegada (arrival_rate_file):

            sistema(const string& _name,
                double simulation_time,
                uint32_t qty_tuples,
                string topology_file,
                string nodes_file,
                string arrival_rate_file)
                : process(_name)
            {
            _simulation_time = simulation_time;
            _qty_tuples = qty_tuples;
            _topology_file = topology_file;
            _nodes_file = nodes_file;
            _arrival_rate_file = arrival_rate_file;
            }

        Ambos constructores inicializan la clase base 'process' con '_name' que corresponde a 'System Main'

    Método Público number_of_processors():

        uint32_t number_of_processors(); //Retorna la cantidad de procesadores utilizados para alojar tanto a los spouts como a los bolts

    Métodos Protegidos:

        protected:
            void inner_body(void);                  //Lógica Principal de la Simulación
            void load_nodes_from_file(string);      //Carga los nodos desde un archivo
            void build_topology_from_file(string);  //Construye la topología desde un archivo
            void connectSwitchesAndNodes();         //Conecta Switches y Nodos
            void build_fat_tree();                  //Construye una Topología Fat-Tree de acuerdo al paper "A Scalable, Commodity Data Center Network Architecture"
            uint32_t calculate_k(uint32_t);         //Calcula el número de puertos (k) necesarios para el Fat-Tree
        

        Método inner_body:

            void sistema::inner_body(void){}        //Definición Principal de la función inner_body()
                
                build_fat_tree();                           //Construye el Fat-Tree
                load_nodes_from_file(_nodes_file);          //Llena los arreglos "spouts" y "bolts"
                Generator::set_max_tuples(_qty_tuples);     //Definimos la cantidad maxima de tuplas a generar (entre todos los generadores)
                build_topology_from_file(_topology_file);   //Crea la topologia y establece los enlaces entre Spouts/Bolts
                connectSwitchesAndNodes();                  //Conecta los host a los switches Edge

                for (auto gens : generators) {      //Activar Generadores
                    gens->activate();
                }
                
                hold(_simulation_time);             //Utilizado para indicar que la entidad actual debe esperar (o "mantenerse")
                                                    //durante un periodo de tiempo especificado _simulation_time
                double SIM_TIME = Core::SIM_TIME;   //TIEMPO DE SIMULACIÓN REAL, no el definido por _simulation_time
                                                    //Porque las tuplas se pueden haber terminado de procesar antes

            Metricas de uso de Procesador y Memoria
    
                double tpo = 0.0;
                for (auto procs : processors) {
                    cout << "PROCESSOR: " << procs.second->to_string() << " in_use: " << procs.second->in_use() << " - average memory=" << procs.second->average_memory_consumption() << " - max memory=" << procs.second->max_memory_consumption() << " -- accs=" << procs.second->_ram_memory._nbr_accesses << " -- cumm=" << procs.second->_ram_memory._cumulative_use << endl;
                    for (auto cores : procs.second->cores()) {
                        cout << "PROCESSOR: " << procs.second->to_string() << " - CORE: " << cores->to_string() << " time_in_use: " << cores->_in_use << " total_time: " << SIM_TIME << " utilization: " << (double)(cores->_in_use / SIM_TIME) << endl;
                        tpo += cores->_in_use;
                    }
                    cout << "PROCESSOR utilization: " << (double)(tpo / CANT_CORES / SIM_TIME) << endl << endl;
                }

            Metricas de Nodos (Spouts/Bolts)
    
                uint32_t tuplas_proc_final = 0; //Tuplas procesadas por los nodos final
                for (auto nde : nodes) {
                    tpo = 0.0;
                    uint32_t tuplas_proc = 0;
                    string nombre;
                    for (auto elem : nde.second.first) {
                        cout << "NODE: " << elem->to_string() << " use_time: " << elem->tpo_servicio() << " total_time:" << SIM_TIME << " utilization:" << (double)(elem->tpo_servicio() / SIM_TIME) << " throughput:" << (double)(elem->tuplas_procesadas() / SIM_TIME) << " avg_resp_time:" << (double)(elem->tpo_servicio() / elem->tuplas_procesadas()) << " tuples: " << elem->tuplas_procesadas() << " replica: " << elem->_rep_id << endl;
                        tpo += elem->tpo_servicio();
                        tuplas_proc += elem->tuplas_procesadas();
                        nombre = elem->_name;
                    }
                    cout << "\t utilization:" << (double)(tpo / nde.second.first.size() / SIM_TIME) << " throughput:" << (double)(tuplas_proc / SIM_TIME) << " replicas:" << nde.second.first.size() << endl;
                    cout << endl;
                }

                cout << "\t tuples generated:" << _qty_tuples << " tuples processed:" << tuplas_proc_final << " throughput topology:" << (double)(tuplas_proc_final / SIM_TIME) << " average tuple response time:" << (double)(SIM_TIME / tuplas_proc_final) << " total simulation time:" << SIM_TIME << endl;
                cout << endl << endl;

            Método para Finalizar la Simulación:

                end_simulation();   //función que se invoca para detener la ejecución de la simulación


        Método build_fat_tree:

            void sistema::build_fat_tree(){}    //Definición Principal de la función build_fat_tree()

            Inicialización de variables para la Topología Fat-Tree:

                uint32_t n_procs = number_of_processors();  //Asigna a la variable n_procs el resultado de la función number_of_processors
                                                            //number_of_processors Retorna la cantidad de procesadores utilizados para alojar tanto a los spouts como a los bolts
                uint32_t K = 4;                             //Inicializa la variable K con el valor 4
                                                            //Originalmente K se calcularía mediante la función calculate_k(n_procs)
                                                            //Pero aquí se establece directamente en 4 para simplificar o para pruebas
                uint32_t cant_core_sw = pow((K / 2), 2);    //Calcula el número de switches de núcleo en la topología Fat-Tree
                                                            //La formula es (K/2)^2 y se asigna el resultado a 'cant_core_sw'
                uint32_t cant_aggr_sw = (K / 2) * K;        //Calcula el número de switches de agregación en la topología Fat-Tree
                                                            //La formula es ((K/2) x K) y se asigna el resultado a 'cant_aggr_sw'
                uint32_t cant_edge_sw = (K / 2) * K;        //Calcula el número de switches de borde en la topología Fat-Tree
                                                            //La formula es ((K/2) x K) y se asgina el resultado a 'cant_edge_sw'
                uint32_t cant_pods = K;                     //Indica el número de pods en la Topología Fat-Tree
                                                            //Asigna el valor de K a cant_pods
                uint32_t cant_hosts = pow((K / 2), 2) * K;  //Calcula el número total de hosts (máquinas) en la topología Fat-Tree
                                                            //La formula es ((K/2)^2 x K) y se asigna el resultado a 'cant_hosts'
                uint32_t cant_hosts_pod = pow((K / 2), 2);  //Calcula el número de hosts por pod en la topología Fat-Tree
                                                            //La formula es (K/2)^2 y se asigna el resultado a 'cant_hosts_pod'

            Construcción del Fat-Tree:

                //Inicia un bucle que itera sobre cada pod en la topología Fat-Tree
                //current_pod es el índice del pod actual y el bucle se ejecuta K veces.
                for (uint32_t current_pod = 0; current_pod < K; current_pod++) {                                    //Crea SWs de cada POD
                    for (uint32_t current_sw = 0; current_sw < (K / 2); current_sw++) {                             //Capa inferior SWs POD (Edge Switches)
                    string sw_ip = "10." + std::to_string(current_pod) + "." + std::to_string(current_sw) + ".1";       
            
            //Crea SW EDGE
            comm_switches[sw_ip] = new CommSwitch("SW:" + sw_ip, K, sw_ip, CommSwitch::SW_EDGE);
            comm_switches[sw_ip]->IP(sw_ip);

            //Estableciendo conexion entre SW EDGE con SW AGGREGATION (current_sw con upper_sw)
            for (uint32_t upper_sw = (K / 2); upper_sw < K; upper_sw++) {
                string remote_sw_ip = "10." + std::to_string(current_pod) + "." + std::to_string(upper_sw) + ".1";

                //Crear SW AGGREGATION
                //Para evitar sobreescribir el objeto en el mapa si hay muchos puertos
                if (comm_switches.count(remote_sw_ip) == 0)
                    comm_switches[remote_sw_ip] = new CommSwitch("SW:" + remote_sw_ip, K, remote_sw_ip, CommSwitch::SW_AGGREGATION);
                comm_switches[remote_sw_ip]->IP(remote_sw_ip);

                //Conecta Edge con Aggregation
                comm_switches[sw_ip]->connectToCommSwitch(upper_sw, comm_switches[remote_sw_ip]);

                //Conecta Aggregation con Edge
                comm_switches[remote_sw_ip]->connectToCommSwitch(current_sw, comm_switches[sw_ip]);

            }//for Switches Aggregation en Pod

        }//for Switches Edge en Pod

    }//for Pods

    //Crea SWs Core. Hay (K/2)^2 Core Switches.
    //IPs Core SWs forma 10.k.i.j
    for (uint32_t i = 0; i < (K / 2); i++) {
        for (uint32_t j = 1; j <= (K / 2); j++) {
            string sw_ip = "10." + std::to_string(K) + "." + std::to_string(i) + "." + std::to_string(j);
            comm_switches[sw_ip] = new CommSwitch("SW:" + sw_ip, K, sw_ip, CommSwitch::SW_CORE);
            comm_switches[sw_ip]->IP(sw_ip);

            //Conectar el SW CORE recien creado con un SW de cada POD
            for (uint32_t pod = 0; pod < K; pod++) {
                string aggr_sw_ip = "10." + std::to_string(pod) + "." + std::to_string(i + (K / 2)) + ".1";

                //Conecta Core con Aggregation
                comm_switches[aggr_sw_ip]->connectToCommSwitch(j - 1, comm_switches[sw_ip]);

                //Conecta Aggregation con Core
                comm_switches[sw_ip]->connectToCommSwitch(pod, comm_switches[aggr_sw_ip]);
            }
        }
    }
}

Método calculate_k:

Determina la cantidad 'k' de puertos que deben terner los switches en una topología Fat-Tree en función del número de procesadores(hosts) proporcionados
El método calculate_k busca el valor mínimo de K que satisface las siguientes condiciones:
    El número de procesadores n_procs debe ser menor o igual a K^3/4
    'K' debe ser un número par

uint32_t sistema::calculate_k(uint32_t n_procs) {
  uint32_t K = 1;

  while (true) {
    if (n_procs <= (pow(K, 3) / 4) && ((K % 2) == 0)) {
      break;
    }
    K++;
  }

  return K;
}

-La variable K se inicializa en 1
-Bucle While infinito (while (true))

-Condición de salida del bucle:
    if (n_procs <= (pow(K, 3) / 4) && ((K % 2) == 0)) {
        break;
    }

n_procs <= (pow(K, 3) / 4:  Verifica si el número de procesadores e menor o igual a K^3/4
K^3/4                    :  Número máximo de hosts que puede soportar una red Fat-tree con switches de 'k' puertos

(K % 2) == 0             :  Verifica si 'K' es par
                            En una topología Fat-Tree el valor de 'K' debe ser un número par para mantener la simetria
                            y correcta conectividad entre los niveles de la red

Si las condiciones no se cumplen, se incrementa K y el bucle continúa (K++)

Cuando se cumplen las condiciones, se sale del bucle y se retorna el valor de 'K'

Método load_nodes_from_file:

    void sistema::load_nodes_from_file(string filename) {}

    Se encarga de cargar y construir diferentes nodos (Spouts/Bolts) a partir de un archivo
    Estos nodos se almacenan en una estructura de contenedores que contiene réplicas de cada nodo y su tipo

    Apertura del archivo:

        Se abre el archivo y se asegura que se haya abierto correctamente

            std::ifstream fin(filename); 
            assert(fin.is_open());

    Inicialización de Variables:

        string linea;
        string node_name;
        char node_type;
        int grouping_type;
        int replication_level;
        string proc_name;
        std::string avg_service_time;
        
        uint32_t generator_id = 0;
    
    Lectura del archivo línea por línea:

        while (getline(fin, linea)) {
            if (linea[0] == '#') { // Ignora líneas de comentarios
                continue;
            }

    Procesamiento de cada Línea:
    
        stringstream st(linea);
        st >> node_name;
        st >> node_type;
        st >> replication_level;
        st >> grouping_type;

        //Creamos Processor
        st >> proc_name;

    Creación u obtención de procesadores:

        Processor* proc;

        if (processors.count(proc_name) == 0) {

            //Creacion interfaz de red
            NetIface* net_iface = new NetIface(proc_name);
            proc = new Processor(proc_name, CANT_CORES, net_iface, MAX_MEMORY);
            processors[proc_name] = proc;
        } else {
            proc = processors[proc_name];
        }

    Verificación del nivel de replicación:

        assert(replication_level > 0); //No puede haber cero replicas de un nodo

    Creación de nodos Spouts o Bolts y sus réplicas:

        //Estructura del contenedor de Nodos (Spouts y/o Bolts)
        if (node_type == 'S') {
            st >> avg_service_time; //TODO: Spout y Bolt usan AvgServiceTime, modificar y usar solo una variable.
            std::string arrival_rate;
            st >> arrival_rate;     //Tasa de arrivo al spout

            nodes[node_name] = make_pair(vector<Node*>(replication_level), 'S');

            //Creamos el Generator para el/los Spout(s). Spout y replicas usan el mismo Spout.
            handle<Generator> gen;
            gen = new Generator("Generator", generator_id, arrival_rate);
            generators.push_back(gen);
            generator_id++;

            for (int i = 0; i < replication_level; i++) {

                //Creamos al Spout
                Spout* spout = new Spout(node_name, i, replication_level, avg_service_time, grouping_type);
                spout->set_processor(proc);

                //Relacionamos los elementos entre si.
                gen->set_processor(proc);
                gen->add_spout(spout);
                proc->assign_spout(spout);

                //Finalmente guardamos el Spout en el arreglo de nodos
                nodes[node_name].first.at(i) = (Node*)spout;
            }

        Bolt:
        
        } else if (node_type == 'B') {      //Este bloque se ejecuta cuando se encuentra un nodo de tipo Bolt 'B' en el archivo de configuración
            std::string nro_tuplas_output;  //Se leen de la línea actual del archivo los parámetros específicos del nodo Bolt
            st >> nro_tuplas_output;        //Número de tuplas de salida
            st >> avg_service_time;         //Tiempo promedio de servicio

            nodes[node_name] = make_pair(vector<Node*>(replication_level), 'B'); //Se crea una nueva entrada en el mapa 'nodes' para almacenar las replicas del nodo bolt
                                                                                //Se inicializa un vector vacío de tamaño 'replication_level' para almacenar las replicas
            
            //Creación de Replicas
            for (int i = 0; i < replication_level; i++) {

                //Crea un objeto Bolt con los parametros proporcionados
                Bolt* bolt = new Bolt(node_name, i, replication_level, avg_service_time, nro_tuplas_output, grouping_type);

                //Asigna el procesador al Bolt
                bolt->set_processor(proc);

                //Asignamos el Bolt a un procesador
                proc->assign_bolt(bolt);

                //Almacena el puntero al Bolt en la estructura de datos `nodes`
                nodes[node_name].first.at(i) = (Node*)bolt;
            }
        }


Método number_of_processors:

    Función que devuelve el número de procesadores almacenados en el mapa 'processors'

    uint32_t sistema::number_of_processors(){
        return (uint32_t)processors.size();
    }

Método build_topology_from_file:

    Función que carga una topología desde un archivo y establece las conexiones entre los diferentes nodos (Spouts/Bolts)
    Esta topología se carga en un mapa y luego se establecen las conexiones entre réplicas de nodos de origen y destino

    Declaración de la función build_topology_from_file:
        Esta función recibe el archivo que contiene la topología

    void sistema::build_topology_from_file(string filename) {

    Declaración de mapa a cargo de almacenar la topología con nombres de nodos fuente como claves y listas de nombres de nodos destino con valores:
        
        map<string, list<string>> topology;

    Apertura del archivo especificado 'filename' para su lectura:
    
        ifstream fin(filename);
    
        Deglose del código:

            ifstream fin:   Declaración de la variable 'fin'
            filename    :   Nombre del archivo que se va a abrir

    Verifica que el archivo se haya abierto correctamente:

        assert(fin.is_open());

    Declaración de variables para almacenar cada línea leída del archivo y los nombres de los nodos fuente y destino:

        string linea, source, target;
  
    Lectura de cada línea del archivo hasta que el final del archivo:
    
        while (getline(fin, linea)) {
            if (linea.at(0) == '#') {   // Si la línea comienza con '#', se considera un comentario y se omite
            continue;
        }
        
    Conversión de la línea en un flujo de cadena para extraer los datos:

        stringstream st(linea);
    
    Extracción de datos:

        st >> source; // Extrae el nombre del nodo fuente
        st >> target; // Extrae el nombre del nodo destino
     
    Añade el nodo destino a la lista de nodos destino del nodo fuente en el mapa 'topology':

            topology[source].push_back(target);

    Iteraciones de tipo for:

        for (auto iter_topology_sources : topology) {                           // Itera sobre cada par (nodo fuente, lista de nodos destino) en el mapa 'topology'
            for (auto iter_topology_targets : iter_topology_sources.second) {   // Itera sobre cada nodo destino en la lista de nodos destino del nodo fuente actual
                source = iter_topology_sources.first;                           // Almacena el nombre del nodo fuente
      
                for (auto iter_nodes_source : nodes[source].first) {    // Itera sobre cada réplica del nodo fuente
                    target = iter_topology_targets;                     // Almacena el nombre del nodo destino
        
                    for (auto iter_nodes_targets : nodes[target].first) {               // Itera sobre cada réplica del nodo destino
                        ((Node*)(iter_nodes_source))->add_node(iter_nodes_targets);     // Añade una referencia al nodo destino en el nodo fuente
                    }
                }
            }
        }

    Limpieza del mapa 'topology' ya que no se necesita más:

        topology.clear();