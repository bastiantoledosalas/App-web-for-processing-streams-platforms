import { Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import { Document, Schema as dbSchema } from 'mongoose';

export type SimulationDocument = Simulation & Document;

@Schema({
  timestamps: true
})
export class Simulation{

  @Prop({
    type: dbSchema.Types.ObjectId,
    auto: true,
    unique: true
  })
  simulation_id: string;

  @Prop({ required: true })
  name: string;

  @Prop({
    select: false,
    required: true })
  description: string;

  @Prop({ type: Array, required: true })
  nodes: any[];

  @Prop({ type: Array, required: true })
  edges: any[];
}

export const SimulationSchema = SchemaFactory.createForClass(Simulation);