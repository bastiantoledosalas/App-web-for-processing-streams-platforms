import { IsString, IsArray, ValidateNested, IsObject, IsBoolean, IsNumber, MinLength, ArrayNotEmpty, IsNotEmpty, IsOptional, IsEnum, Matches, Min } from 'class-validator';
import { DistributionTypeAvgServiceTime, NumberOutputTweetsType } from './distributions';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

const processorRegex = /^10\.(0|1|2|3)\.(0|1)\.(2|[2-9]|[12][0-9]|3[0-9]|4[0-9]|5[0-9]|6[0-9]|7[0-9]|8[0-9]|9[0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-4])$/;

class DataDto {

  @ApiProperty({ description: 'Identificador opcional del nodo', required: false })
  @IsString()
  @IsOptional()
  _id?: string;

  @ApiProperty({ description: 'Nombre del nodo', example: 'Node1' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Tipo de nodo (Spout o Bolt)', enum: ['S', 'B'] })
  @IsString()
  @IsNotEmpty()
  @IsEnum(['S','B'], { message: 'Tipo de Nodo debe ser "S" o "B"'})
  type: string;

  @ApiProperty({ description: 'Nivel de replicación del nodo', example: 2 })
  @IsNumber()
  @IsNotEmpty()
  @Min(1, { message: 'El nivel de replicación debe ser mayor o igual a 1.' })
  replicationLevel: number;

  @ApiProperty({ description: 'Tipo de agrupamiento del nodo', enum: ['0', '1', '2', '3'] })
  @IsString()
  @IsNotEmpty()
  @IsEnum(['0','1','2','3'],{message: 'El tipo de agrupamiento debe ser uno de los valores predefinidos: 0, 1 , 2 or 3' })
  groupType: string;

  @ApiProperty({ description: 'IP del procesador en el rango del Fat Tree', example: '10.0.0.2' })
  @Matches(processorRegex,{message: 'La IP debe estar en el rango del Fat Tree: 10.<0-3>.<0-1>.<2-254>'})
  processor: string;

  @ApiProperty({ description: 'Tipo de distribución de tiempo de servicio promedio', enum: DistributionTypeAvgServiceTime })
  @IsString()
  @IsNotEmpty()
  @IsEnum(DistributionTypeAvgServiceTime,{message:'Formato invalido para el Tipo de Distribución para avgServiceTimeType. Formatos aceptados son: spline, fixed, chi2, maxwell, expon, invgauss, norm or lognorm'})
  avgServiceTimeType: DistributionTypeAvgServiceTime;

  @ApiProperty({ description: 'Valor de la distribución de tiempo de servicio promedio', example: 'fixed(10)' })
  @IsString()
  avgServiceTimeValue: string;

  @ApiProperty({ description: 'Tipo de distribución para la tasa de llegada (opcional)', enum: DistributionTypeAvgServiceTime, required: false })
  @IsString()
  @IsOptional()
  @IsEnum(DistributionTypeAvgServiceTime,{message: 'Formato invalido para el Tipo de Distribución en arrivalRateType. Formatos aceptados son: spline, fixed, chi2, maxwell, expon, invgauss, norm or lognorm'})
  arrivalRateType?: string;

  @ApiProperty({ description: 'Valor de la tasa de llegada (opcional)', example: 'fixed(5)', required: false })
  @IsString()
  @IsOptional()
  arrivalRateValue?: string;

  @ApiProperty({ description: 'Tipo de distribución para el número de tweets generados (opcional)', enum: NumberOutputTweetsType, required: false })
  @IsString()
  @IsOptional()
  @IsEnum(NumberOutputTweetsType,{message:'Formato invalido para el Tipo de Distribución para numberOutputTweetsType. Formatos aceptados son: spline, fixed, bernoulli, geom or nbinom'})
  numberOutputTweetsType?: NumberOutputTweetsType;

  @ApiProperty({ description: 'Valor de la distribución para el número de tweets generados (opcional)', example: 'fixed(100)', required: false })
  @IsString()
  @IsOptional()
  numberOutputTweetsValue?: string;
}

class PositionDto {

  @ApiProperty({ description: 'Identificador opcional de la posición', required: false })
  @IsString()
  @IsOptional()
  _id?: string;

  @ApiProperty({ description: 'Coordenada X de la posición', example: 100 })
  @IsNumber()
  x: number;

  @ApiProperty({ description: 'Coordenada Y de la posición', example: 200 })
  @IsNumber()
  y: number;
}

class MeasuredDto {

  @ApiProperty({ description: 'Identificador opcional de las dimensiones', required: false })
  @IsString()
  @IsOptional()
  _id?: string;

  @ApiProperty({ description: 'Ancho del nodo', example: 50 })
  @IsNumber()
  width: number;

  @ApiProperty({ description: 'Alto del nodo', example: 80 })
  @IsNumber()
  height: number;
}

class NodeDto {

  @ApiProperty({ description: 'Identificador opcional del nodo', required: false })
  @IsString()
  @IsOptional()
  _id?: string;

  @ApiProperty({ description: 'ID del nodo', example: 'S-0' })
  @IsString()
  id: string;

  @ApiProperty({ description: 'Tipo de nodo (Spout o Bolt)', example: 'custom' })
  @IsString()
  type: string;

  @ApiProperty({ description: 'Datos del nodo', type: DataDto })
  @IsObject()
  @ValidateNested({ each: true})
  @Type(() => DataDto)
  data: DataDto;

  @ApiProperty({ description: 'Posición del nodo', type: PositionDto })
  @IsObject()
  @ValidateNested()
  @Type(() => PositionDto)
  position: PositionDto;

  @ApiProperty({ description: 'Dimensiones del nodo', type: MeasuredDto })
  @IsObject()
  @ValidateNested()
  @Type(() => MeasuredDto)
  measured: MeasuredDto;

  @ApiProperty({ description: 'Estado de selección del nodo', required: false })
  @IsBoolean()
  @IsOptional()
  selected?: boolean;

  @ApiProperty({ description: 'Estado de arrastre del nodo', required: false })
  @IsBoolean()
  @IsOptional()
  dragging?: boolean;
}

class EdgeDataDto {

  @ApiProperty({ description: 'Identificador opcional de los datos de la arista', required: false })
  @IsString()
  @IsOptional()
  _id?: string;

  @ApiProperty({ description: 'Duración de la arista', example: 10 })
  @IsNumber()
  duration: number;

  @ApiProperty({ description: 'Forma de la arista', example: 'package' })
  @IsString()
  shape: string;

  @ApiProperty({ description: 'Ruta de la arista', example: 'smoothstep' })
  @IsString()
  path: string;
}

class EdgeDto {

  @ApiProperty({ description: 'Identificador opcional de la arista', required: false })
  @IsString()
  @IsOptional()
  _id?: string;

  @ApiProperty({ description: 'ID del nodo origen', example: 'node1' })
  @IsString()
  source: string;

  @ApiProperty({ description: 'ID del nodo destino', example: 'node2' })
  @IsString()
  target: string;

  @ApiProperty({ description: 'Tipo de la arista', example: 'animatedSvgEdge' })
  @IsString()
  type: string;

  @ApiProperty({ description: 'Datos de la arista', type: EdgeDataDto })
  @IsObject()
  @ValidateNested()
  @Type(() => EdgeDataDto)
  data: EdgeDataDto;

  @ApiProperty({ description: 'ID único de la arista', example: 'xy-edge__S-0-B-1' })
  @IsString()
  id: string;
}

export class CreateSimulationDto {
  
  @ApiProperty({ description: 'Nombre de la simulación', example: 'Simulación 1' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  name: string;

  @ApiProperty({ description: 'Descripción de la simulación', example: 'Descripción de la simulación de prueba' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  description: string;

  @ApiProperty({ description: 'Lista de nodos involucrados en la simulación', type: [NodeDto] })
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => NodeDto)
  nodes: NodeDto[];

  @ApiProperty({ description: 'Lista de aristas que conectan los nodos', type: [EdgeDto] })
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => EdgeDto)
  edges: EdgeDto[];

  @ApiProperty({ description: 'Usuario que crea la simulación', example: 'JohnDoe@gmail.com' })
  @IsString()
  @IsNotEmpty()
  user: string;
}