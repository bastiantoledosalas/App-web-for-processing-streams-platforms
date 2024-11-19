import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schema/user.schema';
import { UsersController } from './users.controller';
import { RabbitMQModule } from '../rabbitmq/rabbitmq.module';  // Importamos el RabbitMQModule
import { UsersService } from './users.service';                // Importamos el servicio de usuarios


@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    RabbitMQModule
  ],
  controllers: [RabbitMQModule,UsersController],
  providers: [UsersService],
})
export class UsersModule {}
