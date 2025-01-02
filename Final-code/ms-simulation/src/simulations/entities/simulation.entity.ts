import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { SimulationStatus } from './simulationstatus';
import { ApiProperty } from '@nestjs/swagger';

@Schema({_id: false})  // Evitar que se generen identificadores automaticos que cambian
class Data {

  @ApiProperty({ description: 'Nombre del nodo', example: 'Nodo 1' })
  @Prop({ required: true })
  name: string;

  @ApiProperty({ description: 'Tipo de nodo', example: 'S' })
  @Prop({ required: true })
  type: string;

  @ApiProperty({ description: 'Nivel de replicación del nodo', example: 1 })
  @Prop({ required: true })
  replicationLevel: number;

  @ApiProperty({ description: 'Tipo de agrupamiento', example: '0' })
  @Prop({ required: true })
  groupType: string;

  @ApiProperty({ description: 'Dirección IP del procesador', example: '10.0.0.2' })
  @Prop({ required: true })
  processor: string;

  @ApiProperty({ description: 'Tipo de distribución para avgServiceTime', example: 'spline', required: false })
  @Prop({ required: false })
  avgServiceTimeType?: string;

  @ApiProperty({ description: 'Valor de la distribución para avgServiceTime', example: 'fixed(2)', required: false })
  @Prop({ required: false })
  avgServiceTimeValue?: string;

  @ApiProperty({ description: 'Tipo de distribución para arrivalRate', example: 'expon', required: false })
  @Prop({ required: false })
  arrivalRateType?: string;

  @ApiProperty({ description: 'Valor de la distribución para arrivalRate', example: 'fixed(10)', required: false })
  @Prop({ required: false })
  arrivalRateValue?: string;

  @ApiProperty({ description: 'Tipo de distribución para numberOutputTweets', example: 'bernoulli', required: false })
  @Prop({ required: false })
  numberOutputTweetsType?: string;

  @ApiProperty({ description: 'Valor de la distribución para numberOutputTweets', example: 'fixed(100)', required: false })
  @Prop({ required: false })
  numberOutputTweetsValue?: string;
}

const DataSchema = SchemaFactory.createForClass(Data);

@Schema({ _id: false })
class Position {

  @ApiProperty({ description: 'Posición X del nodo', example: 100 })
  @Prop({ required: true })
  x: number;

  @ApiProperty({ description: 'Posición Y del nodo', example: 200 })
  @Prop({ required: true })
  y: number;
}

const PositionSchema = SchemaFactory.createForClass(Position);

@Schema({ _id: false })
class Measured {

  @ApiProperty({ description: 'Ancho del nodo', example: 50 })
  @Prop({ required: true })
  width: number;

  @ApiProperty({ description: 'Altura del nodo', example: 50 })
  @Prop({ required: true })
  height: number;
}

const MeasuredSchema = SchemaFactory.createForClass(Measured);

@Schema({ _id: false })
class Node {

  @ApiProperty({ description: 'Identificador único del nodo', example: 'S-0' })
  @Prop({ required: true })
  id: string;

  @ApiProperty({ description: 'Tipo de nodo', example: 'custom' })
  @Prop({ required: true })
  type: string;

  @ApiProperty({ type: Data, description: 'Datos asociados al nodo' })
  @Prop({ type: DataSchema, required: true })
  data: Data;

  @ApiProperty({ type: Position, description: 'Posición del nodo' })
  @Prop({ type: PositionSchema, required: true })
  position: Position;

  @ApiProperty({ type: Measured, description: 'Mediciones del nodo' })
  @Prop({ type: MeasuredSchema, required: true })
  measured: Measured;

  @ApiProperty({ description: 'Indica si el nodo está seleccionado', example: false, required: false })
  @Prop({ required: false })
  selected?: boolean;

  @ApiProperty({ description: 'Indica si el nodo está siendo arrastrado', example: true, required: false })
  @Prop({ required: false })
  dragging?: boolean;
}

const NodeSchema = SchemaFactory.createForClass(Node);

@Schema({ _id: false })
class EdgeData {

  @ApiProperty({ description: 'Duración de la arista', example: 10 })
  @Prop({ required: true })
  duration: number;

  @ApiProperty({ description: 'Forma de la arista', example: 'package' })
  @Prop({ required: true })
  shape: string;

  @ApiProperty({ description: 'Ruta de la arista', example: 'smoothstep' })
  @Prop({ required: true })
  path: string;
}

const EdgeDataSchema = SchemaFactory.createForClass(EdgeData);

@Schema({ _id: false })
class Edge {

  @ApiProperty({ description: 'Nodo origen de la arista', example: 'S-0' })
  @Prop({ required: true })
  source: string;

  @ApiProperty({ description: 'Nodo destino de la arista', example: 'B-1' })
  @Prop({ required: true })
  target: string;

  @ApiProperty({ description: 'Tipo de arista', example: 'animatedSvgEdge' })
  @Prop({ required: true })
  type: string;

  @ApiProperty({ type: EdgeData, description: 'Datos de la arista' })
  @Prop({ type: EdgeDataSchema, required: true })
  data: EdgeData;

  @ApiProperty({ description: 'Identificador único de la arista', example: 'xy-edge__S-0-B-1' })
  @Prop({ required: true })
  id: string;
}

const EdgeSchema = SchemaFactory.createForClass(Edge);

@Schema({ timestamps: true, versionKey: false})
export class Simulation extends Document {

  @ApiProperty({ description: 'Nombre de la simulación', example: 'Simulación de prueba' })
  @Prop({ required: true })
  name: string;

  @ApiProperty({ description: 'Descripción de la simulación', example: 'Simulación de ejemplo' })
  @Prop({ required: true })
  description: string;

  @ApiProperty({ type: [Node], description: 'Lista de nodos de la simulación' })
  @Prop({ type: [NodeSchema], required: true, _id: false })
  nodes: Node[];

  @ApiProperty({ type: [Edge], description: 'Lista de aristas de la simulación' })
  @Prop({ type: [EdgeSchema], required: true, _id: false })
  edges: Edge[];

  @ApiProperty({ description: 'Estado de la simulación', enum: SimulationStatus, default: SimulationStatus.Created, example: SimulationStatus.Created })
  @Prop({
    required: true ,
    enum:SimulationStatus,
    default: SimulationStatus.Created,
  })
  status: SimulationStatus;

  @ApiProperty({ description: 'Usuario que creó la simulación', example: 'JohnDoe@gmail.com' })
  @Prop({ required: true })
  user: string;
  
  @ApiProperty({ description: 'Resultados de la simulación', type: [Object], default: [] })
  @Prop({ type: Array, default: []})
  results: any[]
}

export const SimulationSchema = SchemaFactory.createForClass(Simulation);