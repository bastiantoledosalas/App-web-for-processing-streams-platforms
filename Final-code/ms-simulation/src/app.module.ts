import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SimulationsModule } from './simulations/simulations.module';
import { MongooseModule } from '@nestjs/mongoose';
import * as Joi from 'joi';

@Module({
  imports: [

    // Configuración global con validación de variables de entorno
    ConfigModule.forRoot({
       isGlobal         : true,
       validationSchema : Joi.object({
        MONGODB_URI     : Joi.string().uri().required(),
       }),
      }),
    
    // Configuración asíncrona de Mongoose con manejo de eventos
    MongooseModule.forRootAsync({
      imports   : [ConfigModule],
      inject    : [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri     : configService.get<string>('MONGODB_URI'),
        connectionFactory: (connection) => {
          connection.on('connected',() =>
          console.log('MongoDB connected successfully'),
          );
          connection.on('error',(error) =>
            console.error('MongoDB connection error:', error),
          );
          return connection;
        },
      }),
    }),
    SimulationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
