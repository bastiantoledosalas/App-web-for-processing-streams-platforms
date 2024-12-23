'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { NodeSchema } from '@/app/schemas';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import FileProcessor from '../file/file-processor';

interface NodeFormProps {
  onSubmitData: (data: z.infer<typeof NodeSchema>) => void;
}

const avgServiceTimeTypeOptions = [
  { value: 'spline', label: 'Spline', placeholder: 'ej: ruta/archivo.txt' },
  { value: 'fixed', label: 'Fixed', placeholder: 'ej: fixed(1.0)' },
  {
    value: 'chi2',
    label: 'Chi2',
    placeholder: 'ej: chi2(3.00001, 0.123123, 12.3123)',
  },
  { value: 'maxwell', label: 'Maxwell', placeholder: 'ej: maxwell(2.0,3.0)' },
  { value: 'expon', label: 'Expon', placeholder: 'ej: expon(2.0,3.0)' },
  {
    value: 'invgauss',
    label: 'Invgauss',
    placeholder: 'ej: invgauss(2.0,3.0,4.0)',
  },
  { value: 'norm', label: 'Norm', placeholder: 'ej: norm(2.0,3.0)' },
  {
    value: 'lognorm',
    label: 'Lognorm',
    placeholder: 'ej: lognorm(2.0,3.0,4.0)',
  },
];

const arrivalRateTypeOptions = [
  { value: 'spline', label: 'Spline', placeholder: 'ej: ruta/archivo.txt' },
  { value: 'fixed', label: 'Fixed', placeholder: 'ej: fixed(1.0)' },
  {
    value: 'chi2',
    label: 'Chi2',
    placeholder: 'ej: chi2(3.00001, 0.123123, 12.3123)',
  },
  { value: 'maxwell', label: 'Maxwell', placeholder: 'ej: maxwell(2.0,3.0)' },
  { value: 'expon', label: 'Expon', placeholder: 'ej: expon(2.0,3.0)' },
  {
    value: 'invgauss',
    label: 'Invgauss',
    placeholder: 'ej: invgauss(2.0,3.0,4.0)',
  },
  { value: 'norm', label: 'Norm', placeholder: 'ej: norm(2.0,3.0)' },
  {
    value: 'lognorm',
    label: 'Lognorm',
    placeholder: 'ej: lognorm(2.0,3.0,4.0)',
  },
];

const numberOutputTweetsTypeOptions = [
  { value: 'spline', label: 'Spline', placeholder: 'ej: ruta/archivo.txt' },
  { value: 'fixed', label: 'Fixed', placeholder: 'ej: fixed(4.0)' },
  {
    value: 'bernoulli',
    label: 'Bernoulli',
    placeholder: 'ej: bernoulli(1.0,3.0,2.0)',
  },
  { value: 'geom', label: 'Geom', placeholder: 'ej: geom(1.0,1.5,2.0)' },
  {
    value: 'nbinom',
    label: 'Nbinom',
    placeholder: 'ej: nbinom(1.0,1.0,3.0,4.0)',
  },
];

const INITIAL_VALUES = {
  name: '',
  type: 'S',
  replicationLevel: 1,
  groupType: '0',
  processor: '',
  avgServiceTimeType: '',
  avgServiceTimeValue: '',
  arrivalRateType: '',
  arrivalRateValue: '',
  numberOutputTweetsType: '',
  numberOutputTweetsValue: '',
};

export const NodeForm = ({ onSubmitData }: NodeFormProps) => {
  const form = useForm<z.infer<typeof NodeSchema>>({
    resolver: zodResolver(NodeSchema),
    defaultValues: INITIAL_VALUES,
  });

  const type = form.watch('type');

  useEffect(() => {
    if (type === 'S'){
      form.setValue('numberOutputTweetsType',undefined);
      form.setValue('numberOutputTweetsValue', undefined);
    } else if (type === 'B'){
      form.setValue('arrivalRateType',undefined);
      form.setValue('arrivalRateValue',undefined);
    }
  }, [type]);

  const handleFileReadAvgServiceTime = (data: any) => {
    form.setValue('avgServiceTimeValue', data);
  };

  const handleFileReadArrivalRate = (data: any) => {
    form.setValue('arrivalRateValue', data);
  };

  const onSubmit = (data: z.infer<typeof NodeSchema>) => {
    const filteredData = {...data};

    if (type === 'S'){

      if (filteredData.avgServiceTimeType){
        filteredData.avgServiceTimeValue = `fixed(${filteredData.avgServiceTimeValue})`;
      }
      if (filteredData.arrivalRateValue) {
        filteredData.arrivalRateValue = `fixed(${filteredData.arrivalRateValue})`;
      }
      // Eliminar valores relacionados con 'B'
      delete filteredData.numberOutputTweetsType;
      delete filteredData.numberOutputTweetsValue;

    } else if (type === 'B') {
      if (filteredData.numberOutputTweetsValue) {
        filteredData.numberOutputTweetsValue = `fixed(${filteredData.numberOutputTweetsValue})`;
      }
      if (filteredData.avgServiceTimeType){
        filteredData.avgServiceTimeValue = `fixed(${filteredData.avgServiceTimeValue})`;
      }
      delete filteredData.arrivalRateType;
      delete filteredData.arrivalRateValue;
    }
    onSubmitData(filteredData);
    form.reset(INITIAL_VALUES);
    // emite un toast de éxito
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-12 gap-3">
            {/* Primera columna */}
            <div className="col-span-12 lg:col-span-3">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem className="mb-2">
                    <FormLabel>Tipo</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="S">Spout</SelectItem>
                          <SelectItem value="B">Bolt</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="mb-2">
                    <FormLabel>Nombre</FormLabel>
                    <FormControl>
                      <Input {...field} autoComplete="off" />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="replicationLevel"
                render={({ field }) => (
                  <FormItem className="mb-2">
                    <FormLabel>Nivel de replicación</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        step="1"
                        placeholder="replicationLevel"
                        {...field}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          const value = Math.max(1, Number(e.target.value));
                        field.onChange(value);
                        }}
                        autoComplete="off"
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Segunda columna */}
            <div className="col-span-12 lg:col-span-3">
              <FormField
                control={form.control}
                name="groupType"
                render={({ field }) => (
                  <FormItem className="mb-2">
                    <FormLabel>Tipo de agrupamiento</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) => field.onChange(value)}
                        value={field.value || "0"}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona el tipo" />
                          </SelectTrigger>
                          <SelectContent>
                           <SelectItem value="0">Agrupamiento Aleatorio</SelectItem>
                           <SelectItem value="1">Agrupamiento de Campos</SelectItem>
                           <SelectItem value="2">Agrupamiento Global</SelectItem>
                           <SelectItem value="3">Agrupamiento Total</SelectItem>
                          </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="processor"
                render={({ field }) => (
                  <FormItem className="mb-2">
                    <FormLabel>Procesador</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="ej: 10.0.0.2"
                        {...field}
                        autoComplete="off"
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Tercera columna */}
            <div className="col-span-12 lg:col-span-3">
              <div className="border rounded-md p-2 my-3">
                <p className="text-sm border-b pb-2 mb-3">
                  Tiempo promedio de servicio
                </p>
                <FormField
                  control={form.control}
                  name="avgServiceTimeType"
                  render={({ field }) => (
                    <FormItem className="mb-2">
                      <FormLabel>Distribución</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccione" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {avgServiceTimeTypeOptions.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                {form.watch('avgServiceTimeType') === 'spline' && (
                  <FileProcessor onProcessed={handleFileReadAvgServiceTime} />
                )}
                <FormField
                  control={form.control}
                  name="avgServiceTimeValue"
                  render={({ field }) => (
                    <FormItem className="mb-2">
                      <FormLabel>Valor</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={`${
                            avgServiceTimeTypeOptions.find(
                              (option) =>
                                option.value ===
                                form.watch('avgServiceTimeType'),
                            )?.placeholder || ''
                          }`}
                          {...field}
                          autoComplete="off"
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Cuarta columna */}
            <div className="col-span-12 lg:col-span-3">
              {form.watch('type') === 'S' ? (
                <div className="border rounded-md p-2 my-3">
                  <p className="text-sm border-b pb-2 mb-3">Tasa de arribo</p>
                  <FormField
                    control={form.control}
                    name="arrivalRateType"
                    render={({ field }) => (
                      <FormItem className="mb-2">
                        <FormLabel>Distribución</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccione" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {arrivalRateTypeOptions.map((option) => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {form.watch('arrivalRateType') === 'spline' && (
                    <FileProcessor onProcessed={handleFileReadArrivalRate} />
                  )}
                  <FormField
                    control={form.control}
                    name="arrivalRateValue"
                    render={({ field }) => (
                      <FormItem className="mb-2">
                        <FormLabel>Valor</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={`${
                              arrivalRateTypeOptions.find(
                                (option) =>
                                  option.value ===
                                  form.watch('arrivalRateType'),
                              )?.placeholder || ''
                            }`}
                            {...field}
                            autoComplete="off"
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ) : (
                <div className="border rounded-md p-2 my-3">
                  <p className="text-sm border-b pb-2 mb-3">
                    Número de tweets de salida
                  </p>
                  <FormField
                    control={form.control}
                    name="numberOutputTweetsType"
                    render={({ field }) => (
                      <FormItem className="mb-2">
                        <FormLabel>Distribución</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccione" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {numberOutputTweetsTypeOptions.map((option) => (
                                <SelectItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="numberOutputTweetsValue"
                    render={({ field }) => (
                      <FormItem className="mb-2">
                        <FormLabel>Valor</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={`${
                              numberOutputTweetsTypeOptions.find(
                                (option) =>
                                  option.value ===
                                  form.watch('numberOutputTweetsType'),
                              )?.placeholder || ''
                            }`}
                            {...field}
                            autoComplete="off"
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-x-2">
            <Button
              type="button"
              variant={'outline'}
              onClick={() => form.reset(INITIAL_VALUES)}
            >
              Limpiar
            </Button>
            <Button type="submit">Añadir</Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
