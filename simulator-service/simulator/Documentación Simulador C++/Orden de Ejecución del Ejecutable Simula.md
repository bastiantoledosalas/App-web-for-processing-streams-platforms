Orden de Ejecución del Ejecutable Simulador:

La ejecución del ejecutable Simulador se realiza tomando en cuenta el siguiente comando con el cual se ejecuto el simulador:

    ./Simulador -t topology.dat -n nodes.dat -p 1 -l 1000 -r generator_rates.dat > salida.dat

    Lo primero que se debe tomar en cuenta es que hay una variable fija que tiene un valor prefijado:

        double simulation_time = 1000e100
    
    Se asigna además el valor a la variable 'topology_file' que proviene desde el parametro '-t topology.dat':

        topology_file = topology.dat
    
    Se asigna otro valor a la variable 'nodes_file' que proviene desde el parametro '-n nodes.dat':

        nodes_file = nodes.dat
    
    Se asigna otro valor a la variable 'simulation_time' que proviene desde el parametro '-l 1000':

        simulation_time = 1000
    
    Se asigna un valor a la variable 'arrival_rate_file' que proviene desde el parametro '-r generator_rates.dat':

        arriva_rate_file = generator_rates.dat
    
        Esto se utiliza Para el caso en que la tasa de arribo debe variar durante la simulacion.

    Se asigna otro valor a la variable 'qty_tuples' que viene desde el parametro '-p 1':

        qty_tuples = 1
    
    Una vez asignados todos los valores pasados por parametros al simulador se procede a lo siguiente:

        -Se obtiene la instancia única de la clase 'simulation'
        -Se crea un nuevo Objeto 'sqsDll'
        -Se inicia la simulación pasando este nuevo objeto a la función 'begin_simulation'
        -Se declara una variable 'sis' que utiliza el patrón de diseño conocido como puntero inteligente:
            
            handle<sistema> sis

    Posterior a esta declaración se hará lo siguiente:

        -Dependiendo de SI el ARCHIVO 'TASAS DE ARRIBO' (arrival_rate_file) ha sido ingresado como parametro o no se inicializara un objeto sistema con un constructor especifico:
        
        if(aflag == 0 )
            sis = new sistema("System main", simulation_time, qty_tuples, topology_file, nodes_file);
        else
            sis = new sistema("System main", simulation_time, qty_tuples, topology_file, nodes_file, arrival_rate_file);
    
    -En este caso como se ingreso el archivo de tasa de arribo al momento de ejecutar el simulador, se seleccionará la opción 'else':

    -Se crea un nuevo objeto 'sis' que es de tipo 'Sistema' y se llama al constructor de esta clase sistema con los valores recolectados con anterioridad:
    
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

    Por tanto el objeto 'sis' de tipo 'sistema' quedaria de la siguiente forma:

        -process(_name) indica que la clase 'sistema' hereda de la clase base 'process' y esta inicializando el constructor de la clase base con "System Main"

        -Objeto sis:

            _simulation_time    = 1000;
            _qty_tuples         = 1;
            _topology_file      = topology.dat
            _nodes_file         = nodes.dat
            _arrival_rate_file  = generator_rates.dat
    
    El objeto 'sis' es manejado por un controlador de simulación que se encarga de iniciar el proceso de simulación
    En el ciclo de simulación se ejecuta el MÉTODO inner_body y que ejecuta en paralelo las siguiente funciones:
        
        build_fat_tree( );
        load_nodes_from_file( _nodes_file );
        Generator::set_max_tuples( _qty_tuples );
        build_topology_from_file( _topology_file );
        connectSwitchesAndNodes( );
    
        Deglosamos entonces cada función correspondiente:

            build_fat_tree():

            Este método construye tablas de ruteo de acuerdo a paper "A Scalable, Commodity Data Center Network Architecture", de esta forma se construye un esquema de redes y conexiones importantes para comunicar procesadores entre sí a traves de Switches. Se definen una serie de parámetros para el diseño de una red tipo 'fat tree':

            -Aqui se obtiene el número de procesadores o nodos en el sistema. Este valor se usa para calcular otras métricas:

                uint32_t n_procs = number_of_processor();

            -Definición del parámetro 'K' que es una constante para la construcción del 'fat tree'. El valor 'K' podría ser ajustable dependiendo de la red específica que se este construyendo, en este caso se utiliza como valor constante '4':

                uint32_t K = 4;

            -Calcula el número de switches de núcleo 'core switches' en el 'fat tree'. El número de switches de núcles es (K/2)^2:

                uint32_t cant_core_sw = pow((K/2),2);

                Por lo tanto el valor seria:
                    uint32_t cant_core_sw = 4

            -Calcula el número de switches de agregación 'aggregation switches'. El número de switches de agregación es (K/2)*K:

                uint32_t cant_aggr_sw = (K/2)*K;

                Por lo tanto el valor seria:
                     uint32_t cant_aggr_sw = 8
            
            -Calcula el número de switches de borde 'edge switches'. El número de switches de borde es (K/2)*K:

                uint32_t cant_edge_sw = (K/2) *K;
                
                Por lo tanto el valor seria:
                    uint32_t cant_edge_sw = 8

            -Calcula el npumero de pods en la red. El número de pods es igual a K:

                uint32_t cant_pods = K;

                Por lo tanto el valor seria:
                    uint32_t cant_pods = 4
            
            -Calcula el número total de hosts. El número total de hosts en un "fat tree" es (K/2)^2 * K:
                
                uint32_t cant_hosts = pow((K / 2), 2) * K;

                Por lo tanto el valor seria:
                     uint32_t cant_hosts = 16
            
            -Calcula el número de hosts por pod. En un "fat tree", el número de hosts por pod es (K/2)^2:

                uint32_t cant_hosts_pod = pow((K / 2), 2);

                Por lo tanto el valor seria:
                    uint32_t cant_hosts_pod = 4
            
            NOTA IMPORTANTE: SI SE DESEARA CONFIGURAR EL VALOR DE K Y QUE NO FUESE UN VALOR FIJO COMO EN ESTE CASO 'K=4' HABRIA QUE DESCOMENTAR LA LINEA 174 de main.cc 'calculate_k( n_procs )' para que el método se encargue de calcular automaticamente cuantos K son necesarios para construir el 'fat tree'

            Una vez inicializados todos estos valores se procede a construir el Fat-Tree:

                -Existe un primer bucle for para Crear Switches de cada POD:

                    -El bucle recorre cada POD en la red. La variable current_pod toma valores desde 0 hasta K-1 (4-1=3)
                
                -Existe un segundo bucle for para la Capa Inferior de Siwitches POD(Edge Switches):

                    -El segundo bucle recorre los switches de la capa inferior (Edge Switches) en el POD actual
                    -La variable current_sw toma valores desde 0 hasta K/2 - 1 (4/2 -1 = 1)
                    -Se crea una dirección IP para un switch:

                        string sw_ip = "10." + std::to_string( current_pod ) + "." + std::to_string( current_sw ) + ".1";

                        Deglose Detallado:
                            "10." =                         Prefijo fijo de la dirección IP que se almacenará en sw_ip
                            std::to_string( current_pod ):  Convierte el índice del POD (current_pod) a una cadena 
                                                            y lo inserta en la dirección IP
                            std::to_string( current_sw ):   Convierte el índice del switch (current_sw) a una cadena 
                                                            y lo inserta en la dirección IP
                            ".1" =                          Sufijo fijo de la dirección IP, que generalmente indica que es el 
                                                            primer IP asignado en esa subred para el switch
                        La primera vez sw_ip quedaria de la siguiente forma:

                        string sw_ip = "10.0.0.1"    Puesto que current_pod y current_sw tiene valor 0 al inicio
                    
                    -Dentro de este segundo bucle se crea una instancia de 'CommSwitch' y la almacena en el mapa 'comm_switches' utilizando 'sw_ip' como clave:

                        comm_switches[ sw_ip ] = new CommSwitch("SW:" + sw_ip, K, sw_ip, CommSwitch::SW_EDGE );
                        
                        Deglose:
                            SW:" + sw_ip:           Construye el nombre del switch, prefijado con "SW:"
                                                    Por ejemplo, si sw_ip es "10.0.0.1", el nombre del switch será "SW:10.0.0.1"
                            K           :           Pasa el parametro K al constructor de 'CommSwitch'
                            sw_ip:                  Pasa la dirección IP del switch como un parámetro al constructor.
                                                    Esto identifica de manera única al switch en la red
                            CommSwitch::SW_EDGE:    Pasa el tipo de switch como un parámetro

                        El constructor publico de CommSwitch es de la siguiente forma:

                            CommSwitch( const string& name, 
                                        const uint32_t& K,
                                        const string& ip,
                                        const CommSwitch::comm_switch_types& comm_sw_type
                                        ): process( name ){
                                    _IP = ip;
                                    _comm_switch_state = CommSwitch::COMM_SWITCH_IDLE;
                                    _K = K;
                                    std::vector<string> ipParts =(Utilities::tokenizeString( _IP ));
                                    _pod = std::stoi(ipParts[1]); //pod
                                    _sw = std::stoi(ipParts[2]);  //sw
                                    _comm_switch_type  = comm_sw_type;
                                    createRoutingTables( );
                                    }
                        
                        Por tanto la nueva instancia de CommSwitch quedaria de la siguiente forma:

                            Instancia nueva de CommSwitch:

                                _IP = "10.0.0.1";
                                _comm_switch_sate = CommSwitch::COMM_SWITCH_IDLE
                                _K = 4
                                std::vector<string> ipParts = Utilities::tokenizeString("10.0.0.1");
                                _pod = "0"; (std::stoi(ipParts[1]))
                                _sw  = "0"; (std::stoi(ipParts[2]))
                                _comm_switch_type = CommSwitch::SW_EDGE

                                Finalmente se llamaria a la función createRoutingTables()

                                CABE DESTACAR QUE TAMBIÉN SE ESTARIA CREAMDO UN NUEVO OBJETO DE LA CLASE process Y PASANDOLE AL CONSTRUCTOR EL NOMBRE: "SW:10.0.0.1"


                                createRoutingTable() tiene la siguiente forma:

                                    void CommSwitch::createRoutingTables( ){
                                        createPreffixRoutingTable( );
                                        createSuffixRoutingTable( );}
                                    
                                    Analicemos createPreffixRoutingTable():

                                    void CommSwitch::createPreffixRoutingTable( ){
                                        switch( _comm_switch_type ){
                                        case SW_CORE:
                                            for( uint32_t pod = 0; pod < _K; pod++ ){
                                                _preffix_routing_table[ pod ] = pod/*output port*/; //I.e: IP=10.2.0.1 -> Port=2;
                                                }
                                            break;
                                        case SW_AGGREGATION:
                                            for( uint32_t subnet /*SW al que estan conectados los hosts*/ = 0; subnet < ( _K / 2 ); subnet++){
                                                _preffix_routing_table[ subnet ] = subnet; //I.e: IP=10.2.0.x -> Port=0; IP=10.2.1.x -> Port=1
                                                    }
                                            break;
                                        case SW_EDGE:
                                            for( uint32_t i = 0; i < ( _K / 2 ); i++ ){
                                                _preffix_routing_table[ i + 2 /*10.pod.switch.(i+2)*/] = i /*output port*/;
                                            }
                                            break;
                                    }
                                }

                                Como este SWITCH ES  CommSwitch::SW_EDGE entra el case SW_EDGE y ejecuta el ciclo for desde 0 hasta 2 (4/2=2) ejecutando 2 veces (para i=0 e i=1) y los resultados del Bucle for son:

                                    Con i = 0:
                                        _preffix_routing_table[2] = 0;
                                    Con i = 1:
                                        _preffix_routing_table[3] = 1
                                    
                                    Los valores de _preffix_routing_table en los indices 2 y 3 se actualizan respectivamente.
                                    
                                    Ahora se llama al método createSuffixRoutingTable():

                                        void CommSwitch::createSuffixRoutingTable( ){
                                        switch( _comm_switch_type ){
                                            case SW_CORE:
                                            //No utiliza
                                            break;
                                            case SW_EDGE:
                                                for( uint32_t i = 2; i <= ( _K / 2 ) + 1; i++ ){
                                                _suffix_routing_table[ i ] = ( (i - 2 + _sw ) % ( _K / 2 ) ) + ( _K / 2 );
                                                }
                                            break;
                                            case SW_AGGREGATION:
                                                for( uint32_t i = 2; i <= ( _K / 2 ) + 1; i++ ){
                                                _suffix_routing_table[ i ] = ( (i - 2 + _sw ) % ( _K / 2 ) ) + ( _K / 2 );
                                                }
                                            break;
                                        }
                                    }
                                    Al igual que en el caso anterior se entra en el case SW_EDGE y se ejecuta el ciclo desde 2 hasta 3 (4/2 + 1) ejecutando 2 veces (para i =2 e i =3) y los resultados del Bucle for son:

                                    con i = 2 y _sw=0:
                                        _suffix_routing_table[2] = (0 % 2) + 2 = 0 + 2 = 2

                                    con i = 3:
                                        _suffix_routing_table[3] = (1 % 2) + 2 = 1 + 2 = 3

                                    Los resultados dependen del valor de la variable _sw.
                                     Los valores de _suffix_routing_table en los indices 2 y 3 se actualizan respectivamente.

                        -Una vez se realiza todo este proceso engorroso se llama a:

                            comm_switches[ sw_ip ]->IP( sw_ip );
                        
                            -el mapa comm_switches utiliza 'sw_ip ="10.0.0.1" en este caso como clave para acceder a la instancia creada de CommSwitch
                            -comm_switches[sw_ip] obtiene el puntero al objeto CommSwitch correspondiente a la clave sw_ip
                            -->IP(sw_ip) aqui se llama al método IP del objeto CommSwitch que devuelve "10.0.0.1"

                    -El tercer bucle for se utiliza para establecer la conexión entre SW EDGE con SW AGGREGATION:

                        -Este bucle recorre los Switches de nivel Aggregation y 'upper_sw' toma valores desde K/2 (4/2=2) hasta K-1 (4-1 =3)
                        -Aqui se generan IPs de Switches de Agregación:
                                string remote_sw_ip = "10." + std::to_string(current_pod) + "." + std::to_string(upper_sw) + ".1";

                                Por lo tanto su valor seria:
                                    string remote_sw_ip = "10.0.2.1

                                    Deglose de valores de la variable remote_sw_ip:
                                        -el Primer 10 es un valor fijo
                                        -El segundo valor es 0 puesto que el valor de current_pod la primera vez es 0 y luego aumenta en el for
                                        -el tercer valor es 2 puesto que upper_sw = 2 la primera vez (4/2=2) y luego aumenta en el for
                                        -el cuarto valor es 1 puesto que es un valor fijo al igual que el primero

                        -Dentro de este tercer bucle se gestionan las conexiones entre Switches tipo 'EDGE' y 'AGGREGATION' en una red de tipo Fat-Tree:

                            -Primero se verifica si ya existe un Switch en el mapa 'comm_switches' con la clave 'remote_sw_ip'
                            -De no existir entra en la condicional (if (comm_switches.count(remote_sw_ip) == 0)) y se crea un nuevo Switch de tipo CommSwitch::SW_AGGREGATION y se asigna a la clave 'remote_sw_ip'
                            -Una vez que el Switch de Agregación es creado o verificado, se asegura que su IP esté configurada correctamente con 'remote_sw_ip':
                                comm_switches[remote_sw_ip]->IP(remote_sw_ip);

                            -Ahora se establece la conexión entre Switches EDGE y AGGREGATION:

                                comm_switches[ sw_ip ]->connectToCommSwitch( upper_sw/*current_sw*/, comm_switches[ remote_sw_ip ] );

                                -Aqui se establece una conexión lógica en la red, permitiendo que los paquetes se transmitan desde el Switch Edge al de Aggregation
                            
                            -Ahora se realiza la conexión inversa, donde el Switch de Aggregation se conecta al Switch de Edge en el puerto 'current_sw':

                                comm_switches[remote_sw_ip]->connectToCommSwitch(current_sw, comm_switches[sw_ip]);

                                -La conexión inversa es necesaria para que el tráfico pueda fluir en ambas direcciones, desde Aggregation hacia Edge y viceversa

                    -Una vez se ejecutan todos los bucles for ahora se pasa a construir Switches Core:

                        -Aqui se construye la capa central 'Core' de un árbol de interconexión de tipo Fat-Tree y establece conexiones entre Switches Core y Switches Aggregation en cada pod

                        -Tenemos 2 bucles anidados uno dentro de otro basados en el valor de K:

                            for (uint32_t i = 1; i <= (K/2); i++)
                                for (uint32_t j = 1; j <= (K/2); j++)

                            -Dentro del segundo bucle se le asigna a la variable sw_ip direcciones IP basadas en lo siguiente:

                                -El primer valor corresponde a un valor fijo "10."
                                -El segundo valor corresponde a la variable K QUE DETERMINA EL TAMAÑO DE LA RED (normalmente 4 en un Fat-Tree)
                                -El tercer valor corresponde a la variable i del primer bucle for iniciando por un valor '1' e ira aumentando en 1 su valor
                                -El cuarto valor corresponde a la variable j del segundo bucle for iniciando por un valor '1' e ira aumentando en 1 su valor

                                Ahora se utiliza la variable sw_ip para crear un nuevo objeto CommSwitch repitiendo el proceso explicado en la línea nro 177 de este documento
                                La diferencia con este proceso es que al momento de entrar en el proceso explicado en la línea nro 216 es que al entrar en los métodos de creaciónde tablas: 
                                    -createPreffixRoutingTable()
                                    -createSuffixRoutingTable()
                                    -Aquí se escogen el case case SW_CORE
                                Luego de todo este proceso este nuevo Objeto CommSwitch se almacena este nuevo Switch Core y se almacena en el mapa 'comm_switches'
                                
                                Una vez se realiza todo este proceso engorroso se llama a:

                                    comm_switches[ sw_ip ]->IP( sw_ip );

                                    -el mapa comm_switches utiliza 'sw_ip ="10.4.1.1" en este caso como clave para acceder a la instancia creada de CommSwitch
                                
                                Dentro de este segundo bucle tenemos un Bucle Interno que es de conexión de Switches Core con Switches de Agregación:
                                    
                                    for (uint32_t current_pod = 0; current_pod < K; current_pod++) {
                                        string aggregation_ip = "10." + std::to_string(current_pod) + "." + std::to_string((K/2)+(i-1)) + ".1";
                                        // Conecta Core con Aggregation
                                        comm_switches[sw_ip]->connectToCommSwitch(current_pod, comm_switches[aggregation_ip]);
                                        // Conecta Aggregation con Core
                                        comm_switches[aggregation_ip]->connectToCommSwitch((K/2) + (j-1), comm_switches[sw_ip]);

                                Aquí se asegura de que el tráfico pueda ser dirigido de manera eficiente entre los distintos nodos de la red
                                Proporcionando una alta capacidad de interconexión y redundancia
                                Cada Switch Core se conecta a un Switch de Agregación en todos los pods
                                Mientras que cada switch de agregación está conectado de vuelta al switch Core correspondiente
                                Creando una malla de interconexiones que permite un flujo de datos robusto y flexible en la red


            Método load_nodes_from_file (_nodes_file):

            -Esta función se encargará de leer el archivo nodes.dat
            -Descompone cada una de las lineas del archivo y asignar valores dependiendo de los Spouts o Bolts que aparezcan
            -Aquí se diferencia entre un Bolt y un Spout por el valor de tipo char 'S' o 'B' presente en el archivo nodes.dat
            -Se crean nuevos procesadores en caso de no existir con sus respectivas interfaces de red, número de nucleos o 'Cores', tamaño de memoria RAM, IPS y otros datos
            -Además de crear generadores o Generator para el/los Spout(s). Spout y replicas usan el mismo Spout
            -Se crean nuevos objetos SPOUT o BOLT y son guardados en arreglos, mapas o listas para sus posteriores accesos y asignación o comunicación
            
                IMPORTANTE RECALCAR LA IMPORTANCIA QUE TIENE ESTE PROCESO, PUESTO QUE AQUI ES DONDE SE CREAN LOS PROCESADORES Y ESTO SE REALIZA DE LA SIGUIENTE FORMA:

                    st >> proc_name;
                    Processor *proc;
                    if( processors.count(proc_name) == 0 ){
                        //Creacion interface de red
                        NetIface *net_iface = new NetIface( proc_name );
                        proc = new Processor( proc_name, CANT_CORES, net_iface, /*memory size*/ MAX_MEMORY );
                        processors[ proc_name ] = proc;
                    }else
                    proc = processors[ proc_name ];

                -Aquí se lee un nombre de procesador 'proc_name' a partir del archivo nodes.dat correspondiente a valores IP como por ejemplo "10.0.0.1"
                -Luego se declara el puntero 'proc' que se utilizará para apuntar a un objeto 'Processor'
                -Luego se verifica la existencia del Procesador en el Mapa:
                    
                    -Se utiliza 'processor.count(proc_name) para comprobar si un procesador con el nombre 'proc_name' ya existe en el mapa 'processors'
                    -En caso de no existir este procesador en el mapa 'processors' se crea una nueva interfaz de red NetIface asociada al proc_name
                    -Luego se crea un nuevo objeto Processor utilizando el nombre del procesador 'proc_name'(por ejemplo: "10.0.0.1"), la cantidad de núcles(por defecto 32),
                     la interfaz de red recién creada 'net_iface' y un tamaño maximo de memoria 'MAX_MEMORY'(por defecto 100000000000)
                    -Se guarda el puntero al nuevo objeto Processor en el mapa 'processors', usando 'proc_name' como clave
                    -En caso de existir se recupera el punteroa l procesador existente del mapa 'processors' y es asignado a la variable 'proc'

                assert( replication_level > 0 );//No puede haber cero replicas de un nodo
                
                EN ESTA LÍNEA DE CODIGO TENEMOS UNA RESTRICCIÓN IMPORTANTE DEL ARCHIVO nodes.dat Y ES QUE EN EL PARAMETRO DE REPLICAS DE UN NODO NO PUEDEN EXISTIR VALORES IGUAL A 0, DEBEN SER OBLIGATORIAMENTE VALORES MAYORES A 0 INDEPENDIENTEMENTE SI SON SPOUTS O BOLTS

                -Luego de realizar la comprobación de que los valores para la cantidad de replicas de un nodo sea mayor a 0, se procede a realizar el procesamiento de Nodos Spouts o Bolts:

                    -Si el valor del char presente en el archivo nodes.dat corresponde a 'S' se procede a leer el valor siguiente despues del valor correspondiente a la IP:
                        Ejemplo:

                            KafkaSpout                     S   10   0   10.0.0.2   fixed(0.0)                  fixed(1.0)
                            
                            En este caso se estaría realizando el siguiente proceso luego de haber validado que KafkaSpout corresponde a un Nodo Spout:
                                avg_service_time = fixed(0.0)   Aqui se lee el average service time que es el valor que va despues de especificar la IP del Procesador
                                arrival_rate = fixed(1.0)       Aqui se lee la tasa de arribo al Spout y se asigna a la variable arrival_rate

                    -Luego se inicializa un par 'pair' que se almacenará en el mapa 'nodes' bajo la clave 'node_name':

                        nodes[node_name]        'nodes' es un mapa que alamcena pares de valores, donde la clave es el nombre del nodo 'node_name'
                        make_pair(...)          función de utilidad que crea un objeto 'std::pair' a partir de dos valores:

                            Primer Valor: vector<Node*>(replication_level)  Aqui se crea un vector de punteros a 'Node' (vector<Node*>)
                                                                            replication_level define la cantidad de réplicas del nodos
                                                                            Todos los elementos del vector se inicializan en 'nullptr' ya que no se están creando instancias de Node
                                                                            Solo se reserva espacio en el vector
                            Segundo Valor:  S                               Caracter que indica el tipo de nodo, en este caso 'S' para Spout
                    
                    -Una vez se ejecuta este proceso, el mapa 'nodes' contendrá una nueva entrada deonde la clave es 'node_name'
                    -Ahora se crea y gestionan los Generadores 'Generator' que serán utilizadas por uno o más nodos de tipo Spout y sus réplicas:

                        handle<Generator> gen;      Indica un puntero o puntero inteligente a un objeto de tipo Generator
                        gen = new Generator ("Generator", generator_id, arrival_rate);    Aqui se instancia un nuevo objeto de la clase 'Generator' utilizando el operador new y el constructor correspondiente:


                            'gen' Objeto de tipo Generator:
                                    this->_arrival_rate = fixed(1.0);   Aqui el nuevo objeto Generator toma el valor de tasa de arribo del Spout
                                    this->_rep_id = 0                   En este caso el _rep_id sera igual a la variable generator_id que comienza con valor 0 
                                    this->_generator_id = Generator_0   Aqui se concatena el nombre del proceso Generator + el valor de _rep_id
                        
                        -Luego de realizado este proceso se utiliza push_back(gen) para agregar el objeto 'gen' al final de la colección 'generators', por tanto se construye una lista de generadores que podrán ser utilizados por diferentes nodos Spout en el sistema.
                        -Se aumenta el valor de la variable generator_id en 1 valor
                    
                    -Luego se inicia un bucle for que inicia con un valor 0 hasta que se rompa el ciclor for (i<replication_level),esto quiere decir que se crearán una serie de Objetos Spouts dependiendo del valor que tenga la variable replication_level leida del archivo nodes.dat:

                        Spout *spout = new Spout(node_name, i/*id rep*/, replication_level, avg_service_time, grouping_type):

                            Un ejemplo de un nuevo objeto Spout seria el siguiente:

                                Objeto Spout:
                                    this->_node_state = NODE_IDLE

                                Como bien sabemos Este objeto Spout hereda de Node y este objeto también es creado a traves del constructor Spout es llamado:

                                    Node( name, Node::SPOUT, id, rep_level, avg_service_time, stream_grouping ):

                                Objeto Node:
                                    this->_rep_id = 0                   Este valor cambia puesto que es el valor con el cual se mueve el bucle for
                                    this->_rep_level= 10                Este valor corresponde al valor almacenado perteneciente al archivo de texto nodes.dat
                                    this->_stream_grouping= 0           Aqui se especifica el valor del tipo de stream grouping
                                    _name = KafkaSpout                  Nombre del Spout procedente del archivo de texto nodes.dat      
                                    _node_id = KafkaSpout_0             Concatenación del nombre + el _rep_id
                                    this->_avg_service_time=fixed(0.0)  Valor leido desde el archivo nodes.dat
                                    this->_node_type = Node::SPOUT      Valor predefinido 'Node::SPOUT'

                        -El Spout recién creado se asigna al 'Processor' (proc), lo que significa que este procesador será responsable de ejecutar las operaciones del Spout
                        -El procesador 'proc' es especificado en la linea nro 387
                        -Ahora el generador 'Generator' se vincula con el mismo procesador 'proc':

                            gen->set_processor(proc):
                                y aqui se llama a este método que realiza lo siguiente:

                                this->_processor = proc;
                                donde _processor es definido como:
                                         Processor *_processor

                        -El Spout recién creado se agrega al 'Generator', permitiendo que el 'Generator' maneje la producción de datos para este 'Spout':

                                gen->add_spout(spout);
                                y aqui se llama a este método que realiza lo siguiente:

                                this->_spout_list.push_back( spout );
                                donde _spout_list es definido como:
                                        std::list<Spout *> _spout_list;     //Spout al que se le generan eventos de arribo/procesamiento de streams
                                        
                        -El Spout recién creado es asignado al 'Processor', indicando que este procesador ejecutará las tareas de este Spout:

                                proc->assign_spout(spout);
                                y aqui se llama a este método que realiza lo siguiente:
                                
                                this->malloc( /*Spout size*/ 100 );
                                this->_spouts[ (spout)->to_string() ] = spout;

                                donde malloc(100) y realiza lo siguiente:
                                    bool free_space = this->_ram_memory.malloc( 100 ); //100 bytes de memoria
                                    assert ( free_space );
                                
                                donde RamMemory _ram_memory; esto esta definido en la clase processor.h

                                Ahora _spouts[(spout)->to_string()] = spout;

                                donde to_string realiza lo siguiente:
                                    return this->_node_id; Este valor corresponde al valor de la clase Node de la cual hereda Spout
                                
                                donde _spouts[(spouts)] realiza lo siguiente:
                                    //Spouts alojados en el procesador
                                    std::map<std::string,Spout *> _spouts;
                        
                        -Finalmente guardamos el Spout en el arreglo de nodos
                                nodes[ node_name ].first.at(i)=(Node*)spout;

                    -Una vez que se termina el bucle for procedemos a realizar el procedimiento en caso de encontrar en el archivo nodes.dat un caracter 'B' correspondiente a un Bolt:

                         -Si el valor del char presente en el archivo nodes.dat corresponde a 'S' se procede a leer el valor siguiente despues del valor correspondiente a la IP:
                            
                            Ejemplo:

                            TwitterFilter                  B   10   0   10.2.0.2   fixed(0.0)  fixed(1.0)

                            En este caso se estaría realizando el siguiente proceso luego de haber validado que TwitterFilter corresponde a un Nodo Bolt:

                                nro_tuplas_output = fixed(0.0)
                                avg_service_time =  fixed(1.0)
                        
                        -Se repetira el proceso declarado en la línea nro 422, cambiando obviamente el char value de 'S' por 'B' pero el proceso el exactamente el mismo
                        
                        -Luego se inicia un bucle for que inicia con un valor 0 hasta que se rompa el ciclor for (i<replication_level),esto quiere decir que se crearán una serie de Objetos BOLT dependiendo del valor que tenga la variable replication_level leida del archivo nodes.dat:

                            Bolt *bolt = new Bolt(node_name, i/*id replica*/, replication_level, avg_service_time, nro_tuplas_output, grouping_type );

                            -Un ejemplo de un nuevo objeto Bolt seria el siguiente:

                                this->_node_state = NODE_IDLE;
                                this->_nbr_output_tuples = fixed(0.0);  //_nbr_output_tuples = nro_tuplas_output

                            Como bien sabemos Este objeto Bolt hereda de Node y este objeto también es creado a traves del constructor Bolt es llamado:

                                Node( node_name, Node::BOLT, i, replication_level, avg_service_time, grouping_type )

                            Objeto Node:
                                this->_rep_id = 0;                      Este valor cambia puesto que es el valor con el cual se mueve el bucle for
                                this->_rep_level = 10;                  Este valor corresponde al valor almacenado perteneciente al archivo de texto nodes.dat
                                this->_stream_grouping = 0;             Aqui se especifica el valor del tipo de stream grouping
                                _name = TwitterFilter;                  Nombre del Bolt procedente del archivo de texto nodes.dat      
                                this->_node_id = TwitterFilter_0;       Concatenación del nombre + el _rep_id
                                this->_avg_service_time = fixed(1.0);   Valor leido desde el archivo nodes.dat
                                this->_node_type = Node::BOLT;          Valor predefinido 'Node::BOLT'

                        -El Bolt recién creado se asigna al 'Processor' (proc), lo que significa que este procesador será responsable de ejecutar las operaciones del Bolt
                        -El procesador 'proc' es especificado en la linea nro 387
                        -A diferencia de un Spout, los Bolts no utilizan GENERADORES sino más bien dependen de PROCESADORES para realizar dichas operaciones, ahora se asigna el Bolt creado a un Procesador:

                            proc->assign_bolt( bolt );
                            y aqui se llama al método que realiza lo siguiente:
                                this->malloc( /*bolt->_memory_size*/ 100 );
                                this->_bolts[ bolt->to_string() ] = bolt;
                                
                                donde malloc(100) realiza lo siguiente:
                                    bool free_space = this->_ram_memory.malloc( 100 ); //100 bytes de memoria
                                    assert ( free_space );
                    
                                donde RamMemory _ram_memory; esto esta definido en la clase processor.h
                                Ahora this->_bolts[bolt->to_string()] = bolt;

                                    donde to_string() realiza lo siguiente:
                                        return this->_node_id;                  Este valor corresponde al valor de la clase Node de la cual hereda Bolt

                                donde _bolts[(bolt)] realiza lo siguiente:
                                    std::map<std::string,Bolt *> _bolts;        //Bolts alojados en el procesador

                            -Finalmente se asigna la instancia de un 'Bolt' que esta almacenado en 'bolt' a la posición 'i' del vector de réplicas del nodo 'node_name en el mapa 'nodes'. Al hacer un 'type casting' a 'Node*' el codigo se asugra que el vector pueda almacenar punteros a 'Bolt':
                                    nodes[ node_name ].first.at(i)=(Node*)bolt;

            Método  Generator::set_max_tuples( _qty_tuples ):

            En esta función se define la cantidad maxima de tuplas a generar (entre todos los generadores) basada en el valor entregado por parametro '-p 1':

                    ./Simulador -t topology.dat -n nodes.dat -p 1 -l 1000 -r generator_rates.dat > salida.dat

            Se llama la función set_max_tuples del objeto Generator y se cambia el siguiente valor:

                Generator::_max_tuples = 1;

                donde _max_tuples se define de la siguiente forma:
                    static uint32_t _max_tuples;
            
            Método build_topology_from_file( _topology_file ):

            Esta función toma como parametro el archivo topology.dat y se encarga de leer el archivo linea por linea e ir deglosando la información
            Define la topologia sin considerar nivel de replicacion, se utiliza luego para conectar nodos
            
            Toma el primer valor y lo guarda en la variable 'source' y el segundo valor en la variable 'target'

                Ejemplo: KafkaSpout        TwitterFilter

                source = KafkaSpout
                target = TwitterFilter

            Luego en el mapa definido con anterioridad llamado 'topology' ( map<string, list<string>> topology) realiza la siguiente acción:

                topology[ source ].push_back( target )

                donde:
                        source              Es la clave del mapa 'topology' representando un nodo en el grafo
                        push_back(target)   Añade el 'target' al final del vector o lista asociado con el 'source' en 'topology'
                                            Esto significa que desde el nodo 'source' hay una arista que lo conecta al nodo 'target'

                A modo de ejemplo:

                    topology[ KafkaSpout ].push_back( TwitterFilter )
                
                Ahora se comienza el proceso de establecer conexiones entre todas las réplicas de nodos fuente 'Source' y destino 'Target' en una topología de red representada por un grafo dirigido:

                    Se comienza con un ciclo 'for' en el cual cada iteración de este ciclo proporciona una copia de un par 'clave-valor' del mapa 'topology':

                        for( auto iter_topology_sources : topology):

                            En cada iteración 'iter_topology_sources' toma el valor de un par clave-valor del mapa 'topology'

                            -Dentro de este ciclo for encontramos un segundo ciclo 'for' que itera sobre una lista 'std::list' de nodos destino dentro de la topología:

                                for( auto iter_topology_targets : iter_topology_sources.second /*list<Target_node_names>*/)
                                
                                    En cada iteración 'iter_topology_targets' tomará el valor de un elemento en la lista 'iter_topology_sources.second'. Esto significa que en cada ciclo:

                                        iter_topology_targets será un nombre de nodo 'target' que está conectado al nodo 'source' correspondiente a 'iter_topology_sources.first'

                                    -Dentro del segundo ciclo for se realiza la siguiente operación:
                                    
                                        source = iter_topology_sources.first;   //Aqui se extrae la clave clave-valor en el mapa 'topology'
                                                                                //'source' se le asigna el valor de 'iter_topology_sources.first' donde ahora source contendrá el nombre del nodo 'source' actual en la topología

                                    -Luego encontramos un tercer ciclo for que se encarga de iterar sobre las réplicas de un nodo 'Source' especifico en la estructura de datos 'nodes':

                                        for( auto iter_nodes_source : nodes[source].first)  Se accede al valor asociado con la clave 'source' en el mapa 'nodes' y los punteros de todas las replicas del nodo 'source'

                                        -Dentro de este ciclo se asigna el valor actual de 'iter_topology_targets' a la variable 'target':

                                            target = iter_topology_targets;

                                                donde:
                                                    iter_topology_targets       Iterador que recorre la lista de 'targets' asociados a un 'source' en la topología
                                        
                                        -Dentro de este bucle for encontramos un cuarto bucle for:

                                            for( auto iter_nodes_targets : nodes[target].first )
                                            
                                                -Este bucle permite iterar sobre todas las réplicas del nodo objetivo (target) que están almacenadas en el vector nodes[target].first
                                                -Finalmente dentro de todos estos bucles se realiza una llamada a un método en un objeto 'Node' que establece una conexión entre nodos source y targets:

                                                    ((Node*)(iter_nodes_source))->add_node(iter_nodes_targets);

                                                    donde:
                                                        (Node*)(iter_nodes_source)  es un iterador que apunta a un puntero de tipo Node*
                                                        add_node(iter_nodes_targets) realiza lo siguiente:

                                                            this->_node_map_list[ _node->name( ) ].push_back( _node );
                                                            this->_node_map_vector[ _node->name( ) ].push_back( _node );
                                            
                                                            En base al valor que toma como parámetro, quedaria de la siguiente forma este metodo:

                                                            this->_node_map_list[iter_nodes_targets->name( ) ].push_back( iter_nodes_targets );     
                                                            //Agrega el nodo 'iter_nodes_targets' a la lista correspondiente a su nombre (name()) en el mapa '_node_map_list'

                                                            this->_node_map_vector[ iter_nodes_targets->name( ) ].push_back( iter_nodes_targets );
                                                            //Agrega el nodo 'iter_nodes_targets' al vector correspondiente a su nombre (name()) en el mapa '_node_map_vector'

                                                        -Estas acciones permiten que cada nodo destino 'iter_nodes_targets' se almacene tanto en una lista como en un vector dentro de la estructura interna de la clase. Facilitando el manejo de nodos conectados de diferentes maneras, aprovechando las caracteristicas de las estructuras de datos 'std::list' y 'std::vector'
                    
                    -Finalizados todos los bucles for se realiza lo siguiente:
                         //Topology no se necesita mas, se usa solo para establecer las conexiones entre nodos
                        topology.clear();
            
            Método connectSwitchesAndNodes( ):
                
            Esta función se encarga de establecer conexiones entre los NetIface de los 'Processor' y los Switches de Comunicación 'CommSwitch' en un esquema de red basado en una arquitectura de Fat-Tree
            
            -El proceso comienza con la iteración sobre los procesadores realizada a traves de un bucle for:

                for( auto proc : processors )   Aqui se recorre cada procesador almacenado en el mapa 'processors'. La variable 'proc' es un par clave-valor, donde la clave es el nombre del procesador y el valor es un puntero al objeto 'Processor' correspondiente.

                    Dentro de este ciclo for se realiza la construcción de la IP del Switch EDGE:

                            std::vector< string > ip_parts = Utilities::tokenizeString( proc.second->get_IP( ), '.' );string ip_sw = "10." + ip_parts[ 1 ] + "." + ip_parts[ 2 ] + ".1";

                            Ejempliquemos este proceso:

                                Si tenemos un 'Processor' cuya IP es "10.0.0.1" se realiza lo siguiente:

                                    proc.second->get_IP()                                   Retorna la IP del 'Processor' que en este caso es 10.0.0.1
                                    Utilities::tokenizeString(proc.second->get_IP(), '.')   Divide la cadena "10.0.0.1" en partes separadas por el delimitador "."
                                                                                            El resultado es un 'std::vector<string>' que contiene:
                                        ip_parts = {"10", "0", "0", "1"};
                                
                                Para la construcción de la IP del switch:
                                    string ip_sw = "10." + ip_parts[1] + "." + ip_parts[2] + ".1";  Se utilizan las partes 'ip_parts[1]' y 'ip_parts[2]' para construir la IP del switch

                                    ip_parts[1] es "0" e ip_parts[2] es "0"

                                    Por lo tanto la IP del switch 'ip_sw' se construye como:

                                        ip_sw = "10.0.0.1" puesto que el primero y ultimo valor son valores fijos donde el primero es siempre "10" y el ultimo "1"
                                    
                                    Resultado Final:
                                        Si el Processor tiene la IP "10.0.0.1", el código construirá la IP del switch al que debe conectarse como "10.0.0.1". Esta IP se usará para buscar el switch en el mapa comm_switches y establecer la conexión con la interfaz de red del procesador.
 
                            Ahora se verifica la existencia del Switch:

                                if( comm_switches.count(ip_sw) == 0 )

                                comm_switches.count(ip_sw)      Aqui es donde se busca la IP 'ip_sw' en el mapa 'comm_switches'
                                comm_switches                   Es un std::map que asocia las direcciones IP con objetos 'CommSwitch'
                                count(ip_sw)                    Retorna el número de elementos en el mapa que tienen la clave 'ip_sw'. En este caso deberia ser '0' o '1' ya que las claves en un mapa son únicas
                                                                Si no existe un 'CommSwitch' con la IP 'ip_sw', count(ip_sw) devolverá '0'
                            
                                Si count(ip_sw) == 0 significa que no hay ningún CommSwitch en el mapa con la IP 'ip_sw' y finaliza el programa
                            
                            Una vez realizada esta verificación se procede a acceder al CommSwitch que está mapeado a la dirección IP 'ip_sw' que es un puntero a un objeto 'CommSwitch', posterior a esto se llama al método 'connectToNode' del objeto 'CommSwitch' y este método conecta el 'CommSwitch' a un nodo, en este caso un nodo de tipo NetIface.
                            Como resultado, la interfaz de red (NetIface) se conecta al CommSwitch.

                            Esto se traduce en que se conecta el CommSwitch a la interfaz de red (NetIface), mientras que lueg se realiza la conexión de la interfaz de red (NetIface) al CommSwitch

                            Este tipo de configuración es común en sistemas donde se necesita garantizar que dos componentes puedan comunicarse entre sí desde ambos extremos de la conexión.
                
                Una vez realizados estos métodos importantes se pasa a iterar sobre una lista de generadores 'generators' y para cada uno de ellos, se llama al método 'activate()':

                    for( auto gens : generators )
                        gens->activate();           Aqui se llama al método activate() en el objeto 'Generator' al que 'gens' apunta

                        donde activate() realiza lo siguiente:
                            double now = time( );
                            if ( 0 == _ev ) {
                                message( current(), "Act %s [%d] now\n", name().c_str(), id() );
                                _ev = getSqs( )->insertAt( this, now );}

                        -En resumen este método activate() configura el proceso para que se ejecute en un momento especifico
                        -Verifica si el proceso ya está activado, en caso de no estar activado, lo activa y lo programa para que se ejecute en el tiempo actual.
                        -También registra un mensaje para indicar que el proceso ha sido activado
                        -En el flujo general: Primero se obtiene el tiempo actual, luego se verifica si el proceso ya está activado.Si no lo está, se registra un mensaje y se inserta el proceso en una cola de eventos para ser ejecutado en el tiempo actual
                
                Ahora se invoca al método hold para suspender el proceso actual en la simulación durante un tiempo determinado '_simulation_time'
                Realiza las verificaciones de consistencia, elimina el enveto actual de la cola de eventos, inserta un nuevo evento para la reanudación del proceso en el futuro
                Luego desasocia el proceso, lo que lo cola en "modo espera" hasta que el tiempo especificado haya transcurrido
                Este mecanismo es fundamental para controlar el tiempo y el orden de los eventos en simulaciones de eventos discretos, donde los procesos interactuán en momentos especificos para simular el comportamiento de sistemas complejos

                Luego de todo este proceso y una vez terminado el ciclo for, se procede a realizar una copia del valor CORE::SIM_TIME, EN DONDE ESTE VALOR CORRESPONDE AL VALOR REAL DE DURACIÓN DE LA SIMULACIÓN Y NO EL DEFINIDO POR PARAMETROS:

                     double SIM_TIME = Core::SIM_TIME; //Esto es porque las tuplas se pueden haber procesado antes del tiempo definido por parametro
                    
                -Una vez realizada la simulación comienza la impresión de metricas importantes, donde primera se itera sobre todos los procesadores creados y almacenados en el contenedor 'processors'. La información que se imprimirá será la siguiente:

                    cout    << "PROCESSOR: " << procs.second->to_string()                           Aqui imprime lo siguiente: PROCESSOR: Proc_10.0.0.1                          
                            << " in_use: " << procs.second->in_use()                                Aqui imprime lo siguiente: in_use: 0
                            << " - average memory=" << procs.second->average_memory_consumption()   Aqui imprime lo siguiente: - average memory= 200
                            << " - max memory=" << procs.second->max_memory_consumption()           Aqui imprime lo siguiente: - max memory= 300
                            << " -- accs=" << procs.second->_ram_memory._nbr_accesses               Aqui imprime lo siguiente: -- accs= 3
                            << " -- cumm=" << procs.second->_ram_memory._cumulative_use;            Aqui imprime lo siguiente: -- cumm= 600

                        A continuación explicamos que significa cada valor correspondiente:

                            -PROCESSOR:         Proc_10.0.0.1           Producto de la concadenación de "Proc_" y el nombre del Procesador "10.0.0.1" en este caso
                            -in_use:            0                       Valor que indica si el procesador ha estado en uso durante 0 unidades de tiempo
                            - average memory=   200                     Valor que indica el consumo promedio de memoria del Procesador (200 MB)
                            - max meory=        300                     Valor que indica el consumo maximo de memoria alcanzado por el Procesador (300 MB)
                            - accs=             3                       Representa el número de accesos a la memoria RAM
                            - cumm=             600                     Valor que indica el uso acumulativo de la memoria RAM (600 MB)
                        
                    Una vez proporcionada la información del Procesador, se procede a imprimir la información de cada 'CORE' o núcleo del procesador:

                        cout    << "PROCESSOR: " << procs.second->to_string()               Aqui imprime lo siguiente: PROCESSOR: Proc_10.0.0.1 
                                << " - CORE: " << cores->to_string()                        Aqui imprime lo siguiente: CORE: Core_0
                                << " time_in_use: " << cores->_in_use                       Aqui imprime lo siguiente: time_in_use: 0
                                << " total_time: "  << SIM_TIME                             Aqui imprime lo siguiente: total_time: 0.158491                    
                                << " utilization: " << (double)(cores->_in_use/SIM_TIME);   Aqui imprime lo siguiente: utilization: 0
                    
                            A continuación explicamos que significa cada valor correspondiente:

                                - PROCESSOR:    Proc_10.0.0.1           Producto de la concadenación de "Proc_" y el nombre del Procesador "10.0.0.1" en este caso
                                - CORE:         Core_0                  Producto de la concadenación de "Core_" y el id del Core "0" en este caso
                                - time_in_use:  0                       Valor que indica el tiempo que el Core ha estado en uso (unidades de tiempo)
                                - total_time:   0.158491                Valor que indica el tiempo total de simulación 
                                - utilization:  0                       Valor que calcula la utilización del Core como el tiempo en uso dividido por el tiempo total de simulación
                                                                        Convirtiendo el resultado en un valor double para obtener un porcentaje o proporción
                                                                        Por ejemplo:
                                                                            si SIM_TIME = 1000
                                                                            y _in_use   = 100
                                                                            entonces la utilización sería de 0.1, es decir, el 10% de utilización

                    NOTA IMPORTANTE: POR DEFECTO SIEMPRE SE CREAN 32 CORES POR CADA PROCESADOR CREADO, COMO SE PUEDE APRECIAR EN EL ARCHIVO DE SALIDA.dat
                    
                    Una vez impresa esta información del Core, se realiza la siguiente operación:

                        Suma el tiempo en uso de cada núcleo a la variable tpo, que probablemente se usa para calcular la utilización total o acumulativa:

                                tpo += cores->_in_use:      Suma el tiempo en uso de cada Core a la variable tpo
                    
                    Una vez se imprime la información de todos los Cores pertenecientes al Procesador correspondiente, imprimimos la siguiente información:

                        cout    << "PROCESSOR utilization: " << (double)(tpo/CANT_CORES/SIM_TIME)   Aqui se imprime la utilización total del procesador sumando el tiempo en uso
                                                                                                    de todos sus Cores y dividiendolo por el número de núcleos y el tiempo total
                                                                                                    de simulación
                            Deglosemos cada variable:

                                tpo:        Representa el tiempo total en uso de todos los núcleos.Este valor se acumula a lo largo del bucle que itera sobre los Cores del Processor
                                CANT_CORES: Cantidad de Cores del Procesador, este es un valor por defecto igual a 32    
                                SIM_TIME:   Tiempo total de simulación(Tiempo REAL)

                                En base a este deglose la operación tpo/CANT_CORES/SIM_TIME calcula la utilización promedio de todos los Cores, convirtiendo la expresión a un double

                                A modo de Ejemplo:
                                        si      tpo:            250
                                                CANT_CORES:     32
                                                SIM_TIME:       1000

                                        entonces la utilización sería:
                                                (250/32/1000) = 0.0078125       Que seria el equivalente a una utilización promedio de 0.78125%
                    
                    Ya explicado lo que imprime la primera vez, se considera el mismo procedimiento para cada uno de los procesados creados con sus respectivos Cores

                    Una vez terminado este proceso ahora se inicia un recorrido para la impresión de los NODOS creados y utilizados:

                        - Primero se declara una variable que se utiliza para acumular las tuplas procesadas por los nodos finales para calcular el throughput global:

                            uint32_t tuplas_proc_final = 0;     Tuplas procesadas por los nodos final
                        
                        - Luego se declara un Bucle for que itera sobre el contenedor 'nodes', este mapa es accedido donde la clave es el nombre del nodo y el valor es un 'pair' que contiene un vector de nodos (réplicas) y un carácter que indica el tipo de nodo (Spout o Bolt):
                            
                            for( auto nde : nodes )
                            
                            -Dentro de este bucle for se declaran las variables tpo y tuplas_proc, donde:

                                tpo:            Almacena el tiempo de procesamiento acumulado para cada nodo
                                tuplas_proc:    Almacena la cantidad de tuplas procesadas por cada nodo en particular
                                                Ambas variables se inicializan con un valor 0 al inicio de cada recorrido for
                            
                            -Dentro de este bucle for se encuentra otro bucle for anidado, este segundo bucle itera sobre las réplicas del nodo actual (nde.second.first)
                            -Para cada réplica (almacenada en elem), se extraen y muestras varias métricas:

                                for( auto elem : nde.second.first )

                                -Aqui por cada replica se imprimen los siguiente valores:

                                    cout    << "NODE: " << elem->to_string()                                                    Aqui imprime lo siguiente: NODE: HashtagCounter_0
                                            << " use_time: " << elem->tpo_servicio()                                            Aqui imprime lo siguiente: use_time: 0
                                            << " total_time:" << SIM_TIME                                                       Aqui imprime lo siguiente: total_time: 0.158491
                                            << " utilization:" << (double)(elem->tpo_servicio()/SIM_TIME)                       Aqui imprime lo siguiente: utilization: 0
                                            <<  " throughput:" << (double)(elem->tuplas_procesadas()/SIM_TIME)                  Aqui imprime lo siguiente: throughput: 0
                                            << " avg_resp_time:" << (double)(elem->tpo_servicio()/elem->tuplas_procesadas())    Aqui imprime lo siguiente: avg_resp_time: nan
                                            << " tuples: " << elem->tuplas_procesadas()                                         Aqui imprime lo siguiente: tuples: 0
                                            << " replica: " << elem->_rep_id;                                                   Aqui imprime lo siguiente: replica: 0
                                    
                                    A continuación explicamos que significa cada valor correspondiente:

                                        NODE:           HashtagCounter_0    Este valor corresponde a la variable _node_id que es una concadenación del nombre del nodo + el _rep_id
                                        use_time:       0                   Este valor corresponde a la variable _tpo_servicio y es el tiempo de servicio del nodo
                                        total_time:     0.158491            Valor que indica el tiempo total de simulación y en el archivo salida.dat es un valor constante        
                                        utilization:    0                   Mide que fracción del tiempo total de simulación el nodo estuvo en uso procesando tuplas, donde:

                                                                                -tpo_servicio() devuelve el tiempo total en que el nodo elem estuvo activo procesando tuplas
                                                                                -SIM_TIME devuelve el tiempo total de simulación, siendo este un valor constante
                                                                                -Este valor se calcula asi:

                                                                                    tpo_servicio()/SIM_TIME

                                                                                    Ejemplo: Si un nodo estuvo procesando durante 5 segundos y el tiempo total de simulación fue 10 segundos, la utilización seria:

                                                                                        5/10 = 0.5 (o un 50%), indicando que el nodo estuvo ocupado procesando datos durante la mitad del tiempo total de simulación
                                        
                                        throughput:     0                   Mide la cantidad de tuplas procesadas por unidad de tiempo, donde:
                                                                                
                                                                                -tuplas_procesadas() devuelve la cantidad de tuplas que ha procesado el nodo elem
                                                                                -SIM_TIME devuelve el tiempo total de simulación, siendo este un valor constante
                                                                                -Este valor se calcula asi:

                                                                                    tuplas_procesadas()/SIM_TIME
                                                                            
                                                                                    Ejemplo: Si un nodo ha procesado 1000 tuplas y el tiempo total de simulación fue de 10 segundos el throughput seria:

                                                                                    1000/10 = 100 tuplas /segundo, indicando que el nodo en promedio procesa 100 tuplas por segundos

                                        avg_resp_time:  nan                 Mide el tiempo promedio que tarda el nodo en procesar una tupla, donde:
                                                                            
                                                                                -tpo_servicio() devuelve el tiempo total en que el nodo elem estuvo activo procesando tuplas
                                                                                -tuplas_procesadas() devuelve la cantidad de tuplas que ha procesado el nodo elem durante el tiempo
                                                                                de simulación
                                                                                -Este valor se calcula asi:

                                                                                    tpo_servicio()/tuplas_procesadas()

                                                                                    Ejemplo: si un nodo ha procesado 100 tuplas y ha dedicado 10 segundos en total a procesarlas, el tiempo de respuesta promedio (avg_resp_time) seria:

                                                                                        10/100 = 0.1 segundos por tupla, indicando que en promedio cada tupla tarda 0.1 segundos en ser procesada por el nodo

                                        tuples:         0                   Obtiene la cantidad de tuplas procesadas por el nodo (elem->tuplas_procesadas())
                                        replica:        0                   Obtiene el identificador de réplica de un nodo, esto es útil cuando se tienen múltiples réplicas 
                                                                            de un mismo nodo

                                -Una vez realizada la impresión de estos valores, dentro de este segundo bucle for se asignan nuevos valores a las variables acumulativas siguientes:

                                    - tpo+= elem->tpo_servicio()                Suma el tiempo de servicio para todas las réplicas
                                    - tuplas_proc+= elem->tuplas_procesadas()   Suma las tuplas procesadas para todas las réplicas
                                
                                -Luego viene una asignación a la variable nombre, donde se almacena el nombre del nodo en  cada iteración con:

                                    nombre = elem->_name
                                
                            
                            Una vez recorridas todas las réplicas del nodo actual se procede a imprimir la siguiente información:

                                 cout   << "\t utilization:"  << (double)(tpo/nde.second.first.size()/SIM_TIME)     Aqui imprime lo siguiente: utilization:0
                                        << " throughput:" << (double)(tuplas_proc/SIM_TIME)                         Aqui imprime lo siguiente: throughput: 0
                                        << " replicas:" << nde.second.first.size()                                  Aqui imprime lo siguiente: replicas:3

                                A continuación explicamos que significa cada valor correspondiente:

                                    utilization:    0       Este valor representa la utilización promedio de las réplicas de un nodo en la simulación
                                                            Este valor se calcula de la siguiente forma:

                                                                tpo / nde.second.first.size()/SIM_TIME donde:
                                                            
                                                                    - tpo:                      Tiempo total de servicio que han estado activos todos las replicas del nodo actual
                                                                    - nde.second.first.size()   Representa la cantidad de réplicas de un nodo
                                                                    - SIM_TIME                  Tiempo total de la simulación
                                                                
                                                                Deglosemos esta división triple:

                                                                   tpo / nde.second.first.size():   Es el tiempo de servicio promedio por réplica del nodo
                                                                   /SIM_TIME:                       Al dividir el resultado anterior por el tiempo total de simulación da como
                                                                                                    resultado la fracción de tiempo durante el cual las réplicas han estado en uso, lo que se traduce en la UTILIZACIÓN PROMEDIO DE LAS RÉPLICAS

                                    throughput:     0       Este valor indica la cantidad de tuplas que se procesan por unidad de tiempo (por ejemplo, tuplas por segundo)
                                                            Mide el rendimiento del nodo en la simulación

                                                            Este valor se calcula de la siguiente forma:

                                                                    tuplas_proc/SIM_TIME donde:

                                                                    - tuplas_proc:  Es la cantidad total de réplicas o tuplas procesadas por el nodo actual durante la simulación
                                                                    - SIM_TIME:     Tiempo total de simulación


                                    replicas:       3       Muestra cuántas réplicas existen para el nodo actual

                        Al finalizar el recorrido tanto de los nodos como sus respectivas replicas se procede a realizar una ultima impresión de información general de parte del simulador:

                            cout    << "\t tuples generated:" << _qty_tuples                                        Aqui imprime lo siguiente: tuples generated: 4
                                    << " tuples processed:" << tuplas_proc_final                                    Aqui imprime lo siguiente: tuples processed: 0
                                    << " throughput topology:" << (double)(tuplas_proc_final/SIM_TIME)              Aqui imprime lo siguiente: throughput topology: 0
                                    << " average tuple response time:" << (double)( SIM_TIME/tuplas_proc_final )    Aqui imprime lo siguiente: average tuples response time: inf
                                    << " total simulation time:" << SIM_TIME                                        Aqui imprime lo siguiente: total simulation time: 0.158491

                            A continuación explicamos que significa cada valor correspondiente:

                                tuples generated:               4           Este valor corresponde al valor pasado por parametro ('-p 4') al momento de ejecutar el simulador
                                                                            Este valor queda almacenado en la variable qty_tuples y luego asignada al constructor de la clase sistema:

                                                                                _qty_tuples = qty_tuples

                                tuples processed:               0           Este valor siempre será 0, puesto que no recibe nunca una modificación (HIPOTESIS POR VALIDAR)
                                throughput topology:            0           Esto da el número de tuplas procesadas por los nodos finales por unidad de tiempo
                                                                            
                                                                            Este valor es el producto de la división de:
                                                                                
                                                                                    tuplas_proc_final/SIM_TIME, donde:

                                                                                        - tuplas_proc_final: Es la cantidad total de tuplas procesadas por los nodos finales (nodos que no tienen más conexiones de salida, como los "Bolts" finales)

                                                                                        - SIM_TIME es el tiempo total de simulación
                                                                            
                                                                            Este valor indica el throughput global de toda la topología
                                                                            Mostrando cuántas tuplas procesaron los nodos finales por unidad de tiempo en el sistema completo
                                                                            Lo cual es útil para medir el rendimiento general del procesamiento en la simulación

                                average tuples response time    inf         Representa el tiempo promedio entre la llegada y el procesamiento de cada tupla en los nodos finales
                                                                            de la simulación
                                                                            
                                                                            Este valor es el producto de la división de:

                                                                                SIM_TIME/tuplas_proc_final donde:
                                                                                        
                                                                                        - SIM_TIME es el tiempo total de simulación
                                                                                        - tuplas_proc_final es el número total de tuplas procesadas por los nodos finales
                                                                            
                                                                            Este valor refleja el tiempo promedio por tupla procesada en toda la simulación
                                                                            Esto es útil para analizar el rendimiento temporal del sistema
                                                                            Si el valor es bajo, el sistema es eficiente en procesar las tuplas rápidamente
                                                                            Si el valor es alto, las tuplas tardan más en ser procesadas
                                                                                        
                                total simulation time           0.158491    Este valor corresponde al tiempo total de simulación

            
    PARA FINALIZAR SE DESTACA QUE LAS PRIMERAS LINEAS DE SALIDA DEL SIMULADOR, POR EJEMPLO:

        ARRIVAL_RATE 0.0111255
        ARRIVAL_RATE 0.0585821
        SERVICE_TIME TwitterFilter_0 7.54962e-05
        NUMBER_OF_TUPLES TwitterFilter_0 0
        ARRIVAL_RATE 0.0147009
        SERVICE_TIME TwitterFilter_0 0.000497128
        NUMBER_OF_TUPLES TwitterFilter_0 0
        ARRIVAL_RATE 0.00639823
        SERVICE_TIME TwitterFilter_0 4.19205e-05
        NUMBER_OF_TUPLES TwitterFilter_0 0
        ARRIVAL_RATE 0.0672446
        SERVICE_TIME TwitterFilter_0 0.000112991
        NUMBER_OF_TUPLES TwitterFilter_0 0
        SERVICE_TIME TwitterFilter_0 0.000439437
        NUMBER_OF_TUPLES TwitterFilter_0 0

        DONDE POR EJEMPLO ARRIVAL_RATE 0.0111255 CORRESPONDE AL OBJETO GENERATOR QUE SE CREA DURANTE LA EJECUCIÓN DE LOS MÉTODOS DE LA CLASE SISTEMA Y LLAMAN A LA FUNCIÓN:

            void Generator::inner_body( void )      Este método es el encargado de generar tuplas o paquetes a intervalos de tiempo determinados, los cuales luego se procesan
                                                    través de un SPOUT
                                                    Al momento de crear un Generador en el método load_nodes_from_file pasa que se toma en cuenta el valor correspondiente al arrival_rate del archivo nodes.dat, Por ejemplo:

                            KafkaSpout                     S   10   0   10.0.0.2   fixed(0.0)                  expon(-1.0389139971820532e-11,0.024674476149550005)
                            

                            Aqui al ser Un nodo Spout por su identificador varchar 'S' se procederia de la siguiente forma:

                                arrival_rate = expon(-1.0389139971820532e-11,0.024674476149550005)

                            Este valor sería utilizado como parametro para crear un nuevo Objeto Generador:

                                new Generator("Generator", generator_id, arrival_rate)

                                quedando de la siguiente forma:

                                    new Generator("Generator", 0, expon(-1.0389139971820532e-11,0.024674476149550005))

                                    Se crearia un nuevo proceso puesto que Generator Hereda de la clase process y se llamaria al constructor que realizaria lo siguiente:

                                    Generator:

                                        _arrival_rate   = expon(-1.0389139971820532e-11,0.024674476149550005)
                                        _rep_id         = 0
                                        _generator_id   = Generator_0

                                    
                                    Luego de ser creado se ejecutaria el método Void Generator::inner_body(void) y aqui es donde se Realizaria un proceso importante, que es el siguiente:

                                        double arrival_rate = this->_wrapper.gen_continuous( this->_arrival_rate )
                                        
                                        Aqui quedaria de la siguiente forma:

                                         double arrival_rate = this->_wrapper.gen_continuous( this-> expon(-1.0389139971820532e-11,0.024674476149550005)) 

                                         Aqui se llamaria al método de la clase Wrapper "gen_continuous" y se verificaria si esta distribución y valores de:

                                            Si expon(-1.0389139971820532e-11,0.024674476149550005) corresponden a una de las distribuciones descritas en esta clase
                                             puesto que de no encontrase el simulador termina su ejecución con un EXIT_FAILURE 

                                             En este caso estaría bien, puesto que la distribución "expon" existe y esta recibe 2 valores que serian:

                                                Value[0] =  -1.0389139971820532e-11
                                                Value[1] =  0.024674476149550005


                                            Luego se realizan otro procedimientos ya definidos pero lo importante es denotar que la variable _max_tuples se modifica antes de realizar este proceso que se ha descrito, puesto que como se puede denotar:

                                                ARRIVAL_RATE 0.0111255
                                                ARRIVAL_RATE 0.0585821

                                                Aqui se realizo 2 veces la impresión de información y si no se hubiese realizado la modificación de la variable _max_tuples solo habria existido 1 impresión, pero como el valor se modifico a:

                                                    _max_tuples = 1     Puesto que el parametro -p 1 indica que se debe generar 1 tupla
                                                                        y el loop se inicia asi: 0 > 1  cumple y se imprime una vez ARRIVAL_RATE
                                                                                                 1 > 1  cumple y se imprime por segunda vez ARRIVAL_RATE
                                                                                                 2 > 1  LA TERCERA VEZ YA SE ROMPE EL CICLO Y NO SE GENERAR MAS TUPLAS


                                            LUEGO DE ESTO ANALIZAMOS LO SIGUIENTE:

                                                SERVICE_TIME TwitterFilter_0 7.54962e-05

                                                Esta impresión debe corresponder al momento en que es creado un BOLT al igual que pasa cuando se crea un SPOUT, APROVECHAMOS DE EXPLICAR QUE LA FUNCIÓN "Spout::run y Bolt::run" TIENEN GRAN RELEVANCIA PUESTO QUE EN LA CLASE sistema CUANDO SE CREA TANTO UN SPOUT COMO UN BOLT ESTAS FUNCIONES "run" SE ENCARGAN DE VALIDAR LO SIGUIENTE:

                                                    En el caso de un nuevo objeto Spout y la función run pasa que se toma el siguiente valor y se asigna:

                                        KafkaSpout                     S   10   0   10.0.0.2   fixed(0.0)                  expon(-1.0389139971820532e-11,0.024674476149550005)


                                            _avg_service_time = avg_service_time donde:

                                                avg_service_time = fixed(0.0), quedando finalmente:

                                                _avg_service_time = fixed(0.0)

                                        
                                        con este valor en el método "run" pasa la siguiente validación:

                                            //Genera el tiempo de servicio para este requerimiento
                                            double avg_s_time = _wrapper.gen_continuous( this->_avg_service_time );

                                       Aqui se llamaria al método de la clase Wrapper "gen_continuous" y se verificaria si esta distribución y valores de:

                                                Si fixed(0.0) corresponden a una de las distribuciones descritas en esta clase puesto que de no encontrase el simulador termina su ejecución con un EXIT_FAILURE

                                                 En este caso estaría bien, puesto que la distribución "fixed" existe y esta recibe 1 valor que seria:


                                                    -values[0] = 0.0

                                        Luego se realizarian otras operaciones correspondiente del método run y se estaria retornando el valor de esta nueva variable
                                        "avg_s_time"

                                            En el caso de un nuevo objeto Bolt y la función run seria la encargada de imprimir lo siguiente:

                                                SERVICE_TIME TwitterFilter_0 7.54962e-05


                                                Aqui "TwitterFilter_0" seria la impresión de la variable _node_id que seria una concadenación de caracteres que darian ese resultado
                                                Mientras que el valor 7.54962e-05 corresponde a la variable "tpo" que es modificada de la siguiente forma:

                                                     double tpo = process_tuple( _tupla );      Aqui se llama al método proccess_tuple donde se ingresa la variable timestamp 
                                                                                                y es actualizada de alguna forma, puesto que al parecer es siempre llamada con un valor 0.0

                                                    Mientras que la función process_tuple REALIZA OTRO PROCESO IMPORTANTE y es el de validar la distribución del BOLT, ya que en el método process_tuple se retorna el método gen_continuous, por tanto el orden seria:

                                                        -Primero el valor de _tupla se modifica de alguna forma
                                                        -Segundo se llama al método process_tuple
                                                        -Tercero es que el método process_tuple llama al método gen_continuous con la variable _avg_service_time como parámetro:

                                    TwitterFilter                  B   10   0   10.2.0.2   nbinom(1,0.26063,0.0,1.0)   expon(1.646999997256628e-05,0.00040570702420820206)


                                                    Aqui se llamaria a gen_continuous de la siguiente forma:

                                                        -gen_continuous(this->_avg_service_time ) donde:

                                                            _avg_serice_time = avg_service_time donde:

                                                            avg_service_time = expon(1.646999997256628e-05,0.00040570702420820206) quedando:

                                                            _avg_serice_time = expon(1.646999997256628e-05,0.00040570702420820206) y finalmente:

                                                            gen_continuous(expon(1.646999997256628e-05,0.00040570702420820206))

                                                            AQUI SE REALIZARIA UNA VALIDACIÓN IMPORTANTE DE SI EXISTE LA DISTRIBUCIÓN "expon" en el método gen_continuous:


                                                            Si expon(1.646999997256628e-05,0.00040570702420820206) corresponden a una de las distribuciones descritas en esta clase puesto que de no encontrase el simulador termina su ejecución con un EXIT_FAILURE

                                                 En este caso estaría bien, puesto que la distribución "expon" existe y esta recibe 2 valores que serian:

                                                            -values[0] = 1.646999997256628e-05
                                                            -values[1] = 0.00040570702420820206     

                                                        El resultado de la generación de esta distribución seria retornado por el método process_tuple y asignado a la variable tpo, quedando de la siguiente forma:

                                                            tpo = 7.54962e-05       Producto de la generación de un distribución exponencial continua 

                                            
                                                Una vez impresa esa linea el simulador procede a ejecutar el método send_tuple() del nuevo objeto BOLT, que imprime lo siguiente:

                                                  NUMBER_OF_TUPLES TwitterFilter_0 0


                                                Aqui lo primero que se realiza en este método es lo siguiente:

                                                    uint32_t nroTuplasEnviar = _wrapper.gen_discrete( this->_nbr_output_tuples ) donde:

                                                    Se llama al método gen_discrete con la variable _nbr_output_tuples como parametro al crear el nuevo Bolt:


                                        TwitterFilter                  B   10   0   10.2.0.2   nbinom(1,0.26063,0.0,1.0)   expon(1.646999997256628e-05,0.00040570702420820206)


                                                    -Lo primero es que al crear el nuevo Objeto Bolt TwitterFilter pasa lo siguiente:

                                                        _nbr_output_tuples = nbr_output_tuples, donde:

                                                        nbr_output_tuples = nbinom(1,0.26063,0.0,1.0) quedando:

                                                        _nbr_output_tuples = nbinom(1,0.26063,0.0,1.0) donde finalmente sera invocado gen_discrete así:

                                                        _wrapper.gen_discrete(nbinom(1,0.26063,0.0,1.0))

                                                    
                                                    AQUI SE REALIZARIA UNA VALIDACIÓN IMPORTANTE DE SI EXISTE LA DISTRIBUCIÓN "nbinom" en el método gen_discrete:

                                                        Si nbinom(1,0.26063,0.0,1.0) corresponden a una de las distribuciones descritas en esta clase puesto que de no encontrase el simulador termina su ejecución con un EXIT_FAILURE

                                                    
                                                    En este caso estaría bien, puesto que la distribución "nbinom" existe y esta recibe 4 valores que serian:

                                                        -values[0] = 1
                                                        -values[1] = 0.26063 
                                                        -values[2] = 0.0
                                                        -values[3] = 1.0

                                                     El resultado de la generación de esta distribución sera asignado la variable nroTuplasEnviar, quedando de la siguiente forma:

                                                        nroTuplasEnviar = 0

                                                        Y LUEGO SERIA IMPRESA LA SIGUIENTE LINEA Y VALORES:

                                                            NUMBER_OF_TUPLES TwitterFilter_0 0      PUESTO QUE ESTE VALOR ES 0 ENTONCES NO SE IMPRIMIRA LO SIGUIENTE:

                                                        tupla EMITTED - tupla_id=" << t->id() << " id_tramo=" << t->id_tramo() << " nro_local=" << t->nro_tupla() << " copia=" << t->copia() << " nroTuplas=" << nroTuplasEnviar

                                                    POR TANTO SE PUEDE INFERIR LO SIGUIENTE PARA ESTA TOPOLOGIA Y LA DESCRIPCIÓN DE LOS NODOS:

                                                        -nodes.dat y topology.dat

                                                    ES QUE LOS VALORES SIGUIENTE:

                                                        ARRIVAL_RATE 0.0147009
                                                        SERVICE_TIME TwitterFilter_0 0.000497128
                                                        NUMBER_OF_TUPLES TwitterFilter_0 0
                                                        ARRIVAL_RATE 0.00639823
                                                        SERVICE_TIME TwitterFilter_0 4.19205e-05
                                                        NUMBER_OF_TUPLES TwitterFilter_0 0
                                                        ARRIVAL_RATE 0.0672446
                                                        SERVICE_TIME TwitterFilter_0 0.000112991
                                                        NUMBER_OF_TUPLES TwitterFilter_0 0
                                                        SERVICE_TIME TwitterFilter_0 0.000439437
                                                        NUMBER_OF_TUPLES TwitterFilter_0 0

                                                    TODOS LOS ARRIVAL_RATE CORRESPONDERIAN AL SPOUT KAFKASPOUT QUE ESTA ENVIANDO TUPLAS O PAQUETES AL NODO BOLT PERO ESTAN NO ESTAN SIENDO EMITIDAS AL RESTO DE BOLTS, ESTO SE PUEDE CONFIRMAR PUESTO QUE EN TODAS LAS LINEAS QUE APARECE NUMBER_OF_TUPLES TODOS LOS VALORES FINALES SON SIEMPRE 0

                                                     ENTONCES NO SE CUMPLE LA SIGUIENTE CONDICIÓN EN LA CLASE BOLT.CC LINE NRO.29 DEL MÉTODO double Bolt::send_tuple( ):

                                                        if( nroTuplasEnviar != 0 ){ LINEA DE CODIGO NRO.40 DE LA CLASE BOLT.CC

                                                        Y ESTO SE PUEDE RECONFIRMAR EN LOS ULTIMOS VALORES DEL ARCHIVO SALIDA.DAT:

                                                            tuples generated:4 tuples processed:0 throughput topology:0 average tuple response time:inf total simulation time:0.158491

                                                            QUE NOS INDICA QUE SE HAN PROCESADO 0 TUPLAS AL PARECER

                                                            ESTO SE PODRIA INTENTAR MODIFICAR EN EL ARCHIVO NODES.DAT PARA QUE EL NODO TwitterFilter EN EL VALOR nbinom(1,0.26063,0.0,1.0) DIERA COMO RESULTADO UN VALOR DIFERENTE DE 0 Y VER SI LA LINEA SIGUIENTE:

                                                                NUMBER_OF_TUPLES TwitterFilter_0 SE MODIFICA y en vez de aparecer 0 al final de la linea aparece otro valor y si esto influye en el valor final siguiente:

                                                                    tuples generated:4 tuples processed:0 throughput topology:0 average tuple response time:inf total simulation time:0.158491

                                                                    tuples processed : Aqui apareciese un valor diferente de 0


                                                   