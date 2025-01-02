
"use client"
import React, { use, useEffect, useState } from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

import { ScrollArea } from '@/components/ui/scroll-area';

import * as z from 'zod';
import { SimulationCreateSchema } from '@/app/schemas';
import { Input } from '../ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Button } from '../ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface ModalFlowProps {
  simulation: any;
  open: boolean;
  setOpen: (open: boolean) => void;
  initialData: {
    name: string;
    description: string;
    id?: string;
  };
  onSaved: () => void;
  action: string;
}


const ModalFlow = ({
  simulation,
  open,
  setOpen,
  initialData,
  onSaved,
  action,
}: ModalFlowProps) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [nodes, setNodes] = useState<any[]>([]);
  const [edges, setEdges] = useState<any[]>([]);
  const form = useForm<z.infer<typeof SimulationCreateSchema>>({
    resolver: zodResolver(SimulationCreateSchema),
    defaultValues: initialData,
  });

  useEffect(() => {
    if (action === 'edit' && initialData.id) {
      // Cargar la simulación para editar
      const fetchSimulationData = async () => {
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            throw new Error('Token no encontrado');
          }

          const response = await fetch(`http://localhost:3000/api/simulations/${initialData.id}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            credentials: 'include',
          });

          if (!response.ok) {
            throw new Error('Error al cargar la simulación');
          }

          const dataResponse = await response.json();

          // Cargar los datos del formulario
          form.reset({
            name: dataResponse.name,
            description: dataResponse.description,
          });

          // Suponiendo que los datos de la simulación incluyen nodos y bordes
          setNodes(dataResponse.nodes || []);
          setEdges(dataResponse.edges || []);
        } catch (error) {
          console.error('Error al cargar los datos de la simulación:', error);
        }
      };

      fetchSimulationData();
    }
  }, [action, initialData.id, form]);

  const onSubmit = (data: z.infer<typeof SimulationCreateSchema>) => {
    const newDataRequest = {
      ...data,
      ...simulation,
    };
    onSaveToApi({ data: newDataRequest });
    form.reset();
  };

  const onSaveToApi = async ({ data }: any) => {
    try {
      delete data.id;

      // Obtener el token y correo del usuario
      const token = localStorage.getItem('token');

      if (!token || !session?.user || !session?.user.email){
        throw new Error('token o correo no encontrado');
      }

      const newDataRequest={
        ...data,
        user:session.user.email,
      }

      let response;
      if (action === 'create') {
        response = await fetch('http://localhost:3000/api/simulations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(newDataRequest),
          credentials: 'include',
        });

        if(!response.ok){
          const errorDetails = await response.text();
          throw new Error(`Error: ${response.status}, Detalles: ${errorDetails}`);
        }

        toast.success('Simulación guardada correctamente');
      } else {
        const response = await fetch(
          `http://localhost:3000/api/simulations/${initialData.id}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(newDataRequest),
            credentials: 'include',
          },
        );
        if (!response.ok){
          throw new Error('Error al actualizar la simulación');
        }
        const dataResponse = await response.json();
        toast.success('Simulación actualizada correctamente');
      }
      // Cerrar modal y ejecutar función onSave()
      setOpen(false);
      onSaved();
      router.push('/admin'); // Redirige a la página /admin

    } catch (error) {
      console.log({ error });
      toast.error('Error al guardar o actualizar la simulación');
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Antes de continuar</AlertDialogTitle>
        </AlertDialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} id="form">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="mb-2">
                  <FormLabel>Nombre de la simulación</FormLabel>
                  <FormControl>
                    <Input {...field} autoComplete="off" />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="mb-2">
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Input {...field} autoComplete="off" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-x-2"></div>
          </form>
        </Form>
        <Accordion type="single" collapsible className="mb-4">
          <AccordionItem value="item-1">
            <AccordionTrigger>Datos de la simulación</AccordionTrigger>
            <AccordionContent>
              <ScrollArea className="h-[200px] w-[455px] rounded-md border p-4">
                <pre>{JSON.stringify(simulation, null, 2)}</pre>
              </ScrollArea>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <AlertDialogFooter>
          <Button onClick={() => setOpen(false)} variant="outline">
            Cancelar
          </Button>
          <Button type="submit" form="form">
            Guardar
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ModalFlow;
