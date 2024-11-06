Documentación de la Clase glob.h:

Definición de lineas de inclusión:

    #ifndef GLOBAL_H
    #define GLOBAL_H

    Evitan que el archivo de cabecera se incluya múltiples veces en el mismo archivo de compilación, lo que podría causar errores

Inclusión de bibliotecas estándar de C++:

    //Cabecera de la biblioteca específica 'cppsim.hh' propia de la libreria libcppsim luego de compilarla
    #include <cppsim.hh>

    #include <iostream>
    #include <map>
    #include <sstream>
    #include <set>
    #include <vector>
    #include <list>
    #include <assert.h>
    #include <fstream>
    #include <string>
    #include <limits>
    #include <queue>
    #include <math.h>
    #include <algorithm>
    #include <tuple>
    #include <memory>

Definición de constantes relacionadas con la CPU y la memoria:
    
    #define CANT_CORES 32
    #define MAX_MEMORY 100000000000

    CANT_CORES es el número de núcleos de la CPU y MAX_MEMORY es la cantidad máxima de memoria (en bytes)

Definición de constantes relacionadas con la red y comunicación:

    #define HOST 3

    Se define HOST con valor 3

Definición de la constante MTU para los parámetros de la red:

    #define MTU 500
    
    MTU es la Unidad Máxima de Transmisión, establecida en 500 bytes

Uso del espacio de nombres estándar 'std' para evitar tener que escribir 'std::' antes de cada objeto de la biblioteca estándar de C++:

    using namespace std

Definición de la clase Utilities:

    class Utilities{
    public:

    Método Estático tokenizeString:

        static std::vector<std::string> tokenizeString(std::string to_split, char delimiter = '.'){
            //Se declara un vector de cadenas llamado splitted que almacenará las subcadenas resultantes
            std::vector<std::string> splitted;
            //'pos' es una variable de tipo std:size_t(tamaño sin signo) inicializada con valor 0
            //'found' es una variable de tipo std:size_t que se usará para almacenar la posición donde se encuentra el delimitador
            std::size_t pos = 0, found;
            //Se utiliza un bucle while para iterar a traves de la cadena 'to_split'
            //to_split.find_first_of(delimiter, pos)) busca el primer carácter delimitador a partir de la posición 'pos' y devuelve su posición
            //Si no se encuentra el delimitador devuelve 'std::string::npos'
            while((found = to_split.find_first_of(delimiter, pos)) != std::string::npos) {
                //Se extrae una subcadena desde la posición 'pos' hasta 'found - pos' caracteres de longitud (es decir, desde 'pos' hasta junto antes del delimitador)
                //Se añade al vector 'splitted'
                splitted.push_back(to_split.substr(pos, found - pos));
                //Actualizar pos para que apunte al carácter inmeditamente después del delimitador
                pos = found + 1;
            //El bucle continúa hasta que no se encuentre más delimitadores en la cadena 'to_split'
            }
            //Despúes de salir del bucle, cualquier texto restantes desde la última posición 'pos' hasta el final de la cadena 'to_split' se añade al vector 'splitted' 
            splitted.push_back(to_split.substr(pos));
            //Se devuelve el vector 'splitted' que contiene todas las subcadenas
            return splitted;
            } 

        Toma una cadena de tipo string 'to_split'
        Toma un carácter delimitador (char delimiter) por defecto y en este caso es el '.'
        Divide la cadena to_split en subcadenas
        Devuelve un vector de subcadenas resultantes

        Ejemplo de Uso:
            //text es la cadena que se va a dividir
            std::string text = "192.168.1.1";
            //el delimitaor en este caso es '.'
            std::vector<std::string> result = Utilities::tokenizeString(text, '.');

            El método tokenizeString dividirá 'text' en {'192','168','1','1'}

    Método Estático tokenizeStringToInt:
        
        //std::vector<uint32_t> indica que devuelve un vector de enteros sin signo
        //Toma 2 parámetros: 1 cadena de tipo string 'to_split' y un caracter delimitador (char delimiter) '.' que indica donde dividir la cadena
        static std::vector<uint32_t> tokenizeStringToInt(std::string to_split, char delimiter = '.'){
            //Se declara un vector de enteros sin signo llamado 'splitted_int'
            //'splitter_int' almacenará los enteros resultantes de la conversión de las subcadenas
            std::vector<uint32_t> splitted_int;
            //Se utiliza el método 'tokenizeString' para dividir la cadena 'to_split' en subcadenas utilizando el delimitador especificado por defecto '.'
            //El resultado es un vector de cadenas 'splitted'
            std::vector<std::string> splitted = tokenizeString(to_split);
            //Se itera sobre cada elemento (subcadena) en el vector 'splitted'
            for (auto parts : splitted)
                //'parts' representa cada una de las subcadenas que se obtuvieron tras dividir la cadena original 'to_split' mediante el método tokenizeString
                //la función std::stoi convierte la subcadena 'parts' a un entero
                //Si 'parts' contiene caracteres no numéricos, 'std::stoi' lanzará una excepción std::invalid_argument
                //push_back es método de std::vector que permite añadir elementos al final del vector, redimensionándolo automáticamente si es necesario
                splitted_int.push_back(std::stoi(parts));
            //Después de que todas las subcadenas han sido convertidas a enteros y almacenadas en splitted_int
            //el método 'tokenizeStringToInt devuelve este vector.
            return splitted_int;
        }

        Divide una cadena en subcadenas usando un delimitador especifico '.'
        Convierte cada subcadena a un entero y devuelve un vector de enteros
        Este método es útil para convertir direcciones IP u otras cadenas delimitadas en sus componentes numéricos, que luego pueden ser utilizados para cálculos

        Ejemplo de Uso:

            //cadena to_split es '192.168.1.1'
            std::string to_split = "192.168.1.1";
            tokenizeString(to_split, '.') dividiria la cadena '192.168.1.1' en ['192', '168', '1', '1']
            Para cada 'parts' en el vector  ['192', '168', '1', '1']:
                std::stoi('192') convierte esta subcadena '192' al valor entero '192'
                std::stoi('168') convierte esta subcadena '168' al valor entero '168'
                std::stoi('1') convierte esta subcadena '1' al valor entero '1'
                std::stoi('1') convierte esta subcadena '1' al valor entero '1'

            Finalmente el vector splitted_int después de estas operaciones contendría: [192, 168, 1, 1] relleno de puros valores enteros.
        

    Método Estático hash:

        //Definición de una función estática 'hash' que toma una referencia constante a una cadena '__str'
        static uint32_t hash(const string &__str){
            //Se declara una variable h de tipo uint32_t(entero sin signo de 32 bits) e inicializa a 0U(0 sin signo)
            uint32_t h = 0U;
            //El bucle se inicializa con i igual a 0
            //El bucle se ejecuta mientras i sea menor que la longitud de la cadena __str
            for (uint32_t i = 0; i < __str.length(); i++) {
                //__str.at(i) obtiene el carácter en la posición i de la cadena __str
                //El valor ASCII del carácter en la posición i se suma a h
                //Esta operación asegura que cada carácter de la cadena contribuya al valor final del hash
                h += __str.at(i);
                //Desplaza los bits de h 10 posiciones a la izquierda
                //Esto es equivalente a multiplicar h por (2^10 o 1024)
                //El resultado del desplazamiento se suma a h
                //Esta operación mezcla los bits de h para aumentar la entropía del hash
                h += (h << 10);
                //Desplaza los bits de h 6 posiciones a la derecha
                //Esto es equivalente a dividir h por (2^6 o 64)
                //Se realiza una operación XOR entre h y el resultado del desplazamiento a la derecha
                h ^= (h >> 6);
            }
            //Desplaza h 3 bits a la izquierda y suma el resultado a h
            h += (h << 3);
            //Realiza XOR entre h y h desplazado 11 bits a la derecha
            h ^= (h >> 11);
            //Desplaza h 15 bits a la izquierda y suma el resultado a h
            h += (h << 15);
            return (h);
        }

Declaración de la Clase Package:

    class Tupla;

    Esto indica al compilador que habrá una clase llamada Tupla en el código. 
    Esto es necesario porque Package usa punteros compartidos (shared_ptr) de Tupla antes de la definición completa de Tupla

    Definición de la clase Package:

        class Package {

    
    Miembros de Datos:

        public:
            uint32_t _id;               // Número de identificación del paquete
            uint32_t _nro_paquetes;     //Número total de paquetes
            shared_ptr<Tupla> _tupla;   //Puntero compartido a un objeto 'Tupla'

        Estos miembros y métodos son accesibles desde fuera de la clase

    Constructores:

        Constructor sin Parámetros:
            Package() {}

            No realiza ninguna acción
    
        Constructor Parametrizado:
              Package(const uint32_t& id, const uint32_t& nro_paquetes, shared_ptr<Tupla> tupla) {
                    this->_id = id;
                    this->_nro_paquetes = nro_paquetes;
                    this->_tupla = tupla;
                }

                const uint32_t& id: El ID del paquete
                const uint32_t& nro_paquetes: El número total de paquetes
                shared_ptr<Tupla> tupla: Un puntero compartido a una Tupla

            Inicializa los miembros de la clase con los valores proporcionados

    Métodos:

        Método id (getter):

            uint32_t id() { return _id; } //Devuelve el valor de _id

        Método id (setter):
            
            void id(uint32_t id) { _id = id; }  //Establece el valor de _id

        Método nro_paquetes (getter):

            uint32_t nro_paquetes() { return _nro_paquetes; } //Devuelve el valor de _nro_paquetes
        
        Método nro_paquetes (setter):

            void nro_paquetes(uint32_t nro_paquetes) { _nro_paquetes = nro_paquetes; }  //Establece el valor de _nro_paquetes
        
        Método tupla (getter):

            shared_ptr<Tupla> tupla() { return _tupla; }   //Devuelve el puntero compartido _tupla

        Método tupla (setter):

            void tupla(shared_ptr<Tupla> tupla) { _tupla = tupla; } // Establece el puntero compartido _tupla
        

Declaración de la clase Tupla:

    Definición de la clase Tupla:

        class Tupla {
    
            
    Miembros de Datos:

        uint32_t _id;               // ID de la tupla a nivel global de la Aplicación Storm.
        std::string _id_tramo;      // ID de la tupla en el tramo que se envía entre un bolt y otro.
        uint32_t _nro_tupla;        // Número de tupla emitido por un determinado nodo, distingue tuplas con el mismo ID, ocurre cuando hay fork (Bolt con dos destinos).
        uint32_t _copia;            // Copia de la tupla, cuando un bolt emite más de una tupla por cada una que recibe (Ej: Splitter).
        double _tpo_hold;           // Tiempo de espera de la tupla.
        std::string _contenido;     // Contenido de la tupla.
        std::string _id_origen;     // ID de origen de la tupla.
        std::string _IP_origen;     // IP de origen de la tupla.
        std::string _id_destino;    // ID de destino de la tupla.
        std::string _IP_destino;    // IP de destino de la tupla.
  
        //IP destino es de la forma 10.pod_id.switch_id.host_id en base a la IP se hace el ruteo en los comm_switch.
        //Es por esta manera que (por facilidad de uso) se mantienen separados
        uint32_t pod_id;    // ID del pod.
        uint32_t switch_id; // ID del switch.
        uint32_t host_id;   // ID del host.

        uint32_t _copies;   // Número de copias de la tupla.
        uint32_t _tamanio;  // Tamaño de la tupla en Bytes.
        double _timestamp;  // Marca de tiempo de la tupla. Debe ser actualizado en cada arribo al Procesador

    Constructores:

        Constructor por defecto:
            Tupla() {}

            Constructor sin parámetros que no realiza ninguna acción

        Constructor Parametrizado:

            Tupla(uint32_t _id) {
                this->_id = _id;
                this->_id_tramo = "";
                this->_nro_tupla = 0; // ID a nivel local al Spout/Bolt
                this->_copia = 0;
                this->_tpo_hold = 0.01;
                this->_contenido = "";
                this->_id_origen = "";
                this->_IP_origen = "";
                this->_id_destino = "";
                this->_IP_destino = "";
                this->_copies = 0;
                this->_tamanio = 1000;
                this->_timestamp = 0.0;
            }

            Inicializa una tupla con un ID específico y establece valores por defecto para los demás miembros
        
        Constructor Parametrizado:

            Tupla(uint32_t _id, std::string _id_tramo, uint32_t _nro_tupla, uint32_t _copia, double _tpo_hold, string _contenido, string _id_destino, string _IP_destino, uint32_t _copies, uint32_t tamanio) {
                this->_id = _id;
                this->_id_tramo = _id_tramo;
                this->_nro_tupla = _nro_tupla;
                this->_copia = _copia;
                this->_tpo_hold = _tpo_hold;
                this->_contenido = _contenido;
                this->_id_destino = _id_destino;
                this->_IP_destino = _IP_destino;
                this->_copies = _copies;
                this->_tamanio = tamanio;
                this->_timestamp = 0.0;
            }

            Permite inicializar todos los miembros de la tupla con valores específicos
        
        Constructor de Copia:

            Tupla(const Tupla& tupla) {
                this->_id = tupla._id;
                this->_id_tramo = tupla._id_tramo;
                this->_nro_tupla = tupla._nro_tupla;
                this->_copia = tupla._copia;
                this->_tpo_hold = tupla._tpo_hold;
                this->_contenido = tupla._contenido;
                this->_id_destino = tupla._id_destino;
                this->_IP_destino = tupla._IP_destino;
                this->_copies = tupla._copies;
                this->_tamanio = tupla._tamanio;
                this->_timestamp = tupla._timestamp;
            }

            Inicializa una tupla copiando los valores de otra tupla existente
        
    Métodos Getter y Setter:

        uint32_t id() { return _id; }
        void id(uint32_t id) { _id = id; }

        std::string id_tramo() { return _id_tramo; }
        void id_tramo(std::string id_tramo) { _id_tramo = id_tramo; }

        uint32_t nro_tupla() { return _nro_tupla; }
        void nro_tupla(uint32_t nro_tupla) { _nro_tupla = nro_tupla; }

        uint32_t copia() { return _copia; }
        void copia(uint32_t copia) { _copia = copia; }

        double tpo_hold() { return _tpo_hold; }
        void tpo_hold(double tpo_hold) { _tpo_hold = tpo_hold; }

        string contenido() { return _contenido; }
        void contenido(string contenido) { _contenido = contenido; }

        string id_origen() { return _id_origen; }
        void id_origen(string id_origen) { _id_origen = id_origen; }

        string IP_origen() { return _IP_origen; }
        void IP_origen(string IP_origen) { _IP_origen = IP_origen; }

        string id_destino() { return _id_destino; }
        void id_destino(string id_destino) { _id_destino = id_destino; }

        string IP_destino() { return _IP_destino; }
        void IP_destino(string IP_destino) { _IP_destino = IP_destino; }

        uint32_t copies() { return _copies; }
        void copies(uint32_t copies) { _copies = copies; }

        uint32_t tamanio() { return this->_tamanio; }
        void tamanio(uint32_t tamanio) { this->_tamanio = tamanio; }

        double timestamp() { return this->_timestamp; }
        void timestamp(double timestamp) { this->_timestamp = timestamp; }

        Los métodos getter y setter permiten acceder y modificar los miembros de datos de la clase
