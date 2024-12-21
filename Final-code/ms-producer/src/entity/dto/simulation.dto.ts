import { IsNotEmpty, IsString, IsArray, ValidateNested, IsEnum, IsNumber, IsBoolean, IsOptional, Matches, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { DistributionTypeAvgServiceTime, NumberOutputTweetsType } from './distributions';

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
  @IsEnum(DistributionTypeAvgServiceTime,{message:'Formato invalido para el Tipo de Distribución. Formatos aceptados son: spline, fixed, chi2, maxwell, expon, invgauss, norm or lognorm'})
  avgServiceTimeType: DistributionTypeAvgServiceTime;

  @IsString()
  @IsNotEmpty()
  avgServiceTimeValue: string;

  // Solo para nodos tipo S
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @IsEnum(DistributionTypeAvgServiceTime,{message: 'Formato invalido para el Tipo de Distribución. Formatos aceptados son: spline, fixed, chi2, maxwell, expon, invgauss, norm or lognorm'})
  arrivalRateType?: DistributionTypeAvgServiceTime;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  arrivalRateValue?: string;

  // Solo para nodos tipo B
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @IsEnum(NumberOutputTweetsType,{message:'Formato invalido para el Tipo de Distribución. Formatos aceptados son: spline, fixed, bernoulli, geom or nbinom'})
  numberOutputTweetsType?: NumberOutputTweetsType;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  numberOutputTweetsValue?: string;

}

class PositionDto {
  @IsNumber()
  @IsNotEmpty()
  x: number;

  @IsNumber()
  @IsNotEmpty()
  y: number;
}

class MeasuredDto {
  @IsNumber()
  @IsNotEmpty()
  width: number;

  @IsNumber()
  @IsNotEmpty()
  height: number;
}

export class NodeDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @ValidateNested({each: true})
  @Type(() => NodeDataDto)
  data: NodeDataDto;

  @ValidateNested()
  @Type(() => PositionDto)
  position: PositionDto;

  @ValidateNested({each: true})
  @Type(() => MeasuredDto)
  measured: MeasuredDto;

  @IsBoolean()
  @IsNotEmpty()
  selected: boolean;

  @IsBoolean()
  @IsNotEmpty()
  dragging: boolean;
}

class EdgeDataInnerDto {
  @IsNumber()
  @IsNotEmpty()
  duration: number;

  @IsString()
  @IsNotEmpty()
  shape: string;

  @IsString()
  @IsNotEmpty()
  path: string;
}

export class EdgeDataDto {
  @IsString()
  @IsNotEmpty()
  source: string;

  @IsString()
  @IsNotEmpty()
  target: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @ValidateNested({each: true})
  @Type(() => EdgeDataInnerDto)
  data: EdgeDataInnerDto;

  @IsString()
  @IsNotEmpty()
  id: string;
}

export class ValidatedSimulationDto {

  @IsString()
  @IsNotEmpty()
  _id: string

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  description: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => NodeDto)
  nodes: NodeDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EdgeDataDto)
  edges: EdgeDataDto[];

  @IsString()
  @IsNotEmpty()
  status: string;

  @IsString()
  @IsNotEmpty()
  user: string;

  @IsArray()
  results: any[];

  @IsNotEmpty()
  createdAt: string;

  @IsNotEmpty()
  updatedAt: string;
}
