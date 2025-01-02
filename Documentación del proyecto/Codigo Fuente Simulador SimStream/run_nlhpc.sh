#!/bin/bash

TOPOLOGY=$1    # Primer argumento: Topología
NODES=$2       # Segundo argumento: Nodos
LENGTH=$3      # Tercer argumento: Longitud

PATH_TO_SIM="/home/mmarin/ainostrosa/storm-simulator"

# Imprimir el comando que se va a ejecutar
echo $PATH_TO_SIM"/Simulador -t $TOPOLOGY -n $NODES -l $LENGTH"

# Ejecutar el simulador utilizando srun para la ejecución en un nodo
srun -n 1 /home/mmarin/ainostrosa/storm-simulator/Simulador -t $TOPOLOGY -n $NODES -l $LENGTH
