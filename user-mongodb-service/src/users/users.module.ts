import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersService } from './users.service';                // Importamos el servicio de usuarios
import { UsersController } from './users.controller';
import { RabbitMQModule } from '../rabbitmq/rabbitmq.module';  // Importamos el RabbitMQModule
import { User, UserSchema } from './schema/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    RabbitMQModule
  ],
  providers:    [UsersService],
  controllers:  [UsersController],
  exports:      [UsersService],
})
export class UsersModule {}
