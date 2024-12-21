import { IsNotEmpty, IsString, IsArray, ValidateNested, IsEnum, IsNumber, IsOptional, Matches, Min } from 'class-validator';
import { Type } from 'class-transformer';

// Expresión regular para validar direcciones IP en formato x.x.x.x
const processorRegex = /^10\.(0|1|2|3)\.(0|1)\.(2|[2-9][0-9]?|1[0-9]{2}|2[0-4][0-9]|25[0-4])$/;

class NodeDataDto {
  @IsString()
  @IsNotEmpty()
  name: string; // Nombre del nodo

  @IsString()
  @IsNotEmpty()
  @IsEnum(['S','B'], { message: 'Tipo de Nodo debe ser "S" o "B"'}) // Valida que el tipo de Nodo Sea Spout o Bolt
  type: string; // Tipo de Nodo: Spout (S) o Bolt (B)

  @IsNumber()
  @IsNotEmpty()
  @Min(1, { message: 'El nivel de replicación debe ser mayor o igual a 1.' })
  replicationLevel: number; // Nivel de Replicación 

  @IsString()
  @IsNotEmpty()
  @IsEnum(['0','1','2','3'],{message: 'El tipo de agrupamiento debe ser uno de los valores predefinidos: 0, 1 , 2 or 3'}) 
  groupType: string;   // Tipo de Agrupamiento

  @IsString()
  @IsNotEmpty()
  @Matches(processorRegex,{message: 'La IP debe estar en el rango del Fat Tree: 10.<0-3>.<0-1>.<2-254>'})
  processor: string;

  @IsString()
  @IsNotEmpty()
  avgServiceTimeValue: string;

  // Solo para nodos tipo S
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  arrivalRateValue?: string;

  // Solo para nodos tipo B
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  numberOutputTweetsValue?: string;
}

export class NodeDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @ValidateNested({each: true})
  @Type(() => NodeDataDto)
  data: NodeDataDto;

}

export class EdgeDataDto {
  @IsString()
  @IsNotEmpty()
  source: string;

  @IsString()
  @IsNotEmpty()
  target: string;

}

export class ValidatedSimulationDto {
  @IsString()
  @IsNotEmpty()
  _id: string;

  @IsOptional()
  @IsNumber({}, { message: 'El campo time debe ser un número si se proporciona' })
  @Min(1, { message: 'El campo time debe ser mayor a 0 si se proporciona' })
  time?: number;;

  @IsNotEmpty({ message: 'El qty_tuples es obligatorio y debe ser un número'})
  @IsNumber({}, { message: 'El qty_tuples debe ser un número'})
  @Min(1, {message: 'El qty_tuples debe ser mayor a 0'})
  qty_tuples: number;


  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => NodeDto)
  nodes: NodeDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EdgeDataDto)
  edges: EdgeDataDto[];

}