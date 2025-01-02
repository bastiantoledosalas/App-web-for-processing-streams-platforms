import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

@Schema({ versionKey: false, timestamps: true }) 
export class User extends Document {

  @ApiProperty({ description: 'The name of the user.', example: 'John'})
  @Prop({ required: true })
  name: string;

  @ApiProperty({ description: 'The lastname of the user.', example: 'Doe'})
  @Prop({ required: true })
  lastname: string;

  @ApiProperty({ description: 'The email of the user. This field is unique.', example: 'john.doe@example.com'})
  @Prop({ required: true, unique: true })
  email: string;

  @ApiProperty({ description: 'The password of the user. This field is not returned in API responses by default.', example: '123456', writeOnly: true})
  @Prop({ required: true, select: false })
  password: string;

  @ApiProperty({ description: 'The role of the user. Default value is "user".', example: 'user', enum: ['admin', 'user', 'superuser']})
  @Prop({ required: true, default: 'user' })
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
