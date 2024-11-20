import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SimulationsModule } from './simulations/simulations.module';
import configuration from './config/configuration';
import { RabbitMQModule } from './rabbitmq/rabbitmq.module';

@Module({
  imports: [
    SimulationsModule,
    RabbitMQModule,
    ConfigModule.forRoot({
      load: [configuration],
       isGlobal: true
      }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('database.uri'),   // MongoDB Atlas URL
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}


