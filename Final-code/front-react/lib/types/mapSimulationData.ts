// mapSimulationData.ts

import { SimulationData, Node, Edge, Processor, Results } from './simulation';

export const mapSimulationData = (rawData: any): SimulationData => {
  return {
    _id: rawData._id,
    name: rawData.name,
    description: rawData.description,
    status: rawData.status,
    user: rawData.user,
    createdAt: rawData.createdAt,
    updatedAt: rawData.updatedAt,
    nodes: rawData.nodes.map((node: any) => ({
      id: node.id,
      type: node.type,
      data: {
        name: node.data.name,
        type: node.data.type,
        replicationLevel: node.data.replicationLevel,
        groupType: node.data.groupType,
        processor: node.data.processor,
        avgServiceTimeType: node.data.avgServiceTimeType,
        avgServiceTimeValue: node.data.avgServiceTimeValue,
        arrivalRateType: node.data.arrivalRateType,
        arrivalRateValue: node.data.arrivalRateValue,
      },
      position: node.position,
      measured: node.measured,
      selected: node.selected,
      dragging: node.dragging,
    })),
    edges: rawData.edges.map((edge: any) => ({
      source: edge.source,
      target: edge.target,
      type: edge.type,
      data: {
        duration: edge.data.duration,
        shape: edge.data.shape,
        path: edge.data.path,
      },
      id: edge.id,
    })),
    results: rawData.results.map((result: any) => ({
      arrivalRates: result.arrivalRates,
      numberTuples: result.numberTuples,
      serviceTimes: result.serviceTimes,
      processors: result.processors.map((processor: any) => ({
        name: processor.name,
        in_use: processor.in_use,
        averageMemory: processor.averageMemory,
        maxMemory: processor.maxMemory,
        accesses: processor.accesses,
        cumulativeMemory: processor.cumulativeMemory,
        utilization: processor.utilization,
        cores: processor.cores.map((core: any) => ({
          id: core.id,
          time_in_use: core.time_in_use,
          total_time: core.total_time,
          utilization: core.utilization,
        })),
      })),
      nodes: result.nodes.map((node: any) => ({
        name: node.name,
        utilization: node.utilization,
        throughput: node.throughput,
        replicas: node.replicas,
        node_details: node.node_details.map((detail: any) => ({
          replica: detail.replica,
          use_time: detail.use_time,
          total_time: detail.total_time,
          utilization: detail.utilization,
          throughput: detail.throughput,
          avg_resp_time: detail.avg_resp_time,
          tuplas: detail.tuplas,
        })),
      })),
      stadistics: result.stadistics.map((stat: any) => ({
        tuples_generated: stat.tuples_generated,
        tuples_processed: stat.tuples_processed,
        throughput_topology: stat.throughput_topology,
        avg_tuple_resp_time: stat.avg_tuple_resp_time,
        total_simulation_time: stat.total_simulation_time,
      })),
    })),
  };
};
