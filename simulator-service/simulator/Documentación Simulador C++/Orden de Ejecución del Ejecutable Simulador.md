Orden de Ejecución del Ejecutable Simulador:

La ejecución del ejecutable Simulador se realiza tomando en cuenta el siguiente comando con el cual se ejecuto el simulador:

    ./Simulador -t topology.txt -n nodes.txt -p 1 -l 4000 > salida.txt

    Lo primero que se debe tomar en cuenta es que hay una variable fija que tiene un valor prefijado:

        double simulation_time = 1000e100
    
    Se asigna además el valor a la variable 'topology_file':

        topology_file = topology.txt
    
    Se asigna otro valor a la variable 'nodes_file':

        nodes_file = nodes.txt
    
    Se asigna otro valor a la variable 'simulation_time':

        simulation_time = 4000
    
    En este caso en especifico la variable 'arrival_rate_file' no se especifico, para realizar este proceso se deberia agregar el comando '-r' seguido de un valor y esto se utiliza Para el caso en que la tasa de arribo debe variar durante la simulacion.
    EN ESE CASO LA VARIABLE 'arrival_rate_file' tomaria este valor:

        ejemplo: ./Simulador -t topology.txt -n nodes.txt -p 1 -l 4000 -r 4000 > salida.txt

        arrival_rate_file = 4000

    Se asgina otro valor a la variable 'qty_tuples' que viene desde el parametro '-p 1':

        qty_tuples = 1
    
    Posterior a esto se crea un objeto sis que es de tipo Sistema y se llama al constructor, dependiendo si existe el archivo que viene del parametro '-r' o no se ejecutará un constructor u otro pero independiente de esto este objeto 'sis' de tipo Sistema y el constructor realizará lo siguiente:

        sis:
            _simulation_time    = 4000
            _qty_tuples         = 1
            _topology_file      = topology.txt
            _nodes_file         = nodes.txt
            _arrival_rate_file  = "" //queda vacío puesto que esta opción no esta
    
    Luego se llama a la función que posee el objeto 'sis' de tipo Sistema llamada 'inner_body()' y que ejecuta en paralelo las siguiente funciones:

        build_fat_tree( );
        load_nodes_from_file( _nodes_file );
        Generator::set_max_tuples( _qty_tuples );
        build_topology_from_file( _topology_file );
        connectSwitchesAndNodes( );
    
        Deglosamos entonces cada función correspondiente:

            build_fat_tree():

            Esta función construye tablas de ruteo de acuerdo a paper "A Scalable, Commodity Data Center Network Architecture", de esta forma se construye un esquema de redes y conexiones importantes para comunicar procesadores entre sí a traves de Switches

            load_nodes_from_file (_nodes_file)

            Esta función se encargará de leer el archivo nodes.txt, descomponer cada una de las lineas del archivo y asignar valores dependiendo de los Spouts o Bolts que aparezcan,
            son diferenciados por el valor de tipo char 'S' o 'B' presente en este archivo
            Se crean nuevos procesadores en caso de no existir con sus respectivas interfaces de red, número de nucleos o 'Cores', tamaño de memoria RAM, IPS y otros datos
            Además de crear generadores o Generator para el/los Spout(s). Spout y replicas usan el mismo Spout
            Se crean nuevos objetos SPOUT o BOLT y son guardados en arreglos, mapas o listas para sus posteriores accesos y asignación o comunicación

            Generator::set_max_tuples( _qty_tuples )

            En esta función se define la cantidad maxima de tuplas a generar (entre todos los generadores) basada en el valor entregado por parametro '-p 1'
            Se llama la función set_max_tuples del objeto Generator y se cambia el siguiente valor:

                _max_tuples = 1
            
            build_topology_from_file( _topology_file )

            Esta función toma como parametro el archivo topology.txt y se encarga de leer el archivo linea por linea e ir deglosando la información
            Define la topologia sin considerar nivel de replicacion, se utiliza luego para conectar nodos
            Toma el primer valor y lo guarda en la variable 'source' y el segundo valor en la variable 'target'

                Ejemplo: KafkaSpout        TwitterFilter

                source = KafkaSpout
                target = TwitterFilter

            Luego en el mapa definido con anterioridad llamado 'topology' realiza la siguiente acción:

                topology[ source ].push_back( target )
                donde:
                    topology[ KafkaSpout ].push_back( TwitterFilter )
            
            Luego se ESTABLECE CONEXIONES ENTRE TODAS LAS REPLICAS DE ORIGEN/DESTINO y se itera sobre todos los 'source' y 'target' para establecer dichas conexiones
            Posterior a esto se realiza un clear sobre el mapa topology puesto que no se necesita mas, se usa solo para establecer las conexiones entre nodos

            connectSwitchesAndNodes( )

            Esta función se encarga de conectar los hosts a los switches Edge
            Se recorren todos los procesadores y se construyen IP de los Switchs Edge al que se debe conectar cada NetIface, para esto se descomponen las IP de los Procesadores
            para construir la IP de cada Switch tomando en cuenta los valores de la IP del Procesador de la siguiente forma:

                Ejemplo: Procesador: 10.0.0.2
                         IP switch: 10.0.0.1 -> Para estos casos los valores de la IP Switch se construyen con el primer digito '10.' luego toma los valores 0.0 del Procesador y termina con un valor fijo '.1'