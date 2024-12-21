import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ProcessingModule } from './processing/processing.module';
import { RabbitMQModule } from './rabbitmq/rabbitmq.module';
import { HttpClientModule } from './httpclient/http-client.module';

@Module({
  imports: [
    ConfigModule.forRoot({  // Configuración global para las variables de entorno
      isGlobal: true,       // Variables de entorno disponibles en toda la aplicación
    }),
    
    ProcessingModule,
    RabbitMQModule,
    HttpClientModule,
  ],
})
export class AppModule {}