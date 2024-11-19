import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { RabbitMQModule } from './rabbitmq/rabbitmq.module';  // Importa el módulo RabbitMQ
import { UsersService } from '@@users/users.service';

@Module({
  imports: [
    RabbitMQModule,
    ConfigModule.forRoot({ isGlobal: true }), // Configuración de variables de entorno
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
      inject: [ConfigService],
    }),
    UsersModule,
  ],
  providers: [UsersService]
})
export class AppModule {}


