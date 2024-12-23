
'use client';

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { DropdownMenuLabel, DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem, DropdownMenuSeparator} from '@/components/ui/dropdown-menu';
import { columns as initialColumns, Simulation } from './columns';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MoreHorizontal } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import { DataTable } from './data-table';
import React,  { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import {z} from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Switch } from '@/components/ui/switch';

// Esquema de validación con Zod
const simulationSchema = z.object({
  qty_tuples: z
    .string()       // Especificamos que lo recibimos como string primero
    .transform((val) => Number(val)) // Convertimos el string a número 
    .refine((val) => !isNaN(val) && val >= 1, {
      message: 'La cantidad de tuplas debe ser un número mayor o igual a 1',
    }),
  time: z
    .string()  // Recibimos como string para procesar la entrada
    .transform((val) => (val ? Number(val) : null))
    .refine((val) => !val || (val && val >= 1), {
      message: 'El tiempo debe ser un número mayor o igual a 1',
    })
    .optional(),  // Se hace opcional
});

// Tipos derivados del esquema
type SimulationFormData = z.infer<typeof simulationSchema>;

export const ListSimulations = () => {
  const router                        = useRouter();
  const { data: session}              = useSession();
  const [simulations, setSimulations] = React.useState([]);
  const [qtyTuples, setQtyTuples]     = React.useState<number | null>(null);
  const [time, setTime]               = React.useState<number | null>(null);
  const [columns, setColumns]         = React.useState<ColumnDef<Simulation>[]>([]);
  const [showTimeField, setShowTimeField]           = React.useState(false);
  const [selectedSimulation, setSelectedSimulation] = React.useState<Simulation | null>(null);  // Almacenar la simulación seleccionada para eliminación
  const [simulationToRun, setSimulationToRun]       = React.useState<Simulation | null>(null);        // Almacenar simulación seleccionada para simular
  
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<SimulationFormData>({
    resolver: zodResolver(simulationSchema),
  });

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
                {/*<DropdownMenuItem onClick={() => handleShowOrEdit(simulation, 'view')}>Ver</DropdownMenuItem> */}
                <DropdownMenuItem onClick={() => handleShowOrEdit(simulation, 'edit')}>Editar</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSimulationToRun(simulation)}>Simular</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedSimulation(simulation)}>Eliminar</DropdownMenuItem>
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

  const getSimulations = async () => {
    axios
      .get('http://localhost:3000/api/simulations', {
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
        setSimulations([]);
      });
  };

  const handleShowOrEdit = (simulation: Simulation, mode: 'view' | 'edit') => {
    const route = mode === 'view' ? `/admin/simulator/view?id=${simulation._id}` : `/admin/simulator?id=${simulation._id}`;
    router.push(route);
  };

   const handleSimulate = async (data: SimulationFormData) => {
    console.log('DATA',data);
    const qtyTuples = data.qty_tuples;
    const time      = data.time;  

    if (!simulationToRun) return;
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No se encontró el token de autenticación');
      }
      const payload: any = { qty_tuples: qtyTuples };
      if (time) payload.time = time;

      const response = await axios.post(`http://localhost:3000/api/simulations/${simulationToRun._id}/start`,payload,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // Autenticación con el token
          },
          withCredentials: true,
        }
      );
      console.log('RESPONSE:',response.status);
      if (response.status === 201) {
        toast.success('Simulación iniciada correctamente');
        setSimulationToRun(null);
        setQtyTuples(null);
        setTime(null);
        setShowTimeField(false);
      } else {
        toast.error('Error al iniciar la simulación');
      }
    } catch (error: any) {
      console.error('Error al iniciar la simulación', error);
      toast.error(
        error.response?.data?.message || 'Error al iniciar la simulación'
      );
    }
  };

  // Función para eliminar la simulación
  const handleDeleteSimulation = async () => {
    if (!selectedSimulation) return;
    try {
      const token = localStorage.getItem('token');
      if(!token){
        throw new Error('No se encontró el token de autenticación');
      }
      const response = await axios.delete(`http://localhost:3000/api/simulations/${selectedSimulation._id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        withCredentials: true,
      });

      if (response.status === 200) {
        toast.success('Simulación eliminada correctamente');
        // Eliminar la simulación del estado
        setSimulations((prevSimulations) =>
          prevSimulations.filter((simulation: Simulation) => simulation._id !== selectedSimulation._id)
        );
        setSelectedSimulation(null); // Limpiar la simulación seleccionada
      } else{
        toast.error('Error al eliminar la contraseña');
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || 'Error al eliminar la simulación'
      );
    }
  };

  return (
    <div>
      <DataTable columns={columns} data={simulations} />

      {/* AlertDialog para iniciar la simulación */}
      <AlertDialog open={!!simulationToRun} onOpenChange={(open) => !open && setSimulationToRun(null)}>
        <AlertDialogTrigger asChild>
          <Button style={{ display: 'none' }} />
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Iniciar Simulación</AlertDialogTitle>
            <AlertDialogDescription>
              Proporcione los parámetros para iniciar la simulación.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <form onSubmit={handleSubmit(handleSimulate)} className="flex flex-col space-y-4">
              <div className="flex flex-col">
                <label htmlFor="qty_tuples">Cantidad de Tuplas</label>
                <Input
                  id="qty_tuples"
                  type="number"
                  min="1"
                  step="1"
                  placeholder="Ingrese la cantidad de tuplas"
                  {...register('qty_tuples')}
                  required
                />
                {errors.qty_tuples && <span className="text-red-500 text-sm">{errors.qty_tuples.message}</span>}
              </div>

              {/* Switch para mostrar/ocultar el campo time */}
              <div className="flex items-center space-x-2">
                <Switch
                  id="time-switch"
                  checked={showTimeField}
                  onCheckedChange={setShowTimeField}
                />
              </div>

              {/* Campo time (opcional) */}
              {showTimeField && (
                <div className="flex flex-col">
                  <label htmlFor="time">Tiempo</label>
                  <Input
                    type="number"
                    id="time"
                    min="1"
                    step="1"
                    placeholder="Ingrese el tiempo"
                    {...register('time')}
                  />
                  {errors.time && <span className="text-red-500 text-sm">{errors.time.message}</span>}
                </div>
              )}

              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setSimulationToRun(null)}>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleSubmit(handleSimulate)}>Simular</AlertDialogAction>
              </AlertDialogFooter>
            </form>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* AlertDialog para confirmación de eliminación */}
      <AlertDialog open={!!selectedSimulation} onOpenChange={(open) => !open && setSelectedSimulation(null)}>
        <AlertDialogTrigger asChild>
          <Button style={{ display: 'none' }} />
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar Simulación</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción es irreversible. Al eliminar la simulación, se perderán permanentemente todos los datos asociados.
              ¿Estás seguro de que deseas continuar?
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedSimulation(null)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteSimulation}>Continuar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
