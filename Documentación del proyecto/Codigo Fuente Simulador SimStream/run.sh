#!/bin/bash

# SCRIPT PARA EJECUTAR EN CLUSTER

TOPOLOGY=$1    # Primer argumento: Topología
NODES=$2       # Segundo argumento: Nodos
LENGTH=$3      # Tercer argumento: Longitud

PATH_TO_SIM="/home/users/mauricio.marin/ainostrosa/storm-simulator"

# Imprimir el comando que se va a ejecutar
echo $PATH_TO_SIM"./Simulador -t $TOPOLOGY -n $NODES -l $LENGTH"

# Ejecutar el simulador utilizando srun para la ejecución en un nodo y redirigir la salida a salida.dat
srun -A mauricio.marin -n 1 /home/users/mauricio.marin/ainostrosa/storm-simulator/Simulador -t $TOPOLOGY -n $NODES -l $LENGTH > salida.dat
