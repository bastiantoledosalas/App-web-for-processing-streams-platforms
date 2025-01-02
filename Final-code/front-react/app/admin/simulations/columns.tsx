'use client';

import { Button } from '@/components/ui/button';
import { downloadExcel } from '@/lib/excel-utils';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import dayjs from 'dayjs';
import React from 'react';
import { SimulationData } from '@/lib/types/simulation';

export type Simulation = {
  _id?: string;
  name: string;
  description: string;
  date: string;
  time: string;
  status:
    | 'created'
    | 'updated'
    | 'pending'
    | 'processing'
    | 'completed'
    | 'failed';
  createdAt: string;
};

const SortingButton = ({ column, children }: { column: any; children: React.ReactNode }) => (
  <Button variant="ghost" onClick={() => column.toggleSorting()}>
    {children}
    <ArrowUpDown className="ml-2 h-4 w-4" />
  </Button>
);

const handleDownloadExcel = async (simulationId: string) => {
  try {
    const token = localStorage.getItem('token');
    console.log('SimulationID:',simulationId);
    // Hacer la solicitud para obtener los resultados
    const response = await fetch(`http://localhost:3000/api/simulations/${simulationId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
        })

    if (!response.ok) {
      throw new Error('Error al obtener los resultados');
    }

    const resultData: SimulationData = await response.json();
    console.log('RESULTDATA',resultData);

    // Verificar si tenemos resultados
    if (!resultData.results || resultData.results.length === 0) {
      throw new Error('No se encontraron resultados para la simulación');
    }

    // Generar y descargar el archivo Excel
    downloadExcel(resultData);
  } catch (error) {
    console.error('Error al descargar los resultados en Excel:', error);
  }
};

export const columns: ColumnDef<Simulation>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Nombre
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: 'description',
    header: 'Descripción',
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Creación
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const simulation = row.original;

      return (
        <span>{dayjs(simulation.createdAt).format('DD/MM/YYYY HH:mm')}</span>
      );
    },
  },
  {
    accessorKey: 'updatedAt',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Actualización
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const simulation = row.original;

      return (
        <span>{dayjs(simulation.createdAt).format('DD/MM/YYYY HH:mm')}</span>
      );
    },
  },

  {
    accessorKey: 'status',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Estado
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const simulation = row.original;

      return (
        <Badge
          variant={
            simulation.status === 'created' || simulation.status === 'updated'
              ? 'outline'
              : simulation.status === 'pending'
              ? 'pending'
              : simulation.status === 'processing'
              ? 'default'
              : simulation.status === 'completed'
              ? 'success'
              : 'destructive'
          }
        >
          {simulation.status || 'Sin estado'}
        </Badge>
      );
    },
  },
  {
    header: 'Resultados',
    cell: ({ row }) => {
      const simulation = row.original;

      if (simulation.status !== 'completed') {
        return '--';
      }
      return (
        <Button
        variant="outline"
        size="sm"
        onClick={() => handleDownloadExcel(simulation._id!)}
      >
        Descargar Resultados
      </Button>
    );
  },
},
];
