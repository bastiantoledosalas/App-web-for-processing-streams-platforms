'use client';

import { Button } from '@/components/ui/button';

import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import dayjs from 'dayjs';

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
    | 'success'
    | 'failed';
  createdAt: string;
};

// Cantidad de parejas

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
              : simulation.status === 'success'
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

      if (simulation.status !== 'success') {
        return '--';
      }
      return (
        <Button variant={'outline'} size={'sm'}>
          Descargar
        </Button>
      );
    },
  },
];
