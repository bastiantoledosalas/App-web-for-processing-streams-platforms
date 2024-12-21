import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';


/**
 * Configuración para RabbitMQ, incluyendo URL, cola, opciones de la cola y reintentos.
 */
@Injectable()
export class RabbitMQConfig {
  private readonly urls : string;
  private readonly queue: string;
  private readonly queueOptions:  Record<string, any>;
  private readonly retryOptions:  Record<string, any>;

  constructor(private configService: ConfigService) {
    // Configuración basica de RabbitMQ
    this.urls         = this.configService.get<string>('RABBITMQ_URL');
    this.queue        = this.configService.get<string>('RABBITMQ_QUEUE');
    
    // Opciones de cola
    this.queueOptions = {
      durable   : true,
      arguments : {
        'x-dead-letter-exchange'    : this.configService.get<string>('RABBITMQ_DLX_EXCHANGE', ''),
        'x-dead-letter-routing-key' : this.configService.get<string>('RABBITMQ_DLX_ROUTING_KEY', this.configService.get<string>('RABBITMQ_DLX_QUEUE')),
        'x-message-ttl'             : this.configService.get<number>('RABBITMQ_MESSAGE_TTL', 5000),
        'x-max-retries'             : this.configService.get<number>('RABBITMQ_MAX_RETRIES',5),
        'x-retry-delay'             : this.configService.get<number>('RABBITMQ_RETRY_DELAY', 1000),
      },
    };
  }

  /**
     * Obtiene la URL del servidor RabbitMQ.
     * @returns URL del servidor
     */
  getUrl(): string {
    return this.urls;
  }

  // Método para obtener el 'x-dead-letter-exchange'
  getDeadLetterExchange(): string {
    return this.queueOptions.arguments['x-dead-letter-exchange'];
  }

  // Método para obtener el 'x-dead-letter-routing-key'
  getDeadLetterRoutingKey(): string {
    return this.queueOptions.arguments['x-dead-letter-routing-key'];
  }
  /**
   * Obtiene el nombre de la cola de RabbitMQ.
   * @returns Nombre de la cola
   */
  getQueue(): string {
    return this.queue;
  }

  /**
   * Obtiene las opciones de configuración de la cola.
   * @returns Opciones de la cola
   */
  getQueueOptions(): Record<string, any> {
    return this.queueOptions;
  }

  /**
   * Obtiene las opciones de reintento.
   * @returns Opciones de reintento
   */
  getRetryOptions(): Record<string, any> {
    return this.retryOptions;
  }
}
