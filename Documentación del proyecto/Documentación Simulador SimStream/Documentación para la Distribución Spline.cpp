Documentación para la Distribución Spline:


    -La distribución estadistica implementada llamada "spline" presenta ciertas diferencias respecto a otras distribuciones:

        -Esta distribución se encuentra implementada tanto para el método "gen_continuous" como para el método "gen_discrete"

            En el caso del método gen_discrete el valor retornado es convertido a un valor entero de tipo int
            En el caso del método gen_continuous el valor retornado es de tipo double

        -Esta distribución funciona de la siguiente forma:

            -En la clase Wrapper se declara un mapa interno:
                
                std::map<std::string,std::tuple<int,int,tk::spline>> _spline
                
                Este mapa almacena las curvas spline que ya han sido creada para evitar tener que reconstruirlas cada vez que se necesiten
                La clave de este mapa es el nombre del archivo "_params" y el valor es la spline generada a partir de los datos de ese archivo "_params"
        
            -Antes de crear una spline, el primer paso una vez es llamado el método spline es la verificación de la existencia de una spline creada y almacenada en el mapa para los datos del archivo "_params"
            -Esta verificación se realiza con la instrucción:

                if (this->_spline.count(_params) == 0)

                Aqui se esta comprobando si la clave "_params" (el nombre del archivo de parámetros) no existe en el mapa "_spline":
                    Si count(_params) es 0 entonces no hay una spline ya creada para ese archivo
                
                De no existir la spline en el mapa, es decir, no ha sido cargada antes, el método procede a abrir el archivo "_params" y leer los datos
                Los datos leídos del archivo son usados para crear la spline. Estos datos suelene ser puntos de un gráfica(valores de x e y) que la spline utilizará para interpolar

            -Una vez que se crea la spline a partir de los datos del archivo "_params" se guarda en el mapa "_spline" bajo la clave "_params"
                Esto significa que la próxima vez que se necesite usar la spline generada a partir del mismo archivo, ya no será necesario volver a leer los datos del archivo, puesto que la spline ya está almacenada en el mapa
                y se puede reutilizar

    Ejemplo:

        Se tiene lo siguiente en un archivo nodes.dat:

            - KafkaSpout            S   10   0   10.0.0.2   spline(0.0)                  spline(data1.txt)
            - TwitterFilter         B   10   0   10.0.0.2   fixed(0.0)                  spline(data2.txt)

        Cada archivo "data1.txt" y "data2.txt" contiene diferentes puntos para generar diferentes splines

            Si se llama al método spline("data1.txt") el programa primero buscará si ya existe una spline generada para "data1.txt" en el mapa "_spline"
                Si no existe, el programa abrirá el archivo "data1.txt", leerá los datos y creará la spline, finalmente la almacenará en _spline["data1.txt"]

            Si después se vuelve a llamar al método spline("data1.txt") el programa no volverá a abrir el archivo "data1.txt" ni leerá los datos nuevamente
                Simplemente tomará la spline previamente almacenada en el mapa "_spline["data1.txt"]" y la utilizará directamente

            