import {
  IsString,
  IsArray,
  ValidateNested,
  IsObject,
  IsBoolean,
  IsNumber,
  MinLength,
  ArrayNotEmpty,
  IsOptional,
  Min,
  Matches,
  IsNotEmpty,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { DistributionTypeAvgServiceTime, NumberOutputTweetsType } from './distributions';

const processorRegex = /^10\.(0|1|2|3)\.(0|1)\.(2|[2-9][0-9]?|1[0-9]{2}|2[0-4][0-9]|25[0-4])$/;

class DataDto {
  @IsString()
  @IsOptional()
  _id?: string;

  @IsString()
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(['S','B'], { message: 'Tipo de Nodo debe ser "S" o "B"'})
  type: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(1, { message: 'El nivel de replicación debe ser mayor o igual a 1.' })
  replicationLevel: number;

  @IsString()
  @IsNotEmpty()
  @IsEnum(['0','1','2','3'],{message: 'El tipo de agrupamiento debe ser uno de los valores predefinidos: 0, 1 , 2 or 3'})
  groupType: string;

  @IsString()
  @Matches(processorRegex,{message: 'La IP debe estar en el rango del Fat Tree: 10.<0-3>.<0-1>.<2-254>'})
  processor: string;

  @IsString()
  @IsEnum(DistributionTypeAvgServiceTime,{message:'Formato invalido para el Tipo de Distribución para avgServiceTimeType. Formatos aceptados son: spline, fixed, chi2, maxwell, expon, invgauss, norm or lognorm'})
  avgServiceTimeType: string;

  @IsString()
  avgServiceTimeValue: string;

  @IsString()
  @IsOptional()
  @IsEnum(DistributionTypeAvgServiceTime,{message: 'Formato invalido para el Tipo de Distribución en arrivalRateType. Formatos aceptados son: spline, fixed, chi2, maxwell, expon, invgauss, norm or lognorm'})
  arrivalRateType?: string;

  @IsString()
  @IsOptional()
  arrivalRateValue?: string;

  @IsString()
  @IsOptional()
  @IsEnum(NumberOutputTweetsType,{message:'Formato invalido para el Tipo de Distribución para numberOutputTweetsType. Formatos aceptados son: spline, fixed, bernoulli, geom or nbinom'})
  numberOutputTweetsType?: NumberOutputTweetsType;

  @IsString()
  @IsOptional()
  numberOutputTweetsValue?: string;
}

class PositionDto {
  @IsString()
  @IsOptional()
  _id?: string;

  @IsNumber()
  x: number;

  @IsNumber()
  y: number;
}

class MeasuredDto {
  @IsString()
  @IsOptional()
  _id?: string;

  @IsNumber()
  width: number;

  @IsNumber()
  height: number;
}

class NodeDto {
  @IsString()
  @IsOptional()
  _id?: string;

  @IsString()
  id: string;

  @IsString()
  type: string;

  @IsObject()
  @ValidateNested()
  @Type(() => DataDto)
  data: DataDto;

  @IsObject()
  @ValidateNested()
  @Type(() => PositionDto)
  position: PositionDto;

  @IsObject()
  @ValidateNested()
  @Type(() => MeasuredDto)
  measured: MeasuredDto;

  @IsBoolean()
  @IsOptional()
  selected?: boolean;

  @IsBoolean()
  @IsOptional()
  dragging?: boolean;
}

class EdgeDataDto {
  @IsString()
  @IsOptional()
  _id?: string;

  @IsNumber()
  duration: number;

  @IsString()
  shape: string;

  @IsString()
  path: string;
}

class EdgeDto {
  @IsString()
  @IsOptional()
  _id?: string;

  @IsString()
  source: string;

  @IsString()
  target: string;

  @IsString()
  type: string;

  @IsObject()
  @ValidateNested()
  @Type(() => EdgeDataDto)
  data: EdgeDataDto;

  @IsString()
  id: string;
}

export class CreateSimulationDto {
  @IsString()
  @IsOptional()
  _id?: string;

  @IsString()
  @MinLength(3)
  name: string;

  @IsString()
  @MinLength(3)
  description: string;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => NodeDto)
  nodes: NodeDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EdgeDto)
  edges: EdgeDto[];

  @IsString()
  @IsNotEmpty()
  user: string;
}
