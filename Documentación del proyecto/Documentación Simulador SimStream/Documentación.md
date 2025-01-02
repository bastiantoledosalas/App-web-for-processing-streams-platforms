Documentación:

    Parametros que recibe el Simulador:

        Parametros obligatorios:

            '-t'    :   Si el argumento es -t, se almacena el argumento (archivo de texto que contiene las relaciones de los nodos) y se  indica que la opción -t fue proporcionada

                Ejemplo:

                    ./Simulator -t topology.txt

                    donde:

                        topology.txt es el archivo que contiene las relaciones de cada nodo
            

            '-n'    :   Si el argumento es -n, se almacena el argumento (archivo de texto que contiene la descripción detallada de cada nodo) y el simulador por dentro al recibir este parametro indica que la opción
                        -n fue proporcionada
            
                    Ejemplo:

                        ./Simulator -t topology.txt -n nodos.txt

                        donde:

                            nodos.txt es el archivo que contiene la descripción detallada de cada nodo

            '-p'    :   Si el argumento es -p, se almacena el valor en la variable qty_tuples y el simulador por dentro al recibir este parametro indica que la opción -n fue proporcionada

                Ejemplo:

                    ./Simulator -t topology.txt -n nodos.txt -p 10

                    donde:

                        10 es el valor que indica que se deben generar 10 tuplas y este valor será almacenado en la variable qty_tuples en el codigo del simulador
                    
        
        Parametros Opcionales:

            '-l'    :   Si el argumentos es -l, se almacena el valor en la variable simulation_time y se almacena como un valor double
                        Si no se proporciona este valor, el simulador tiene un valor predefinido como default:

                        double simulation_time = 1000e100;
                
                Ejemplo:

                    ./Simulator -t topology.txt -n nodos.txt -p 10 -l 100

                    donde:

                        100 es el valor que indica el tiempo de simulación sobreescribiendo el valor predefinido anteriormente y al ser almacenado en una variable de tipo double este valor 100 se convierte en

                        ESTE VALOR DEBE SER MAYOR A 0 Y NO DEBE SER NEGATIVO

            '-r'    :   Si el argumento es -r, se almacena el valor en la variable 'arrival_rate_file' y el simulador por dentro al recibir este parametro indica que la opción -r fue proporcionada

                Ejemplo:

                    ./Simulator -t topology.txt -n nodos.txt -p 10 -l 100 -r arrivale_rate_file.txt

                    donde:

                        arrival_rate_file.txt es el archivo que contiene valores que representan la tasa de arribo cuando esta debe variar durante la simulacion
        

    Consideraciones Importantes:

        el archivo topology.txt se lee linea por linea e ignora todas las lineas que tengan # al inicio:

            Ejemplos de Entradas de linea:

                    nodo1 nodo2         #valido

                    nodo1               #invalido: solo un valor

                    nodo1 nodo2 nodo3   #invalido: más de 2 valores por linea

                    nodo1,nodo2         #invalido: se usa una coma como separador en lugar de un espacio

                    nodo1   nodo2\n     #invalido: tiene caracteres especiales no esperados

                     # Comentario con espacios iniciales: se puede interpretar como inválido puesto que tiene un espacio antes del caracter # y esa linea debe comenzar con un # como primer caracter

        
        el archivo nodes.txt se lee linea por linea e ignora todas las lineas que tenga # al inicio:

            En el caso de este archivo se sigue la misma logica utilizada para topology.txt puesto que utiliza el mismo sistema de validación y lectura

            Una regla interna que tiene el simulador es que el campo tipo, debe ser S o B, no puede ser otro caracter:

            #nombre_nodo        tipo    nivel_replicación   tipo_agrupamiento       Procesador      Tiempo_Promedio_Servicio    Tasa_de_Arribo
            nodo1               C            1                 0                   10.0.0.2            fixed(0.0)                  expon(-1.0389139971820532e-11,0.024674476149550005)

                ESTE CASO ES INVALIDO, puesto que el tipo no es S o B en MAYUSCULAS

            #nombre_nodo        tipo    nivel_replicación   tipo_agrupamiento       Procesador      Tiempo_Promedio_Servicio    Tasa_de_Arribo
            nodo1               s            1                 0                   10.0.0.2            fixed(0.0)                  expon(-1.0389139971820532e-11,0.024674476149550005)
                
               ESTE CASO ES INVALIDO, puesto que el tipo no esta en mayusculas (S o B en mayusculas)

            #nombre_nodo        tipo    nivel_replicación   tipo_agrupamiento       Procesador      Tiempo_Promedio_Servicio    Tasa_de_Arribo
            nodo1               S            1                 0                   10.0.0.2            fixed(0.0)                  expon(-1.0389139971820532e-11,0.024674476149550005)

                ESTE CASO ES VALIDO, PUESTO QUE LLEVA LA S EN MAYUSCULAS

            OTRA REGLA INTERNA QUE TIENE EL SIMULADOR ES QUE EL CAMPO DE REPLICACIÓN DEBE SER MAYOR A 0:

            Ejemplo de Entradas de linea:

            #nombre_nodo        tipo    nivel_replicación   tipo_agrupamiento       Procesador      Tiempo_Promedio_Servicio    Tasa_de_Arribo
            nodo1               S            0                  0                   10.0.0.2            fixed(0.0)                  expon(-1.0389139971820532e-11,0.024674476149550005)

                ESTE CASO ES INVALIDO, puesto que el nivel de replicación no puede ser 0, debe ser mayor
            
            #nombre_nodo        tipo    nivel_replicación   tipo_agrupamiento       Procesador      Tiempo_Promedio_Servicio    Tasa_de_Arribo
            nodo1               S            1                 0                   10.0.0.2            fixed(0.0)                  expon(-1.0389139971820532e-11,0.024674476149550005)

                ESTE CASO ES VALIDO, puesto que el nivel de replicación es mayor a 0, en este caso 1 para el nodo1

            OTRA REGLA INTERNA QUE TIENE EL SIMULADOR ES QUE EL CAMPO DE AGRUPAMIENTO TIENE VALORES PREDEFINIDOS FIJOS:

                - '0':  REPRESENTA SHUFFLE_GROUPING QUE REALIZA ROUND ROBIN SOBRE ELEMENTOS DE DESTINO (NODOS BOLTS)
                - '1':  REPRESENTA FIELD_GROUPING QUE REALIZA QUE REALIZA UN TIPO "HASH" PARA DETERMINAR EL NODO DESTINO (NODOS BOLTS)
                - '2':  REPRESENTA GLOBAL_GROUPING QUE NO REALIZA NINGUNA OPERACIÓN Y SOLAMENTE DEVUELVE UN VALOR FIJO:

                        RETORNA 1e-9 EN FORMATO DOUBLE

                - '3':  REPRESENTA _ALL_GROUPING QUE NO REALIZA NINGUNA OPERACIÓN Y SOLAMENTE DEVUELVE UN VALOR FIJO:

                        RETORNA 1e-9 EN FORMATO DOUBLE

                NO SE DEBEN ACEPTAR POR TANTO VALORES FUERA DEL RANGO PREESTABLECIDO [0,1,2,3] DE OPCIONES PARA ESTE CAMPO
            
            OTRA REGLA INTERNA QUE TIENE EL SIMULADOR ES SOBRE EL CAMPO DONDE SE INDICA EL PROCESADOR A CARGO DEL NODO (PROCESSOR):

                - En este caso se debe cumplir que el formato de la IP entregada sea de la forma:

                            x.x.x.x

                            Por ejemplo:

                                10.100.10.1 


            Otra regla interna que tiene el simulador se aplica para los nodos Spout respecto al campo de Tiempo_Promedio_Servicio:

                Estas son las distribuciones que acepta este campo para los nodos Spout:

                    - spline    :   La distribución "spline" recibe la ruta con el nombre del archivo que contiene los valores 
                                    para la creación de una spline
                    
                                    Ejemplo de valores validos:

                                        spline(archivo.txt) #en este caso el simulador busca el archivo en la ruta donde se esta ejecutando

                                    Los valores validos que recibe de este archivo de texto son los siguientes:

                                    1.0
                                    2.5
                                    3.75

                                    #TODOS ESTOS VALORES SON LEIDOS CON el método fscanf que lee valores de punto flotante '%lf' y este retorna un valor double
                                        
                                    Valores no validos: 

                                    abc
                                    1.0, 2.5, three


                    - fixed     :   La distribución "fixed" recibe un valor y devuelve ese valor constante predefinido
                                    El valor que recibe "fixed" es un valor de tipo double

                                    Ejemplo de Valores Validos:
                                            
                                                fixed(1.0)          -> Retorna 1.0
                                                fixed(0.0)          -> Retorna 0.0
                                                fixed(10)           -> Retorna 10
                                                fixed(-5.5)         -> Retorna -5.5
                                                fixed(3.14,2,1)     -> Retorna 3.14  #Este caso no se deberia aceptar

                                    Ejemplo de Valore Invalidos:

                                                fixed()
                                                fixed
                                                fixed(abc)

                    - chi2      :   La distribución "chi2" recibe 3 valores, los almacena como valores de tipo double y los identifica por el delimitador ',':

                                    Ejemplo de Valores Validos:

                                        chi2(3.00001, 0.123123, 12.3123) donde:

                                    values[0]: 2.0001       # Este valor se usa en conjunto con una seed aleatoria que el simulador genera
                                                            # ESTE VALOR DEBE SER IGUAL O MAYOR A 1

                                    values[1]: 12.00        # Este valor se usa para ajustar el factor de escala del valor devuelto por la distribución
                                    values[2]: 13.5         # Este valor se usa para ajustar el factor de desplazamiento del valor devuelto por la distribución

                                    internamente se hace lo siguiente:
                                    
                                    valor_aleatorio_distribución_chi_2 * value[1] + value[2]

                    - maxwell   :   La distribución "maxwell" recibe 2 valores, los almacena, procesa la función y el resulado lo multiplica por estos valores:

                                    Ejemplo de Valores Validos:

                                        maxwell(2.0,3.0) donde:

                                        Para esta distribución se toma una semilla que el simulador genera la distribución de maxwell y valores predefinidos
                                    
                                    values[0]: 2.0      # este valor se usa para ajustar el factor de escala del valor devuelto por la distribución 
                                    values[1]: 3.0      # este valor se usa para ajustar le factor de desplazamiento del valor devuelto por la distribución

                                    internamente se hace lo siguiente:
                                    
                                    valor_aleatorio_distribución_maxwell * value[0] + value[1]

                    - expon     :   La distribución "expon" recibe 2 valores, los almacena como valores de tipo double y los identifica por el delimitador ',':

                                    Ejemplo de Valores Validos:

                                        expon(2.0,3.0) donde:

                                        Para esta distribución se toma una semilla que el simulador genera y la usa para la distribución exponencial y con valores predefinidos

                                    values[0]: 2.0      # este valor se usa para ajustar el factor de escala del valor devuelto por la distribución
                                    values[1]: 3.0      # este valor se usa para ajustar el factor de desplazamiento del valor devuelto por la distribución

                                    internamente se hace lo siguiente:
                                    
                                    valor_aleatorio_distribución_exponencial * value[0] + value[1]

                    - invgauss  :   La distribución "invgauss" recibe 3 valores, los almacena como valores de tipo double y los identifica por el delimitador ',':

                                    Ejemplo de Valores Validos:

                                        invgauss(2.0,3.0,4.0) donde:

                                        Para esta distribución se toma una semilla que el simulador genera, el primer valor (2.0) y genera un valor para esta distribución

                                    values[0]: 2.0      # este valor se usa como el identificador mu que se usa en esta distribución
                                                        # ESTE VALOR PUEDE SER IGUAL O MAYOR A 0.0

                                    values[1]: 3.0      # este valor se usa para ajustar el factor de escala del valor devuelto por la distribución
                                    values[2]: 4.0      # este valor se usa para ajustar el factor de desplazamiento del valor devuelto por la distribución

                                    internamente se hace lo siguiente:

                                    valor_aleatorio_distribución_invgauss * values[1] + values[2]

                    - norm      :  La distribución "norm" recibe 2 valores, los almacena como valores de tipo double y los identifica por el delimitador ',':

                                    Ejemplo de Valores Validos:

                                        norm(2.0,3.0) donde:

                                        Para esta distribución se toma una semilla que el simulador genera y la usa para distribución norm con valores predefinidos

                                    values[0]: 2.0      # este valor se usa para ajustar el factor de escala del valor devuelto por la distribución
                                    values[1]: 3.0      # este valor se usa para ajustar el factor de desplazamiento del valor devuelto por la distribución

                                    internamente se hace lo siguiente:

                                    valor_aleatorio_distribución_invgauss * values[0] + values[1]
                                
                    - lognorm   :   La distribución "lognorm" recibe 3 valores, los almacena como valores de tipo double y los identifica por el delimitador ',':

                                    Ejemplo de Valores Validos:

                                        lognorm(2.0,3.0,4.0) donde:

                                        Para esta distribución se toma una semilla que el simulador genera y se usa el primer valor (2.0) para generar esta distribución
                                    
                                    values[0]: 2.0      # este valor se usa para generar el valor de la distribución lognorm
                                                        # ESTE VALOR DEBE SER IGUAL O MAYOR A 0.0

                                    values[1]: 3.0      # este valor se usa para ajustar el factor de escala del valor devuelto
                                                        por la  distribución

                                    values[2]: 4.0      # este valor se usa para ajustar el factor de desplzamiento del valor devuelto
                                                        por la distribución

                TODAS LAS DISTRIBUCIONES PARA EL CAMPO TIEMPO PROMEDIO DE SERVICIO DE UN NODO SPOUT RETORNA VALORES DOUBLE

                ESTAS ULTIMAS REGLAS APLICADAS SOBRE EL CAMPO TIEMPO PROMEDIO DE SERVICIO SE APLICAN SOBRE EL CAMPO TASA_DE_ARRIBO

            CASO NODO BOLT: REVISIÓN DE REGLAS INTERNAS QUE SE DEBEN CUMPLIR:

                #Node_Name          Type   Replication   Grouping   Processor   NbrOutputTweets                 AvgServiceTime
                TwitterFilter       B           10          0       10.2.0.2   nbinom(1,0.26063,0.0,1.0)   expon(1.646999997256628e-05,0.00040570702420820206)

                Para este ejemplo nos centramos entonces en los ultimos 2 campos NbrOutputTweets y AvgServiceTime:

                    -NbrOutputTweets: Para este campo se tienen en cuenta las siguientes distribuciones:

                        -spline: Esta distribución funciona exactamente igual que para el campo Tiempo_Promedio_Servicio de un nodo Spout
                                 Pero transforma el resultado en un valor int

                        -fixed:     Esta distribución recibe un solo valor entero o double

                            Ejemplos de Validaciones:

                                    fixed(4)    # Valido, Se almacena como 4.0 y se retorna 4
                                    fixed(1.5)  # Valido, Se almacena como 1,5 y se retorna 1
                                    fixed(-2.9) # Invalido, puesto que se retornaria un valor negativo para crear salidas de Tweets

                            El valor debe ser positivo y mayor a 0

                        -bernoulli: Esta distribución recibe 3 valores enteros o double

                            Ejemplo de Validaciones:

                                    bernoulli(1.0,3.0,2.0) donde:

                                        value[0] = 1.0  #Este valor lo utiliza la distribución
                                                        #ESTE VALOR TIENE UN RANGO DE VALORES [0-1] o [0.0-1.0] Puesto que este valor indica el % de exito 0 no hay y 1 exito asegurado siempre

                                        value[1] = 1.5  #Este valor modifica la tasa de crecimiento o el rango del valor del resultado
                                        value[2] = 2.0  #Este valor modifica el desplzamiento que ajusta el punto de inicio del resultado

                        -geom:      Esta distribución recibe 3 valores

                            Ejemplo de Validaciones:

                                        geom(1.0,1.5,2.0) donde:

                                        values[0] = 1.0 #Este valor lo utiliza la distribución
                                                        #ESTE VALOR TIENE UN RANGO DE VALORES [0-1] o [0.0-1.0] Puesto que este valor indica el % de exito 0 no hay y 1 exito asegurado siempre

                                        values[1] = 1.5 #Este valor modifica la tasa de crecimiento o el rango del valor del resultado
                                        values[2] = 2.0 #Este valor modifica el desplazamiento que ajusta el punto de inicio del resultado

                        -nbinom:    Esta distribución recibe 4 valores, el primer valor es convertido a entero y luego pasados a la distribución

                            Ejemplo de Validaciones:

                                    nbinom(1.0,1.0,3.0,4.0) donde:

                                    values[0] = 1       #Este valor lo utiliza la distribución
                                                        #ESTE VALOR REPRESENTA EL NÚMERO DE INTENTOS, DEBE SER MAYOR O IGUAL A 1

                                    values[1] = 1.0     #Este valor lo utiliza la distribución
                                                        #Este valor indica la probabilidad de exito, TIENE UN RANGO DE VALOR ENTRE [0-1] o [0.0-1.0]

                                    values[2] = 3.0     #Este valor modifica la tasa de crecimiento o el rango del valor del resultado
                                    values[3] = 4.0     #Este valor modifica el desplazamiento que ajusta el punto de inicio del resultado

                    TODAS LAS DISTRIBUCIONES DE AQUI DEVUELVEN UN VALOR DE TIPO INT que deberia ser mayor a 0, por tanto todos los valores deben ser positivos

                
                CASO NODO BOLT CAMPO TIEMPO_PROMEDIO DE SERVICIO:

                    AQUI SE REPITE EL MISMO COMPORTAMIENTO QUE TIENE UN NODO SPOUT EN EL CAMPO TIEMPO_PROMEDIO_SERVICIO PUESTO QUE SE EJECUTA DE LA MISMA FORMA

