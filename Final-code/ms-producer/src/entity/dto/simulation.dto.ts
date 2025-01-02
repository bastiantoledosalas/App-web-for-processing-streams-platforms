import { IsNotEmpty, IsString, IsArray, ValidateNested, IsEnum, IsNumber, IsBoolean, IsOptional, Matches, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { DistributionTypeAvgServiceTime, NumberOutputTweetsType } from './distributions';
import { ApiProperty } from '@nestjs/swagger';
import { SimulationStatus } from './simulationstatus';

// Expresión regular para validar direcciones IP en formato x.x.x.x
const processorRegex = /^10\.(0|1|2|3)\.(0|1)\.(2|[2-9][0-9]?|1[0-9]{2}|2[0-4][0-9]|25[0-4])$/;

class NodeDataDto {

  @ApiProperty({ description: 'Nombre del nodo', example: 'node-1' })
  @IsString()
  @IsNotEmpty()
  name: string; // Nombre del nodo

  @ApiProperty({ description: 'Tipo de Nodo (Spout o Bolt)', example: 'S' })
  @IsString()
  @IsNotEmpty()
  @IsEnum(['S','B'], { message: 'Tipo de Nodo debe ser "S" o "B"'}) // Valida que el tipo de Nodo Sea Spout o Bolt
  type: string; // Tipo de Nodo: Spout (S) o Bolt (B)

  @ApiProperty({ description: 'Nivel de replicación del nodo', example: 2 })
  @IsNumber()
  @IsNotEmpty()
  @Min(1, { message: 'El nivel de replicación debe ser mayor o igual a 1.' })
  replicationLevel: number; // Nivel de Replicación 

  @ApiProperty({ description: 'Tipo de agrupamiento del nodo', example: '0' })
  @IsString()
  @IsNotEmpty()
  @IsEnum(['0','1','2','3'],{message: 'El tipo de agrupamiento debe ser uno de los valores predefinidos: 0, 1 , 2 or 3'}) 
  groupType: string;   // Tipo de Agrupamiento

  @ApiProperty({ description: 'Dirección IP del procesador', example: '10.0.1.2' })
  @IsString()
  @IsNotEmpty()
  @Matches(processorRegex,{message: 'La IP debe estar en el rango del Fat Tree: 10.<0-3>.<0-1>.<2-254>'})
  processor: string;

  @ApiProperty({ description: 'Tipo de distribución para el tiempo de servicio promedio', example: 'expon' })
  @IsString()
  @IsNotEmpty()
  @IsEnum(DistributionTypeAvgServiceTime,{message:'Formato invalido para el Tipo de Distribución. Formatos aceptados son: spline, fixed, chi2, maxwell, expon, invgauss, norm or lognorm'})
  avgServiceTimeType: DistributionTypeAvgServiceTime;

  @ApiProperty({ description: 'Valor de la distribución del tiempo de servicio promedio', example: 'fixed(100)' })
  @IsString()
  @IsString()
  @IsNotEmpty()
  avgServiceTimeValue: string;

  // Solo para nodos tipo S
  @ApiProperty({ description: 'Tipo de distribución de la tasa de llegada (solo para nodos tipo S)', example: 'expon', required: false })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @IsEnum(DistributionTypeAvgServiceTime,{message: 'Formato invalido para el Tipo de Distribución. Formatos aceptados son: spline, fixed, chi2, maxwell, expon, invgauss, norm or lognorm'})
  arrivalRateType?: DistributionTypeAvgServiceTime;

  @ApiProperty({ description: 'Valor de la tasa de llegada (solo para nodos tipo S)', example: 'fixed(50)', required: false })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  arrivalRateValue?: string;

  // Solo para nodos tipo B
  @ApiProperty({ description: 'Tipo de distribución para el número de tweets de salida (solo para nodos tipo B)', example: 'bernoulli', required: false })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @IsEnum(NumberOutputTweetsType,{message:'Formato invalido para el Tipo de Distribución. Formatos aceptados son: spline, fixed, bernoulli, geom or nbinom'})
  numberOutputTweetsType?: NumberOutputTweetsType;

  @ApiProperty({ description: 'Valor para el número de tweets de salida (solo para nodos tipo B)', example: 'fixed(10)', required: false })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  numberOutputTweetsValue?: string;

}

class PositionDto {

  @ApiProperty({ description: 'Posición en el eje X', example: 100 })
  @IsNumber()
  @IsNotEmpty()
  x: number;

  @ApiProperty({ description: 'Posición en el eje Y', example: 200 })
  @IsNumber()
  @IsNotEmpty()
  y: number;
}

class MeasuredDto {

  @ApiProperty({ description: 'Ancho del nodo', example: 50 })
  @IsNumber()
  @IsNotEmpty()
  width: number;

  @ApiProperty({ description: 'Altura del nodo', example: 60 })
  @IsNumber()
  @IsNotEmpty()
  height: number;
}

export class NodeDto {

  @ApiProperty({ description: 'ID del nodo', example: 'S-1' })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ description: 'Tipo de nodo', example: 'custom' })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({ description: 'Datos del nodo', type: NodeDataDto })
  @ValidateNested({each: true})
  @Type(() => NodeDataDto)
  data: NodeDataDto;

  @ApiProperty({ description: 'Posición del nodo', type: PositionDto })
  @ValidateNested()
  @Type(() => PositionDto)
  position: PositionDto;

  @ApiProperty({ description: 'Medidas del nodo', type: MeasuredDto })
  @ValidateNested({each: true})
  @Type(() => MeasuredDto)
  measured: MeasuredDto;

  @ApiProperty({ description: 'Indica si el nodo está seleccionado', example: true })
  @IsBoolean()
  @IsNotEmpty()
  selected: boolean;

  @ApiProperty({ description: 'Indica si el nodo está siendo arrastrado', example: false })
  @IsBoolean()
  @IsNotEmpty()
  dragging: boolean;
}

class EdgeDataInnerDto {

  @ApiProperty({ description: 'Duración del borde', example: 500 })
  @IsNumber()
  @IsNotEmpty()
  duration: number;

  @ApiProperty({ description: 'Forma del borde', example: 'package' })
  @IsString()
  @IsNotEmpty()
  shape: string;

  @ApiProperty({ description: 'Ruta del borde', example: 'smoothstep' })
  @IsString()
  @IsNotEmpty()
  path: string;
}

export class EdgeDataDto {

  @ApiProperty({ description: 'ID del nodo origen', example: 'node1' })
  @IsNotEmpty()
  source: string;

  @ApiProperty({ description: 'ID del nodo destino', example: 'node2' })
  @IsString()
  @IsNotEmpty()
  target: string;

  @ApiProperty({ description: 'Tipo de la arista', example: 'animatedSvgEdge' })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({ description: 'Datos de la arista', type: EdgeDataDto })
  @ValidateNested({each: true})
  @Type(() => EdgeDataInnerDto)
  data: EdgeDataInnerDto;

  @ApiProperty({ description: 'ID único de la arista', example: 'xy-edge__S-0-B-1' })
  @IsString()
  @IsNotEmpty()
  id: string;
}

export class ValidatedSimulationDto {

  @IsString()
  @IsNotEmpty()
  _id: string

  @ApiProperty({ description: 'Nombre de la simulación', example: 'Simulación 1' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Descripción de la simulación', example: 'Descripción de la simulación de prueba' })
  @IsString()
  description: string;

  @ApiProperty({ description: 'Lista de nodos involucrados en la simulación', type: [NodeDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => NodeDto)
  nodes: NodeDto[];

  @ApiProperty({ description: 'Lista de aristas que conectan los nodos', type: [EdgeDataDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EdgeDataDto)
  edges: EdgeDataDto[];

  @ApiProperty({ description: 'Estado de la simulación', enum: SimulationStatus, default: SimulationStatus.Created, example: SimulationStatus.Created })
  @IsString()
  @IsNotEmpty()
  status: SimulationStatus;

  @ApiProperty({ description: 'Usuario que creó la simulación', example: 'JohnDoe@gmail.com' })
  @IsString()
  @IsNotEmpty()
  user: string;

  @ApiProperty({ description: 'Resultados de la simulación', type: [Object], default: [] })
  @IsArray()
  results: any[];
 
  @IsNotEmpty()
  createdAt: string;

  @IsNotEmpty()
  updatedAt: string;
}
