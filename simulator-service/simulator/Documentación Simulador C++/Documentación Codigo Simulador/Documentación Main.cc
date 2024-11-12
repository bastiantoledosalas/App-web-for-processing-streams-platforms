Documentación de la clase main.cc (Linea 437 en adelante):

    Este código configura y ejecuta una simulación basada en los archivos de configuración y parámetros proporcionados por línea de comandos

  Definición de la función principal main que recibe dos argumentos:

    int main( int argc, char* argv[] )

    Deglose:
              argc:   Número de argumentos de línea de comandos
              argv:   Matriz de cadenas que contienen los argumentos

    Declara tres variables de tipo string para almacenar los nombres de los archivos de topología, de nodos y de tasa de llegada:

      string  topology_file,      Archivo de la topología de simulación
              nodes_file,         Archivo detallado de los nodos de la topología de simulación
              arrival_rate_file;  Archivo con la tasa de llegada de los nodos de la topología de simulación

    Declaración de variables:

      double simulation_time = 1000e100;    Se inicializa con un valor muy grande y representa la duración de la simulación
      uint32_t qty_tuples = 0;              Se inicializa con un valor igual a 0 y representa la cantidad de tuplas a generar
  
    Declaración de variables adicionales:

      char c;                 Almacena la opción de argumento actual
      extern char *optarg;    Variable externa utilizada por getopt() para apuntar a la opción del argumento
      uint32_t tflag = 0;     Bandera para verificar si se han proporcionado el argumento necesario
      uint32_t nflag = 0;     Bandera para verificar si se han proporcionado el argumento necesario
      uint32_t aflag = 0;     Bandera para verificar si se han proporcionado el argumento necesario
      uint32_t pflag = 0;     Bandera para verificar si se han proporcionado el argumento necesario

    Bucle While para Procesamiento:

      while ((c = getopt(argc, argv, "t:p:n:l:r:")) != -1)    Bucle while que utiliza getopt para procesar los argumentos de línea de comandos
                                                              getopt  es una función que facilita el análisis de los argumentos pasados al programa desde la línea de comandos
                                                              "t:p:n:l:r:" es una cadena que define las opciones esperadas por el programa, donde cada letra corresponde a una opción
                                                              '!= -1' indica que la función 'getopt' devuelve el valor '-1' cuando ya no hay mas opciones que procesar
        switch (c)                                            Estructura uitlizada para el maneja de cada una de las opciones   

      Manejo de Opciones desde la línea de Comandos:

        Si el argumento es -t, almacena el argumento de la opción en 'topology_file' y establece la variable 'tflag' con valor 1( indica que la opción -t fue proporcionada):
          case 't':               
          topology_file = optarg;
          tflag = 1;
          break;

          Ejemplo:   al ejecutar: ./Simulador -t topologia.dat, la variable optarg tomará el valor de 'topologia.dat' y se pasará a 'nodes_file', 'tflag' tendrá valor 1 

        Si el argumento es -n, almacena el valor de la opción en 'nodes_file' y establece la variable nflag con valor 1:

          case 'n':
          nodes_file = optarg;
          nflag = 1;
          break;

          Ejemplo: al ejecutar: ./Simulador -t topologia.dat -n nodes.dat, la variable 'optarg' tomará el valor de 'nodes.dat' y se pasará a 'nodes_files', 'nflag' tendrá valor 1

        Si el argumentos es -l, convierte el valor a double y lo almacena en 'simulation_time':

          case 'l':
          simulation_time = std::stod( optarg );
          break;

          Ejemplo: al ejecutar: ./Simulador -t topologia.dat -n nodes.dat -l 10.000, la variable 'optarg' tomará el valor de '10.000', std_stod(10.0000) lo convertira a ún valor double: 10.0
                    y será asignado a la variable 'simulation_time'

        Si el argumento es -r, almacena el valor en arrival_rate_file y establece la variable aflag con valor 1:

          case 'r':
          arrival_rate_file = optarg;
          aflag = 1;
          break;

          Ejemplo: al ejecutar: ./Simulador -t topologia.dat -n nodes.dat -l 10.000 -r arrival_file, la variable 'optarg' tomará el valor de 'arrival_file' y se pasará a 'arrival_rate_file',
                   'aflag' tendrá valor 1 

        Si el argumento es -p, convierte el valor a uint32_t y lo almacena en qty_tuples y establece la variable pflag con valor 1:

          case 'p':
          qty_tuples = std::stoul( optarg );
          pflag = 1;
          break;

          Ejemplo: al ejecutar: ./Simulador -t topologia.dat -n nodes.dat -l 10.000 -r arrival_file -p 100, la variable 'optarg' tomará el valor '100',
                   std:stoul(100) lo convertira a un número entero sin signo, 'pflag' tendrá valor 1 

        Si se encuentra una opción no reconocida, el programa termina con un código de salida de -1:

          default:
          exit( -1 );
          break;

    Revisión de Parametros Necesarios para el Simulador:

      Si tflag no se ha establecido, es decir que no se proporcionó el archivo de topología, se imprime un mensaje de error y el programa termina:

        if( tflag == 0 ){
            cout << "Mandatory parameter -t (topology file) needed" << endl;
            exit( -1 );
          }

      Si nflag no se ha establecido, es decir que no se proporcionó el archivo de nodos, se imprimer un mensaje de error y el programa termina:

        if( nflag == 0 ){
            cout << "Mandatory parameter -n (nodes file) needed" << endl;
            exit( -1 );
          }

      Si pflag no se ha establecido (es decir, no se proporcionó la cantidad de tuplas), se imprime un mensaje de error y el programa termina:

        if( pflag == 0 ){
            cout << "Mandatory parameter -p (amount of tuples to generate) needed" << endl;
            exit( -1 );
          }

    
    Inicializa la simulación creando una nueva instancia de sqsDll:

        simulation::instance( )->begin_simulation( new sqsDll( ) );

        Deglose Detallado:
            simulation::instance()    Obtiene una instancia de la clase 'simulation'
            begin_simulation()        Se llama con nuevo objeto de tipo 'sqsDll' para configurar y preparar la simulación para ser ejecutada

    Declaración e Inicialización de 'handle<sistema> sis':
    
        handle<sistema> sis;

        Deglose Detallado:
            handle<sistema> sis        Declara un puntero manejador 'handle' a un objeto de la clase 'sistema' utilizado para manejar la memoria automáticamente
    
    Revisión del Archivo de Tasa de Arribo:

        El proposito de este codigo es verificar si se ha proporcionado el archivo de tasa de arribo o no:

        if(aflag == 0 )
          sis = new sistema("System main", simulation_time, qty_tuples, topology_file, nodes_file);
        else
          sis = new sistema("System main", simulation_time, qty_tuples, topology_file, nodes_file, arrival_rate_file);

        Deglose Detallado:

          //Cuando no se proporciona el archivo de tasa de arribo, se crea un nuevo objeto 'sistema' sin el archivo de tasa de arribo
          //'sistema' toma los parametros: nombre, tiempo de simulación, cantidad de tuplas, archivo de topología y archivo de nodos
          sis = new sistema("System main", simulation_time, qty_tuples, topology_file, nodes_file)

          //Cuando se proporciona el archivo de tasa de arribo, se crea un nuevo ojbeto 'sistema con el archivo de tasa de arribo incluido
          //'sistema' toma los parametros: nombre, tiempo de simulación, cantidad de tuplas, archivos de topologia, archivo de nodos y archivo de tasa de arribo
          sis = new sistema("System main", simulation_time, qty_tuples, topology_file, nodes_file, arrival_rate_file);    
        
    Inicialización de Puntero Manejador:

        handle<sistema> system( sis /*new sistema("System main", simulation_time, topology_file, nodes_file)*/ );
        system->activate( );

        Deglose Detallado:
          handle<sistema> system(sis)   Inicializa  un puntero manejador con el objeto 'sistema' creado. 'system' es un puntero manejador que apunta al objeto 'sistema' 
                                        representado por 'sis'
          system->activate()            Activa el sistema llamando al método 'activate()' en el objeto 'sistema', preparando el sistema para la simulación

    Ejecuta la simulación:

        simulation::instance( )->run( ) Llama al método 'run()' en la instancia de 'simulation' comenzando la ejecución de la simulación
        
    Termina la simulación:

        simulation::instance( )->end_simulation( )  Llama al método 'end_simulation()' en la instancia de 'simulation', finalizando y limpiando los recursos utilizados durante
                                                    la simulación

    El programa finaliza y retorna 0 indicando que se ejecutó correctamente:

        return 0;

