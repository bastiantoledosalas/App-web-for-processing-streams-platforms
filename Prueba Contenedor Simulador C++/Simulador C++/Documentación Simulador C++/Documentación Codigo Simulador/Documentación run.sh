Documentación Script de Shell:

        #!/bin/bash 

            Esta primera linea indica que el script debe ser ejecutado usando el intérprete de comandos 'bash'

    Definición de Variables:

        TOPOLOGY=$1         Captura el primer argumento pasado al script
                            Representa la topología para el simulador
        NODES=$2            Captura el segundo argumento pasado al script
                            Representa el número de nodos para el simulador
        LENGTH=$3           Captura el tercer argumento pasado al script
                            Representa la longitud del simulador
    
    Definición de la Ruta del Simulador:

       PATH_TO_SIM="/home/storm-simulator"      Define la ruta donde se encuentra el ejecutable del simulador
                                                Utilizado para construir el comando para ejecutar el simulador
 
    Mostrar el Comando a Ejecutar (Opcional):

        echo $PATH_TO_SIM"./Simulador -t $TOPOLOGY -n $NODES -l $LENGTH"

        Detalle:
            echo        Imprime el comando que se va a ejecutar en la terminal
                        Permite verificar el comando antes de su ejecución
                        Muestra como se construye el comando que se va a ejecutar con los parámetros dados
    
    Ejecución del Simulador:

        srun -A bastian -n 1 /home/storm-simulator/Simulador -t $TOPOLOGY -n $NODES -l $LENGTH > salida.dat

        Detalle:
                srun        Comando para ejecutar tareas en un clúster que usa el sistema de gestión de recursos 'Slurm'
                            Ejecuta el simulador en el clúster con la configuración especificada

            Opciones:
                -A bastian              Especifica el nombre del proyecto o cuenta bajo la cual se ejecuta la tarea
                -n 1                    Indica el número de tareas o nodos que se deben usar para la ejecución. En este caso 1 tarea
                Ruta ejecutable         /home/storm-simulator/Simulador indica la ruta del archivo ejecutable 'Simulador'
            
            Argumentos Simulador:
                -t $TOPOLOGY            Especifica la topología para el simulador
                -n $NODES               Especifica el número de nodos para el simulador
                -l $LENGTH              Especifica la longitud para el simulador

            Redirección de salida:
                > salida.dat            Redirige la salida estandar del comando al archivo 'salida.dat'
                                        Guarda el resultado del simulador en un archivo para su revisión posterior

    Proposito General:

        El script está diseñado para ejecutar un simulador en un entorno de clúster. Configura el entorno, define parámetros de entrada para el simulador a través de argumentos, 
        y luego utiliza srun para ejecutar el simulador con esos parámetros. Finalmente, redirige la salida del simulador a un archivo de datos (salida.dat)
        La impresión del comando (comentada) ayuda a verificar que el comando para ejecutar el simulador esté correctamente formado antes de su ejecución.         




