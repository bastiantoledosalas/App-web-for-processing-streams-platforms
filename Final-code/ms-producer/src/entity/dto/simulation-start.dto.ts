import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO para iniciar la simulación con los parámetros requeridos.
 */
export class SimulationStartDto {

  @ApiProperty({ description: 'Tiempo en el que se ejecutará la simulación (opcional)', example: 1000, required: false })
  @IsOptional()
  @IsNumber({}, { message: 'El campo time debe ser un número si se proporciona' })
  @Min(1, { message: 'El campo time debe ser mayor a 0 si se proporciona' })
  time?: number;

  @ApiProperty({ description: 'Número de tuplas que se generarán en la simulación', example: 100, required: true })
  @IsNotEmpty({ message: 'El qty_tuples es obligatorio y debe ser un número'})
  @IsNumber({}, { message: 'El qty_tuples debe ser un número'})
  @Min(1, {message: 'El qty_tuples debe ser mayor a 0'})
  qty_tuples: number;

}
