import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { SimulationStatus } from './simulationstatus';

@Schema({_id: false})  // Evitar que se generen identificadores automaticos que cambian
class Data {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  replicationLevel: number;

  @Prop({ required: true })
  groupType: string;

  @Prop({ required: true })
  processor: string;

  @Prop({ required: false })
  avgServiceTimeType?: string;

  @Prop({ required: false })
  avgServiceTimeValue?: string;

  @Prop({ required: false })
  arrivalRateType?: string;

  @Prop({ required: false })
  arrivalRateValue?: string;

  @Prop({ required: false })
  numberOutputTweetsType?: string;

  @Prop({ required: false })
  numberOutputTweetsValue?: string;
}

const DataSchema = SchemaFactory.createForClass(Data);

@Schema({ _id: false })
class Position {
  @Prop({ required: true })
  x: number;

  @Prop({ required: true })
  y: number;
}

const PositionSchema = SchemaFactory.createForClass(Position);

@Schema({ _id: false })
class Measured {
  @Prop({ required: true })
  width: number;

  @Prop({ required: true })
  height: number;
}

const MeasuredSchema = SchemaFactory.createForClass(Measured);

@Schema({ _id: false })
class Node {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  type: string;

  @Prop({ type: DataSchema, required: true })
  data: Data;

  @Prop({ type: PositionSchema, required: true })
  position: Position;

  @Prop({ type: MeasuredSchema, required: true })
  measured: Measured;

  @Prop({ required: false })
  selected?: boolean;

  @Prop({ required: false })
  dragging?: boolean;
}

const NodeSchema = SchemaFactory.createForClass(Node);

@Schema({ _id: false })
class EdgeData {
  @Prop({ required: true })
  duration: number;

  @Prop({ required: true })
  shape: string;

  @Prop({ required: true })
  path: string;
}

const EdgeDataSchema = SchemaFactory.createForClass(EdgeData);

@Schema({ _id: false })
class Edge {
  @Prop({ required: true })
  source: string;

  @Prop({ required: true })
  target: string;

  @Prop({ required: true })
  type: string;

  @Prop({ type: EdgeDataSchema, required: true })
  data: EdgeData;

  @Prop({ required: true })
  id: string;
}

const EdgeSchema = SchemaFactory.createForClass(Edge);

@Schema({ timestamps: true, versionKey: false})
export class Simulation extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: [NodeSchema], required: true, _id: false })
  nodes: Node[];

  @Prop({ type: [EdgeSchema], required: true, _id: false })
  edges: Edge[];

  @Prop({
    required: true ,
    enum:SimulationStatus,
    default: SimulationStatus.Created,
  })
  status: SimulationStatus;

  @Prop({ required: true })
  user: string;
  
  @Prop({ type: Array, default: []})
  results: any[]
}

export const SimulationSchema = SchemaFactory.createForClass(Simulation);