Documentación de la Clase wrapper.h:

    Definición de cabeceras:

        #ifndef _WRAPPER_H_     Asegura que el contenido del archivo de cabecera solo se incluya una vez durante la compilación
        #define _WRAPPER_H_     Evitando múltiples inclusiones del mismo archivo que pueden causar errores de redefinición
    
    Inclusión de bibliotecas:

        #include <chrono>       Proporciona herramientas para medir y manipular duraciones y puntos en el tiempo
        #include <string.h>     Proporciona herramientas para manipular y manejar cadenas de caracteres (char*)
        #include <iostream>     Permite el uso de 'std::cout', 'std::cin' y otros flujo de entrada/salida
        #include <map>          Proporciona la clase 'std::map' y permite almacenar pares clave-valor ordenados
        #include <random>       Proporciona herramientas para generar números aleatorios y distribuciones aleatorias
        #include "prob.h"       Contiene definiciones y declaraciones relacionadas con probabilidades o distribuciones que serán utilizadas en 'wrapper.h'
        #include "spline.h"     Contiene definiciones y declaraciones relacionadas con splines que serán utilizadas en 'wrapper.h'

    Declaración de la clase 'Wrapper':
        
        class Wrapper
    
            Proposito:
                Define la clase 'Wrapper' que encapsula la funcionalidad para generar valores aleatorios basados en diferentes distribuciones
    
        Miembros Privados:
        
            private:
                int _seed;
                std::map<std::string, std::tuple<int, int, tk::spline>> _spline;
            
            Deglose:

                _seed           Variable de tipo 'int' encargada de guardar la semilla para la generación de números aleatorios
                _spline         Mapa que asocia nombres de funciones 'spline' a tuplas que contienen un par de enteros y un objeto 'tk::spline'
                                Además este mapa contiene 3 elementos donde cada clave está asociada con una tupla que contiene 3 valores:

                    Parámetros de (std::tuple<int,int,tk::spline>):
                        int             El primer elemento de la tupla representa el valor inicial del rango de índices en el que se puede evaluar el 'spline'
                                        Se utiliza en la generación de números aleatorios para determinar el punto de inicio del rango
                        int             El segundo elemento de la tupla representa el valor final del rango de índices del 'spline'
                                        En conjunto con el primer entero, se define el rango de índices posibles en los que el 'spline' puede ser evaluado
                        tk::spline      Objeto de la clase 'tk::spline'
                                        'tk::spline' es una clase que representa una spline(función de interpolación) de la biblioteca 'tk'  
                                        El spline permite generar valores interpolados a partir de un conjunto de datos discretos
        Miembros Publicos:

            public:

            Constructor por Defecto:

                Wrapper(void) {                                                                
                    this->_seed = std::chrono::system_clock::now().time_since_epoch().count();  
                }

                Deglose:
                    Parámetro:                          El constructor por defecto no contiene ningún parámetro de entrada (void)
                    this->_seed                         Inicializado con el valor de la cantidad de tiempo en milisegundos desde el epoch(1 de enero de 1970) hasta el momento actual
                    std::chrono::system_clock::now()    Obtiene el tiempo actual del sistema
                    time_since_epoch().count()          Devuelve el número de unidades de tiempo desde el epoch

                Propósito General:
                    Inicializar el valor de _seed con un valor único basado en el tiempo actual para usarlo como semilla en generadores de números aleatorios
                
            Constructor de Copia:

                Wrapper(const Wrapper &_wrapper) {
                    this->_seed = _wrapper._seed;
                }

                Deglose:
                    Parámetro:          'const Wrapper &_wrapper' es una referencia constante a un objeto de tipo 'Wrapper'
                    this->_seed         Inicializado con el valor de '_seed' del objeto '_wrapper' pasado como parámetro
                                        Crea una nueva instancia de 'Wrapper' copiando la semilla '_seed' de otro objeto 'Wrapper'

            Operador de Asignación:
                
                Wrapper& operator=(const Wrapper &_wrapper) {
                    this->_seed = _wrapper._seed;
                    return (*this);
                }

                Deglose:
                    Parámetro:          'const Wrapper &_wrapper' es una referencia constante a un objeto de tipo 'Wrapper'
                    this->_seed         Inicializado con el valor de '_seed' del objeto '_wrapper' pasado como parámetro
                    return(*this)       Retorna una referencia a la instancia actual de 'Wrapper'
                                        Permite la asignación de un objeto 'Wrapper' a otro, copiando la semilla '_seed' del objeto derecho al objeto izquierdo
            Destructor:

                ~Wrapper(void) {
                }

                Propósito General:
                    Limpiar cualquier recurso que 'Wrapper' podría haber asignado durante su vida útil
                    No se necesita ninguna acción específica, por lo que el cuerpo está vacío
            
            Método 'double gen_continuous( const std::string &_function)':

                Declaración de la función:

                    double gen_continuous(const std::string &_function)

                    Propósito General:
                        Generar un número aleatorio basado en una distribución especificada por la cadena '_function'
                
                Copia de la cadena de entrada:

                    std::string copy_function = _function;

                    Propósito General:
                        Crear una copia de '_function' para manipularla sin alterar la original

                Extracción del nombre de la distribución:

                    char *distribution = strtok((char*)copy_function.c_str(), "()");

                    Deglose:
                        char *distribution              Almacenar un puntero a la primera parte de la cadena (el nombre de la distribución, por ejemplo "spline" o "chi2")
                        strtok                          Función utilizada para dividir una cadena en tokens (subcadenas) basados en delimitadores especificados
                        ((char*)copy_function.c_str()
                        Deglose:
                            char*                       Convierte un puntero a const char en un puntero a char
                                                        Esto es necesario porque la función 'strtok' necesita un puntero char para modificar la cadena original
                                                        Mientras que la función 'copy_function.c_str()' devuelve un puntero const char
                            copy_function.c_str()       Devuelve un puntero a una cadena C(null-terminated) que representa el contenido de la cadena 'copy_function'
                            "()"                        Especificar los caracteres delimitadores que 'strtok' utilizará para dividir la cadena

                    Propósito General:
                         Esta línea de código se utiliza para extraer el nombre de la distribución de una cadena de entrada 
                         que describe una función de generación de números aleatorios con su distribución y parámetros
                         La entrada tiene un formato como 'distribution(params)'
                
                Proceso de Tokenización para parametros de distribución:

                    char *params = strtok(NULL, "()");
                    vector<double> values;
                    
                    Deglose:
                        char *params    Variable encargada de almacenar un puntero a la segunda parte de la cadena(los parámetros de la distribución)
                        strtok          Función utilizada para dividir una cadena en tokens (subcadenas) basados en delimitadores especificados
                        NULL            Cuando se pasa NULL como primer argumento a strtok, la función continúa tokenizando la cadena que se pasó en la llamada anterior
                                        En este caso, continúa tokenizando la cadena que se pasó en la llamada anterior a strtok (que extrajo el nombre de la distribución)
                        "()"            Especificar los caracteres delimitadores que strtok utilizará para dividir la cadena. En este caso, strtok buscará tanto ( como )
                        vector<double>  Define un contenedor de la biblioteca estándar de C++ que puede almacenar una colección de valores de tipo double
                        values          Almacena los valores extraídos de los parámetros de la distribución. Inicializa un vector vacío de tipo double
                    
                Generación de Valores Aleatorios para una Distribución "spline" :

                    //Este vector declarado como 'values' almacena número de tipo 'double' extraídos de la cadena 'params' cuando se parsean lo valores de los parámetros de la distribución que se desea generar
                    vector<double> values;

                    if(!strcmp(distribution, "spline")){
                        return this->spline(params);
                    }

                    Deglose:
                        if(!strcmp(distribution, "spline")) //Se verifica si la cadena 'distribution es igual a "spline"
                                                            //La función strcmp se utiliza para comparar cadenas de caracteres (tipo char*) y retorna 0 si las cadenas son idénticas y se invierte el resultado
                                                            //Convirtiendo el valor 0 en true y cualquier otro valor en false
                        return this->spline(params)         //Si el if devuelve un true se llama al método 'spline' con el argumento 'params' que contiene los parametros necesarios para la generación de un valor basado en la distribución spline
                                                            //Este método 'spline' genera y retorna un valor 'double'
                
                Parseo de Parámetros y Determinación de la Distribución:

                    char *token = strtok(params, ",");
                    while (token != NULL) {
                        values.push_back(std::stod(token));
                        token = strtok(NULL, ",");
                    }

                    Deglose:
                       char *token = strtok(params, ",");   //Se utiliza la función strtok para dividir la cadena 'params' en subcadenas o tokens separados por comas ','
                                    strtok                  //Devuelve un puntero al primer token en la cadena 'params', es decir, la primera subcadena antes de la primera coma
                                    params                  //Cadena de caracteres que contiene parámetros para una distribución y estos parametros estan separados por comas
                                                            //La primera vez que se llama a strtok se le pasa la cadena original 'params' y en llamadas posteriores se debe pasar 'NULL' para continuar con el mismo análisis
                        while (token !=NULL)                //Comienza un bucle 'while' que continuá mientras 'token' no sea 'NULL'
                                                            //El bucle se repetirá hasta que 'strtok' no pueda encontrar más tokens en la cadena, es decir, hasta que se haya procesado toda la cadena 'params'
                        values.push_back(std::stod(token))  //Convierte el token actual a un número de tipo 'double' usando 'std::stod' y lo agrega al vector 'values'
                            std::stod(token)                //Convierte la cadena 'token' en un número 'double'
                            values.push_back()              //Añade este número al final del vector 'values'
                        token = strtok(NULL,",")            //Obtiene el siguiente token en la cadena original 'params' que está separado por una coma
                                                            //Este proceso se repite hasta que no quedan más token y 'token' se convierte en 'NULL'
                            
                Elección de Distribucines:

                        Distribución fixed:

                            if(!strcmp(distribution,"fixed"))   //Verifica si la distribución especificada en la cadena 'distribution' es "fixed"
                                                                //Si la distribución es "fixed" entonces se retorna el primer valor del vector 'values' convertido a un entero
                                                                //La distribución "fixed" devuelve un valor constante predefinido
                        
                        Distribución chi2:

                            else if(!strcmp(distribution,"chi2"))                   //Verifica si la distribución especificada en la cadena 'distribution' es "chi2"
						        return(this->chi2(values[0],values[1],values[2]));  //Se llama al método 'chi2' de la clase Wrapper con 3 parámetros extraídos del vector values: values[0],values[1],values[2]
					    
                        Distribución maxwell:

                            else if(!strcmp(distribution,"maxwell"))                //Verifica si la distribución especificada en la cadena 'distribution' es "maxwell"
						        return(this->maxwell(values[0],values[1]));         //Se llama al método 'maxwell' de la clase Wrapper con 2 parámetros extraídos del vector values: values[0],values[1]
					    
                        Distribución expon:

                            else if(!strcmp(distribution,"expon"))                  //Verifica si la distribución especificada en la cadena 'distribution' es "expon"
						        return(this->expon(values[0],values[1]));           //Se llama al método 'expon' de la clase Wrapper con 2 parámetros extraídos del vector values: values[0],values[1]
					    
                        Distribución Gaussiana Inversa:

                            else if(!strcmp(distribution,"invgauss"))                   //Verifica si la distribución especificada en la cadena 'distribution' es "invgauss"
						        return(this->invgauss(values[0],values[1],values[2]));  //Se llama al método 'invgauss' con 3 parámetros del vector values: values[0],values[1],values[2]
					    
                        Distribución Normal:    

                            else if(!strcmp(distribution,"norm"))                   //Verifica si la distribución especificada en la cadena 'distribution' es "norm"
						        return(this->norm(values[0],values[1]));            //Se llama al método 'norm' con 2 parámetros del vector values: values[0],values[1]
                        
                        Distribución Log-Normal:

					        else if(!strcmp(distribution,"lognorm"))                    //Verifica si la distribución especificada en la cadena 'distribution' es "lognorm"
						        return(this->lognorm(values[0],values[1],values[2]));   //Se llama al método 'lognorm' con 3 parámetros del vector values: values[0],values[1],values[2]
                        
                        Distribuciones no Conocidas:

                            else{
                                std::cerr<<"Unknow distribution"<<distribution<<std::endl;  //Captura cualquier caso en el que 'distribution' no coincida con ninguna de las distribuciones conocidas como "fixed" o "bernoulli"
                                }                                                           //Se imprime un mensaje de error que indica que la distribución especificada es desconocida y el programa termina su ejecución
                            

            Método "int gen_discrete(const std::string &_function)":

                Declaración e Inicialización:

                int gen_discrete(const std::string &_function){                     //Método que devuelve un valor entero generado según la distribución especificada
					std::string copy_function = _function;
                    char *distribution=strtok((char*)copy_function.c_str(),"()");
					char *params=strtok(NULL,"()");
					vector<double> values;

                    Deglose:
                    _function           //std::string que contiene la especificación de la distribución
                    copy_function       //Copia de _function que se va a modificar
                    distribution        //Apunta a la parte de la cadena que especifica el nombre de la distribución elegida
                    params              //Apunta a la parte de la cadena que contiene los parámetros de la distribución ,por ejemplo bernoulli(0,0) params apuntaria a 0,0
                    values              //Vector que almacenará los parámetros convertidos a 'double'

                Elección de Distribuciones:

                    Distribución spline:

                    if(!strcmp(distribution,"spline")){     //Si 'distribution' es "spline" se llama al método 'spline' de la clase Wrapper con 'params' como argumento
						return(int(this->spline(params)));  //El resultado se convierte en un entero usando 'int' y se retorna
					}

                    Tokenización y Almacenamiento  de Parámetros:

					    char *token=strtok(params,",");         //Los parámetros en 'params' se tokenizan y se convierten a 'double' usando 'std:stod'
					    while(token!=NULL){                     //Cada valor se almacena en el vector 'values'
						    values.push_back(std::stod(token));
						    token=strtok(NULL,",");
					        }
                    
                    Distribución fixed:

					    if(!strcmp(distribution,"fixed"))   //Si 'distribution' es "fixed" se retorna un valor fijo: values[0] de tipo entero
						    return(int(values[0]));
					
                    Distribución bernoulli:

                        else if(!strcmp(distribution,"bernoulli"))                  //Si 'distribution' es "bernoulli" se llama al método bernoulli
						    return(this->bernoulli(values[0],values[1],values[2])); //Se llama al método 'bernoulli' con 3 parámetros del vector values: values[0],values[1],values[2]
					
                    Distribución geometrica:

                        else if(!strcmp(distribution,"geom"))                       //Si 'distribution' es "geom" se llama al método geom que corresponde a una distribución geometrica
						    return(this->geom(values[0],values[1],values[2]));      //Se llama al método 'geom' con 3 parámetros del vector values: values[0],values[1],values[2]

                    Distribución binomial Negativo:

					    else if(!strcmp(distribution,"nbinom"))                                 //Si 'distribution' es "nbinom" se llama al método nbinom que corresponde a una distribución binomial negativa
						    return(this->nbinom(int(values[0]),values[1],values[2],values[3])); //Se llama al método 'nbinom' con 4 parámetros del vector values: values[0],values[1],values[2],values[3]
					
                    Distribuciones no Conocidas:

                        else{
						    std::cerr << "Unknown distribution: " << distribution << std::endl; //Captura cualquier caso en el que 'distribution' no coincida con ninguna de las distribuciones conocidas como "fixed" o "bernoulli"
						    exit(EXIT_FAILURE);                                                 //Se imprime un mensaje de error que indica que la distribución especificada es desconocida y el programa termina su ejecución
					    }

        Métodos Privados:

            private:
                double spline(const string &_params){       //Método spline es de tipo privado, toma un parámetro '_params' y retorna un valor de tipo 'double'
                    static std::mt19937 rng(this->_seed);   //rng retiene su valor entre múltiples invocaciones del método 'spline'
                                                            //stD::mt19937 es un tipo de generador de números aleatorios que implementa el algoritmo Mersenne Twister
                }                                           //_seed se utiliza como semilla para el generador, determinando la secuencia de números aleatorios que 'rng' producirá
            
            Verificación de la Existencia del Spline:

                if(this->_spline.count(_params) == 0)       //El mapa 'spline' asocia el nombre de un archivo '_params' con un spline ya construido. Si el spline correspondiente a _params no está en el mapa, se procede a construirlo
            
            Lectura de Datos desde el Archivo:

                FILE *in=fopen(_params.c_str(),"r+t");      //Declara un puntero 'in' de tipo 'FILE' y se utilizará para gestionar el archivo que se va a abrir
                                                            //fopen abre un archivo y '_params.c_str()' convierte el objeto std::string '_params' en un puntero 'const char*' ya que fopen espera un nombre de archivo como una cadena de carateres estilo C
                                                            //"r+t" abre el archivo en modo lectura y escritura y el archivo debe existir previamente, el parametro 't' indica que el archivo se trata como un archivo de texto
				double x=0.0,y=0.0;                         //Se declaran las variables x e y de tipo double y seran utilizadas para almacenar temporalmente los valores de x e y leídos o calculados en el bucle            
				std::vector<double> X,Y;                    //Declara 2 vector double X e Y para almacenar los valores del eje x e y que se leen desde el archivo
                
                while(fscanf(in,"%lf",&y)!=EOF){            //El bucle se ejecuta hasta que 'fscanf' devuelva 'EOF' o el fin del archivo
                                                            //fscanf(in,"%lf",&y) lee un valor double del archivo 'in' y lo almacena en la variable 'y'
                                                            //"%lf" especifica que se debe leer un valor en coma flotante (double)
                                                            //&y pasa la dirección de 'y' para que el valor leído se almacene en esa variable
					Y.push_back(y);                         //Añade el valor 'y' leído al final del vector 'Y' 
					X.push_back(x);                         //Añade el valor 'x' leído al final del vector 'X'
					x+=1.0;}                                //Incrementa x en 1.0, esto asegura que 'x' siga aumentando con cada iteración del bucle, asignando un valor diferente de 'x' a cada 'y'
				fclose(in);                                 //Cierra el archivo asociado con el puntero 'in'
            
            Construcción del Spline:

                tk::spline s;       //Se crea un objeto 'tk::spline'
                s.set_points(X,Y)   //Se configura con los puntos 'X' e 'Y' utilizando el método 'set_points'

            Almacenamiento del Spline:

                this->_spline[_params] = std::tuple<int, int, tk::spline>(0, int(X.size()), s)  //El spline 's' recién creado se almacena en el mapa '_spline' bajo la clave '_params' y la tupla almacenada contiene:
                                                                                                //El índice inicial '0', el indice final 'int(X.size()), el objeto spline 's'
            
            Generación de un Valor Aleatorio:

                Creación de una distribución uniforme:

                    std::uniform_int_distribution<int> uniform(std::get<0>(this->_spline[_params]), std::get<1>(this->_spline[_params]) - 1);

                    Deglose Detallado:
                        std::uniform_int_distribution<int>          //Esta clase se utiliza para generar números enteros distribuidos uniformemente dentro de un rango especificado
                        uniform()                                   //Se crea un objeto 'uniform' de tipo std::uniform_int_distribution<int> que generará números enteros en un rango definido
                        std::get<0>(this->_spline[_params])         //_spline es un mapa que almacena splines asociados a diferentes parámetros
                                                                    //_params es una cadena de caracteres que se usa como clave para acceder al spline correspondiente en el mapa
                                                                    //std::get<0>(...) obtiene el primer elemento de un std::tuple. Este elemento es el límite inferior del rango de la distribución uniforme
                         std::get<1>(this->_spline[_params]) - 1    //Obtiene el segundo elemento del std::tuple que representa el límite superior del rango
                                                                    //'-1' ajusta el límite superior para que sea inclusivo en la distribución uniforme
                
                Generación de un número aleatorio y cálculo del spline:

                    return ((std::get<2>(this->_spline[_params]))(uniform(rng)));

                    Deglose Detallado:
                        std::get<2>             //Obtiene el tercer elemento del std::tuple almacenado en 'this->_spline[_params]
                        this->_spline[_params]  //Accede al spline asociado con '_params'
                        tk::spline              //El tercer elemento es un objeto tk::spline que es un interpolador spline capaz de calcular valores 'y' para cualquier valor 'x' dentro del rango del spline
                        uniform(rng)            //Genera un número aleatorio dentro del rango especificado usando el generado de números aleatorios 'rng'
                        rng                     //Es una instancia de std:mt19937 que es un generador de números pseudoaleatorios que fue declarado e inicializado anteriormente

                    Proposito General:
                        Se genera un número entero aleatorio: Se usa una distribución uniforme para seleccionar un índice aleatorio dentro del rango permitido por el spline.
                        Se evalúa el spline: El número generado aleatoriamente se usa como entrada para el spline, que calcula y devuelve un valor interpolado correspondiente.
                        Este proceso permite obtener un valor y aleatorio pero coherente con la curva definida por el spline, 
                        lo que es útil en simulaciones o cualquier aplicación que requiera generar datos distribuidos de acuerdo con una función predefinida.
        
        Método de la distribución continua chi2:

            double chi2(double a,double loc,double scale){          //Genera un valor aleatorio a partir de una distribución chi2 con 'a' grados de libertad
				return(chi_square_sample(a,this->_seed)*scale+loc);
			}

            Parametros de Entrada:
                double a
                double loc
                double scale

            Deglose Detallado:
                chi_square_sample(a, this->_seed):  Genera una muestra de una distribución chi-cuadrado, utilizando a como parámetro y this->_seed como la semilla del generador de números aleatorios
                *scale+loc                          Escala y desplaza la muestra generada: *scale multiplica la muestra por el valor 'scale' y '+loc' desplaza el resultado sumando 'loc'

        Método de la distribución continua Maxwell:

            double maxwell(double loc,double scale){                //Genera un valor aleatorio a partir de una distribución de Maxwell
				return(maxwell_sample(1.0,this->_seed)*scale+loc);
			}

            Parametros de entrada:
                double loc
                double scale

            Deglose Detallado:
                maxwell_sample(1.0,this->_seed)*scale+loc); Genera una muestra de una distribución de Maxwell con un parámetro estándar '1.0' y una semilla 'this->_seed'
                *scale + loc                                Ajusta la muestra con un factor de escala y un desplazamiento similar al método anterior

        Método de la distribución continua exponencial:

            double expon(double loc,double scale){              //Genera un valor aleatorio a partir de una distribución exponencial
				return(exponential_sample(0.0,1.0,this->_seed)*scale+loc);
			}

            Parametros de entrada:
                double loc
                double scale
            
            Deglose Detallado:
                exponential_sample(0.0,1.0,this->_seed)*scale+loc)      Genera una muestra de una distribución exponencial con una tasa de 1.0 y semilla this->_seed
                *scale + loc                                            Ajusta la muestra con un factor de escala y un desplazamiento similar al método anterior 
        
        Método de la distribución continua gaussiana inversa:

			double invgauss(double mu,double loc,double scale){     //Genera un valor aleatorio a partir de una distribución gaussiana inversa
				return(inverse_gaussian_sample(mu,1.0,this->_seed)*scale+loc);
			}

            Parametros de entrada:
                double mu
                double loc
                double scale

            Deglose Detallado:
                inverse_gaussian_sample(mu,1.0,this->_seed)*scale+loc); Genera una muestra de una distribución gaussiana inversa con parámetro mu y semilla this->_seed
                *scale + loc                                            Ajusta la muestra con un factor de escala y un desplazamiento similar al método anterior

        Método de la distribución continua normal:

    		double norm(double loc,double scale){                   //Genera un valor aleatorio a partir de una distribución normal
				return(normal_sample(0.0,1.0,this->_seed)*scale+loc);
			}

            Parametros de entrada:
                double loc
                double scale
            
            Deglose Detallado:
                normal_sample(0.0,1.0,this->_seed)*scale+loc)           Genera una muestra de una distribución normal estándar con media 0 y desviación estándar 1, utilizando `this->_seed` como semilla        
                *scale + loc                                            Ajusta la muestra con un factor de escala y un desplazamiento similar al método anterior

        Método de la distribución continua log-normal:

			double lognorm(double s,double loc,double scale){       //Genera un valor aleatorio a partir de una distribución logaritmica-normal
				return(log_normal_sample(0.0,s,this->_seed)*scale+loc);
    		}

            Parametros de entrada:
                double s
                double loc
                double scale
            
            Deglose Detallado:
                log_normal_sample(0.0,1.0,this->_seed)*scale+loc):      Genera una muestra de una distribución log-normal con media de 0 y desviación estándar s, utilizando this->_seed como semilla 
                *scale + loc                                            Ajusta la muestra con un factor de escala y un desplazamiento similar al método anterior

        Método de la distribución discreta binomial negativa:

			int nbinom(int a,double b,double loc,double scale){     //Genera un valor aleatorio entero 'int' a partir de una distribución binomial negativa
				return(int(binomial_sample(a,b,this->_seed)*scale+loc));
    		}

            Parametros de entrada:
                double a
                double b
                double loc
                double scale
            
            Deglose Detallado:
                (binomial_sample(a,b,this->_seed)*scale+loc)            Genera una muestra de una distribución binomial con a ensayos y probabilidad de éxito b, usando this->_seed como semilla         
                *scale + loc                                            Ajusta la muestra con un factor de escala y un desplazamiento similar al método anterior
                int(binomial_sample(a,b,this->_seed)*scale+loc)         Convierte la muestra ajustada a un entero

        Método de la distribución discreta geometrica:
			int geom(double a,double loc,double scale){             //Genera un valor aleatorio entero 'int' a partir de una distribución geometrica
				return(int(geometric_sample(a,this->_seed)*scale+loc));
		    }

            Parametros de entrada:
                double a
                double loc
                double scale
            
            Deglose Detallado:
                geometric_sample(a,this->_seed)*scale+loc)              Genera una muestra de una distribución geométrica con parámetro a (probabilidad de éxito en cada ensayo), utilizando this->_seed como semilla
                *scale + loc                                            Ajusta la muestra con un factor de escala y un desplazamiento similar al método anterior   
                int(geometric_sample(a, this->_seed) * scale + loc)     Convierte la muestra ajustada a un entero

        Método de la distribución discreta bernoulli:

        int bernoulli(double a,double loc,double scale){            //Genera un valor aleatorio entero 'int' a partir de una distribución bernoulli
			return(int(bernoulli_sample(a,this->_seed)*scale+loc));
		}

        Parametros de entrada:
                double a
                double loc
                double scale

        Deglose Detallado:
            bernoulli_sample(a, this->_seed):                           Genera una muestra de una distribución de Bernoulli con parámetro a (probabilidad de éxito), utilizando this->_seed como semilla
            *scale + loc                                                Ajusta la muestra con un factor de escala y un desplazamiento similar al método anterior
            int(bernoulli_sample(a, this->_seed) * scale + loc)         Convierte la muestra ajustada a un entero


        Resumen
            Cada una de estas funciones genera muestras de diferentes distribuciones de probabilidad y luego ajusta las muestras utilizando un factor de escala (scale) y un desplazamiento (loc).
            Esto permite la personalización de las distribuciones para que se ajusten a diferentes escenarios, utilizando la misma estructura de muestreo con diferentes parámetros.