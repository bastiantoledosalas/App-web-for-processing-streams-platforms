import { Module, forwardRef } from '@nestjs/common';
import { RabbitMQService } from './rabbitmq.service';
import { RabbitMQConfig } from './rabbitmq.config';
import { ProcessingModule } from 'src/processing/processing.module';
/**
 * Modulo que gestiona la integración con RabbitMQ
 */
@Module({
  imports   : [ProcessingModule],   // Gestión de simulaciones y procesamiento
  providers : [
    RabbitMQService,  // Logica para la conexión y consumo del servicio RabbitMQ
    RabbitMQConfig    // Configuración de RabbitMQ
  ],
  exports   : [
    RabbitMQService   // Exporta RabbitMQService para ser reutilizable en otros modulos
  ], 
})
export class RabbitMQModule {}
