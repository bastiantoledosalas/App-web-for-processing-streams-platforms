import { Prop, Schema, SchemaFactory, getModelToken } from '@nestjs/mongoose';
import { Document, Schema as dbSchema } from 'mongoose';

export type UserDocument = User & Document;

@Schema({
  timestamps: true
})
export class User{

  @Prop({
    type: dbSchema.Types.ObjectId,
    auto: true,
    unique: true
  })
  user_id: string;

  @Prop({
    select: false,
    required: true
  })
  userFirstName: string;

  @Prop({
    select: false,
    required: true })
  userLastName: string;

  @Prop({
    unique: true,
    required: true })
  userEmail: string;

  @Prop({
    required: true})
  userPassword: string;

  @Prop({
    enum: ['admin', 'user'],
    required: [true, 'Un usuario debe tener un rol']
  })
  role: string
}

export const UserSchema = SchemaFactory.createForClass(User);
