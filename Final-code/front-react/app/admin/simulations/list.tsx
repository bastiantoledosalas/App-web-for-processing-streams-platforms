'use client';
import React, { useEffect } from 'react';

import { DataTable } from './data-table';
import {
  DropdownMenuLabel,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { ColumnDef } from '@tanstack/react-table';

import { columns as initialColumns, Simulation } from './columns';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export const ListSimulations = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [simulations, setSimulations] = React.useState([]);
  const [columns, setColumns] = React.useState<ColumnDef<Simulation>[]>([]);

  useEffect(() => {
    setColumns([
      ...initialColumns,
      {
        id: 'actions',
        cell: ({ row }: any) => {
          const simulation = row.original;

          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Menú</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Acciones</DropdownMenuLabel>

                <DropdownMenuItem onClick={() => handleShowOrEdit(simulation)}>
                  Ver o Editar
                </DropdownMenuItem>
                <DropdownMenuItem>Simular</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Eliminar</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ]);
  }, [initialColumns]);

  useEffect(() => {
    if (!session) return;
    const user = session.user as any;
    localStorage.setItem('token', user.token);
    getSimulations();
  }, [session]);

  const handleShowOrEdit = (simulation: Simulation) => {
    console.log(simulation);
    router.push(`/admin/simulator?id=${simulation._id}`);
  };

  const getSimulations = async () => {
    axios
      .get('http://localhost:4000/api/simulations', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        withCredentials: true,
      })

      .then((response) => {
        setSimulations(response.data);
      })
      .catch((error) => {
        console.log(error);
        setSimulations([]);
      });
  };
  return (
    <div>
      <DataTable columns={columns} data={simulations} />
    </div>
  );
};
