import * as XLSX from 'xlsx';
import type { SimulationResults } from '../types/simulation';

export const createArrivalRatesSheet = (wb: XLSX.WorkBook, data: SimulationResults) => {
  const arrivalRates = data.arrivalRates?.map((rate, index) => ({
    'Time Step': index + 1,
    'Arrival Rate': rate,
  })) || [];

  const ws = XLSX.utils.json_to_sheet(arrivalRates);
  XLSX.utils.book_append_sheet(wb, ws, 'Arrival Rates');
};

export const createProcessorsSheet = (wb: XLSX.WorkBook, data: SimulationResults) => {
  const processorsData = data.processors?.map(proc => 
    proc.cores.map(core => ({
      'Processor Name': proc.name,
      'Memory In Use': proc.in_use,
      'Average Memory': proc.averageMemory,
      'Max Memory': proc.maxMemory,
      'Memory Utilization': proc.utilization,
      'Accesses': proc.accesses,
      'Cumulative Memory': proc.cumulativeMemory,
      'Core ID': core.id,
      'Core Time In Use': core.time_in_use,
      'Core Total Time': core.total_time,
      'Core Utilization': core.utilization,
    }))
  ).flat() || [];

  const ws = XLSX.utils.json_to_sheet(processorsData);
  XLSX.utils.book_append_sheet(wb, ws, 'Processors');
};

export const createNodesSheet = (wb: XLSX.WorkBook, data: SimulationResults) => {
  const nodesData = data.nodes?.map(node => 
    (node.node_details || []).map(detail => ({
      'Node Name': node.name,
      'Node Utilization': node.utilization,
      'Node Throughput': node.throughput,
      'Replicas': node.replicas,
      'Replica ID': detail.replica,
      'Use Time': detail.use_time,
      'Total Time': detail.total_time,
      'Replica Utilization': detail.utilization,
      'Replica Throughput': detail.throughput,
      'Avg Response Time': detail.avg_resp_time,
      'Tuples Processed': detail.tuplas,
    }))
  ).flat() || [];

  const ws = XLSX.utils.json_to_sheet(nodesData);
  XLSX.utils.book_append_sheet(wb, ws, 'Nodes');
};

export const createStatisticsSheet = (wb: XLSX.WorkBook, data: SimulationResults) => {
  const statsData = data.stadistics?.map(stat => ({
    'Tuples Generated': stat.tuples_generated,
    'Tuples Processed': stat.tuples_processed,
    'Topology Throughput': stat.throughput_topology,
    'Avg Response Time': stat.avg_tuple_resp_time ?? 'N/A',
    'Total Simulation Time': stat.total_simulation_time,
  })) || [];

  const ws = XLSX.utils.json_to_sheet(statsData);
  XLSX.utils.book_append_sheet(wb, ws, 'Statistics');
};