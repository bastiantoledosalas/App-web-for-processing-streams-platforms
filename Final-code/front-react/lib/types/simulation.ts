export interface SimulationData {
  _id: string;
  name: string;
  description: string;
  nodes: Node[];
  edges: Edge[];
  status: string;
  user: string;
  createdAt: string;
  updatedAt: string;
  results: Results[];
}
export interface Results {
  arrivalRates: number[];
  numberTuples: number[];
  serviceTimes: number[];
  processors: Processor[];
  nodes: {
    name: string;
    utilization: number;
    throughput: number;
    replicas: number;
    node_details: NodeDetails[];
  }[];
  stadistics: {
    tuples_generated: number;
    tuples_processed: number;
    throughput_topology: number;
    avg_tuple_resp_time: number | null;
    total_simulation_time: number;
  }[];
}
export interface Node {
  id: string;
  type: string;
  data: NodeData;
  position: Position;
  measured: Measured;
  selected: boolean;
  dragging: boolean;
}

export interface NodeData {
  name: string;
  type: string;
  replicationLevel: number;
  groupType: string;
  processor: string;
  avgServiceTimeType: string;
  avgServiceTimeValue: string;
  arrivalRateType: string;
  arrivalRateValue: string;
}

export interface Position {
  x: number;
  y: number;
}

export interface Measured {
  width: number;
  height: number;
}

export interface Edge {
  source: string;
  target: string;
  type: string;
  data: EdgeData;
  id: string;
}

export interface EdgeData {
  duration: number;
  shape: string;
  path: string;
}

export interface Processor {
  name: string;
  in_use: number;
  averageMemory: number;
  maxMemory: number;
  accesses: number;
  cumulativeMemory: number;
  utilization: number;
  cores: Core[];
}

export interface Core {
  id: number;
  time_in_use: number;
  total_time: number;
  utilization: number;
}

export interface NodeDetails {
  replica: string;
  use_time: number;
  total_time: number;
  utilization: number;
  throughput: number;
  avg_resp_time: number | null;
  tuplas: number;
}