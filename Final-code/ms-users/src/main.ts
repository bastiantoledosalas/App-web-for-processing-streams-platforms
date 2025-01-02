import { NestFactory }    from '@nestjs/core';
import { AppModule }      from './app.module';
import { ConfigService }  from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function startApp(app:any, port: number, logger: Logger): Promise<void>{
  try {
      await app.listen(port);
      logger.log(`Users Service is running on: ${port}`);
    } catch (error) {
      logger.error('Error starting Users Service', { error });
      process.exit(1);
  }
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
  app.enableCors();                     // Habilita CORS para toda la aplicación
  app.setGlobalPrefix('ms-user')       // Prefijo global para las rutas
}

function setupSwagger(app: any): void {
  const config = new DocumentBuilder()
    .setTitle('Users Service API')
    .setDescription('API documentation for the Users Service')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // Documentación disponible en /api
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

async function bootstrap() {
  const logger        = new Logger('Bootstrap');
  const app           = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port          = configService.get<number>('USER_SERVICE_PORT');

  if (!port){
    throw new Error('USER_SERVICE_PORT is not defined in the environment');
  }
  
  // Configuración global de la aplicación
  configureGlobalSettings(app);
  
  // Configuración global de validación
  configureValidation(app);

  // Configuración de Swagger
  setupSwagger(app);

  // Iniciar la aplicación
  await startApp(app, port, logger);

  // Manejo de pagado controlado
  await gracefulShutdown(app, logger);
}

bootstrap();