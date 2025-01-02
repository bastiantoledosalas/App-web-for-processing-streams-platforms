'use client';

import { Button } from '@/components/ui/button';

import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export type User = {
  _id?: string;
  name: string;
  lastname: string;
  email: string;
  password:string;
  role: 'admin' | 'user' | 'superuser'
};

const SortingButton = ({ column, children }: { column: any; children: React.ReactNode }) => (
  <Button variant="ghost" onClick={() => column.toggleSorting()}>
    {children}
    <ArrowUpDown className="ml-2 h-4 w-4" />
  </Button>
);

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => <SortingButton column={column}>Nombre</SortingButton>,
    cell: ({ row }) => <span>{row.original.name}</span>,
  },
  {
    accessorKey: 'lastname',
    header: ({ column }) => <SortingButton column={column}>Apellido</SortingButton>,
    cell: ({ row }) => <span>{row.original.lastname}</span>,
  },
  {
    accessorKey: 'email',
    header: ({ column }) => <SortingButton column={column}>Correo Electrónico</SortingButton>,
    cell: ({ row }) => <span>{row.original.email}</span>,
    },
  {
    accessorKey: 'role',
    header: ({ column }) => <SortingButton column={column}>Rol</SortingButton>,
    cell: ({ row }) => {
      const user = row.original;
      return (
        <Badge
        variant ={
          user.role === 'admin'
          ? 'admin'
          : user.role === 'user'
          ? 'user'
          : user.role === 'superuser'
          ? 'superuser'
          : 'pending'
        }
        >
          {user.role}
        </Badge>
      );
    },
  },
];
   
