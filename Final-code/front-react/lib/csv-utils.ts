interface SimulationData {
    results?: {
      newResults?: Array<{
        arrivalRates?: number[];
        numberTuples?: any[];
        serviceTimes?: any[];
        processors?: Array<{
          name: string;
          in_use: number;
          averageMemory: number;
          maxMemory: number;
          accesses: number;
          cumulativeMemory: number;
          utilization: number;
          cores: Array<{
            id: number;
            time_in_use: number;
            total_time: number;
            utilization: number;
          }>;
        }>;
        nodes?: Array<{
          name: string;
          utilization: number;
          throughput: number;
          replicas: number;
          node_details?: Array<{
            replica: string;
            use_time: number;
            total_time: number;
            utilization: number;
            throughput: number;
            avg_resp_time: number;
            tuplas: number;
          }>;
        }>;
        stadistics?: Array<{
          tuples_generated: number;
          tuples_processed: number;
          throughput_topology: number;
          avg_tuple_resp_time: number | null;
          total_simulation_time: number;
        }>;
      }>;
    };
  }
  
  const extractArrivalRates = (data: SimulationData) => {
    const rates = data.results?.newResults?.[0]?.arrivalRates || [];
    return rates.map((rate, index) => ({
      'Time Step': index + 1,
      'Arrival Rate': rate
    }));
  };
  
  const extractProcessorStats = (data: SimulationData) => {
    try {
      return data.results?.newResults?.[0]?.processors?.map((processor) => {
        const baseStats = {
          'Processor Name': processor.name,
          'Memory In Use': processor.in_use,
          'Average Memory': processor.averageMemory,
          'Max Memory': processor.maxMemory,
          'Cumulative Memory': processor.cumulativeMemory,
          'Processor Utilization': processor.utilization,
          'Number of Accesses': processor.accesses,
        };
  
        // Create separate rows for each core
        return processor.cores.map((core, index) => ({
          ...baseStats,
          'Core ID': core.id,
          'Core Time In Use': core.time_in_use,
          'Core Total Time': core.total_time,
          'Core Utilization': core.utilization,
        }));
      }).flat() || [];
    } catch (error) {
      console.error('Error extracting processor stats:', error);
      return [];
    }
  };
  
  const extractNodeStats = (data: SimulationData) => {
    try {
      return data.results?.newResults?.[0]?.nodes?.map((node) => {
        const baseStats = {
          'Node Name': node.name,
          'Node Utilization': node.utilization,
          'Node Throughput': node.throughput,
          'Number of Replicas': node.replicas,
        };
  
        if (!node.node_details?.length) {
          return baseStats;
        }
  
        // Create separate rows for each replica detail
        return node.node_details.map((detail) => ({
          ...baseStats,
          'Replica ID': detail.replica,
          'Use Time': detail.use_time,
          'Total Time': detail.total_time,
          'Replica Utilization': detail.utilization,
          'Replica Throughput': detail.throughput,
          'Average Response Time': detail.avg_resp_time,
          'Tuples Processed': detail.tuplas,
        }));
      }).flat() || [];
    } catch (error) {
      console.error('Error extracting node stats:', error);
      return [];
    }
  };
  
  const extractGeneralStats = (data: SimulationData) => {
    try {
      return data.results?.newResults?.[0]?.stadistics?.map((stat) => ({
        'Tuples Generated': stat.tuples_generated,
        'Tuples Processed': stat.tuples_processed,
        'Topology Throughput': stat.throughput_topology,
        'Average Response Time': stat.avg_tuple_resp_time ?? 'N/A',
        'Total Simulation Time': stat.total_simulation_time,
      })) || [];
    } catch (error) {
      console.error('Error extracting general stats:', error);
      return [];
    }
  };
  
  const formatCSVSection = (title: string, data: Record<string, any>[]) => {
    if (!data.length) return '';
    
    let csv = `${title}\n`;
    csv += Object.keys(data[0]).join(',') + '\n';
    csv += data.map(item => 
      Object.values(item)
        .map(value => 
          value === null || value === undefined 
            ? 'N/A' 
            : String(value).includes(',') 
              ? `"${value}"` 
              : value
        )
        .join(',')
    ).join('\n');
    csv += '\n\n';
    return csv;
  };
  
  export const convertToCSV = (data: SimulationData) => {
    if (!data?.results?.newResults?.[0]) {
      console.error('Invalid simulation data structure');
      return 'No valid simulation data found';
    }
  
    const arrivalRates = extractArrivalRates(data);
    const processorStats = extractProcessorStats(data);
    const nodeStats = extractNodeStats(data);
    const generalStats = extractGeneralStats(data);
  
    let csv = '';
    csv += formatCSVSection('Arrival Rates', arrivalRates);
    csv += formatCSVSection('Processor Statistics', processorStats);
    csv += formatCSVSection('Node Statistics', nodeStats);
    csv += formatCSVSection('General Statistics', generalStats);
  
    return csv;
  };
  
  export const downloadCSV = (data: SimulationData, filename: string = 'simulation-results.csv') => {
    try {
      const csv = convertToCSV(data);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      
      if (navigator.msSaveBlob) {
        navigator.msSaveBlob(blob, filename);
      } else {
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error('Error downloading CSV:', error);
      alert('Error generating CSV file. Please check the console for details.');
    }
  };