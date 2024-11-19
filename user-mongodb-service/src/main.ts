import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices'; // Importa Transport para configurar RabbitMQ como transporte
import { ConfigService } from '@nestjs/config';


async function bootstrap() {
  // Crea la aplicación NestJS
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Configura la conexión a RabbitMQ
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [configService.get<string>('RABBITMQ_URL')],
      queue: process.env.USER_RABBITMQ_QUEUE,
      queueOptions: {
        durable: false,
      },
    },
  });

  // Inicia la microservicio de RabbitMQ
  await app.startAllMicroservices();  

  // Configura y arranca la aplicación HTTP en el puerto 3000
  await app.listen(configService.get<number>('PORT'));
  console.log(`User service is running on port: ${configService.get<number>('PORT')}`);
}

bootstrap();