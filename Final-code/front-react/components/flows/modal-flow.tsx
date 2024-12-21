import React, { use, useEffect } from 'react';
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
  const form = useForm<z.infer<typeof SimulationCreateSchema>>({
    resolver: zodResolver(SimulationCreateSchema),
    defaultValues: initialData,
  });

  useEffect(() => {
    form.reset(initialData);
  }, [initialData]);

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
      if (action === 'create') {
        const response = await fetch('http://simulations-service:3002/ms-simulations/simulations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
        const dataResponse = await response.json();
      } else {
        const response = await fetch(
          `http://bff:3000/api/simulations/${initialData.id}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          },
        );
        const dataResponse = await response.json();
      }

      toast.success('Simulación guardada correctamente');
      setOpen(false);
      onSaved();
    } catch (error) {
      console.log({ error });
      toast.error('Error al guardar la simulación');
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
