import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class SimulationStartDto {

  @IsOptional()
  @IsNumber({}, { message: 'El campo time debe ser un número si se proporciona' })
  @Min(1, { message: 'El campo time debe ser mayor a 0 si se proporciona' })
  time?: number;

  @IsNotEmpty({ message: 'El qty_tuples es obligatorio y debe ser un número'})
  @IsNumber({}, { message: 'El qty_tuples debe ser un número'})
  @Min(1, {message: 'El qty_tuples debe ser mayor a 0'})
  qty_tuples: number;

  
}
