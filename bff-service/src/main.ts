import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuración de microservicio de RabbitMQ
  app.connectMicroservice<MicroserviceOptions>({

    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL],   
      queue: 'bff_queue',                 //Nombre de la cola que se usará
      queueOptions: {
        durable: false,
      },
    },
  });

  await app.startAllMicroservices();
  await app.listen(process.env.BFF_SERVICE_PORT)
  console.log(`BFF server application is running on: ${await app.getUrl()}`);
}
bootstrap();
