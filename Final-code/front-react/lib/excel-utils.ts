import * as XLSX from 'xlsx';
import type { SimulationData } from './types/simulation';
import {
  createArrivalRatesSheet,
  createProcessorsSheet,
  createNodesSheet,
  createStatisticsSheet
} from '../lib/excel/sheet';

export const downloadExcel = (data: SimulationData) => {
  try {
    const simulationResults = data.results?.[0];
    if (!simulationResults) {
      throw new Error('No simulation results found');
    }

    // Create workbook
    const wb = XLSX.utils.book_new();

    // Create individual sheets
    createArrivalRatesSheet(wb, simulationResults);
    createProcessorsSheet(wb, simulationResults);
    createNodesSheet(wb, simulationResults);
    createStatisticsSheet(wb, simulationResults);

    // Generate Excel file
    XLSX.writeFile(wb, 'simulation-results.xlsx');
  } catch (error) {
    console.error('Error generating Excel file:', error);
    alert('Error generating Excel file. Please check the console for details.');
  }
};