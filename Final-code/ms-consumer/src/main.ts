import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function startApp(app:any, port: number, logger: Logger): Promise<void>{
  try {
      await app.listen(port);
      logger.log(`Consumer Service is running on: ${port}`);
    } catch (error) {
      logger.error('Error starting Consumer Service', error.stack);
      process.exit(1);
  }
}

async function gracefulShutdown(app: any, logger: Logger): Promise<void> {
  process.on('SIGINT', async () => {
    logger.log('SIGINT signal received. shutting down gracefully');
    await app.close();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    logger.log('SIGTERM signal received. Shutting down gracefully');
    await app.close();
    process.exit(0);
  })
}

function configureValidation(app: any): void {
  app.useGlobalPipes(
    new ValidationPipe({
        whitelist                 : true,     // Remueven las propiedades no definidas en los DTO
        forbidNonWhitelisted      : true,     // Lanza errores si hay propiedades no permitidas
        transform                 : true,     // Convierte automaticamente tipos primitivos
        validateCustomDecorators  : true,     // Asegura que los decoradores personalizados sean validados
    }),
  );
}

function configureGlobalSettings(app: any): void {
  app.enableCors();                   // Habilita CORS para toda la aplicación
  app.setGlobalPrefix('ms-consumer') // Prefijo global para las rutas
}

async function bootstrap() {
  const logger        = new Logger('Bootstrap');
  const app           = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port          = configService.get<number>('CONSUMER_SERVICE_PORT');

  if (!port){
    logger.error('CONSUMER_SERVICE_PORT is not defined in the environment');
    process.exit(1);
  }

  // Configuración global de la aplicación
  configureGlobalSettings(app);
  
  // Configuración global de validación
  configureValidation(app);

  // Iniciar la aplicación
  await startApp(app, port, logger);

  // Manejo de pagado controlado
  await gracefulShutdown(app, logger);
}
bootstrap();
