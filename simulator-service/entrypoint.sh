#!/bin/bash

# Check if mandatory parameters are provided
if [[ -z "$1" || -z "$2" || -z "$3" ]]; then
  echo "Error: Missing required parameters."
  echo "Usage: -t <topology_file> -n <nodes_file> -p <number_of_tuples>"
  exit 1
fi

# Initialize default optional parameters
SIMULATION_TIME=""
ARRIVAL_RATE_FILE=""

# Parse all parameters
while [[ $# -gt 0 ]]; do
  case "$1" in
    -t)
      TOPOLOGY_FILE="$2"
      shift 2
      ;;
    -n)
      NODES_FILE="$2"
      shift 2
      ;;
    -p)
      NUM_TUPLES="$2"
      shift 2
      ;;
    -r)
      ARRIVAL_RATE_FILE="-r $2"
      shift 2
      ;;
    -l)
      SIMULATION_TIME="-l $2"
      shift 2
      ;;
    *)
      echo "Unknown parameter: $1"
      exit 1
      ;;
  esac
done

# Check if the mandatory parameters have been set
if [[ -z "$TOPOLOGY_FILE" || -z "$NODES_FILE" || -z "$NUM_TUPLES" ]]; then
  echo "Error: -t, -n, and -p are required parameters."
  exit 1
fi

# Run the simulator with the provided and optional parameters
./Simulador -t "$TOPOLOGY_FILE" -n "$NODES_FILE" -p "$NUM_TUPLES" $ARRIVAL_RATE_FILE $SIMULATION_TIME > salida.dat

# Optionally, display or process the output as needed
cat salida.dat
