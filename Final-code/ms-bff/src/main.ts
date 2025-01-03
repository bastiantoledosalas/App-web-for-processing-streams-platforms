import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

async function startApp(app: any, port: number, logger: Logger): Promise<void> {
  try {
    await app.listen(port);
    logger.log(`Application is running on port: ${port}`);
  } catch (error) {
    logger.error('Error starting the application', error.stack);
    process.exit(1);
  }
}

function configureValidation(app: any): void{
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist               : true, // Remueve propiedades no definidas en los DTO
      forbidNonWhitelisted    : true, // Lanza errores si hay propiedades no permitidas
      transform               : true, // Convierte automáticamente tipos primitivos
      validateCustomDecorators: true, // Asegura que los decoradores personalizados sean validados
    }),
  );
}

function configureGlobalSettings(app: any): void {
  const corsOptions: CorsOptions = {
    origin        : [
      'http://frontend:8000',
      'http://localhost:8000',
    ],
    methods       : 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization',
    credentials   : true, // Permitir el envío de cookies
  };

  app.enableCors(corsOptions);  // Habilita CORS para toda la aplicación
  app.setGlobalPrefix('api');   // Prefijo global para las rutas
}

async function gracefulShutdown(app: any, logger: Logger): Promise<void> {
  process.on('SIGINT', async () => {
    logger.log('SIGINT signal received. Shutting down gracefully');
    await app.close();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    logger.log('SIGTERM signal received. Shutting down gracefully');
    await app.close();
    process.exit(0);
  });
}

async function bootstrap() {
  const logger        = new Logger('Bootstrap');
  const app           = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port          = configService.get<number>('BFF_SERVICE_PORT');

  if (!port) {
    logger.error('BFF_SERVICE_PORT is not defined in the environment');
    process.exit(1);
  }

  // Configuración global de la aplicación
  configureGlobalSettings(app);

  // Configuración global de validación
  configureValidation(app);

  // Iniciar la aplicación
  await startApp(app, port, logger);

  // Manejo de apagado controlado
  await gracefulShutdown(app, logger);
}

bootstrap();