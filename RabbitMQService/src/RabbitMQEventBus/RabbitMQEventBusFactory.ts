import { DomainEventFailoverPublisher } from '../../../../Shared/infrastructure/EventBus/DomainEventFailoverPublisher/DomainEventFailoverPublisher';

import { RabbitMqConnection } from '../RabbitMQConnection/RabbitMqConnection';

import { RabbitMQEventBus } from './RabbitMqEventBus';

import { RabbitMQqueueFormatter } from '../RabbitMQFormatterNameQueue/RabbitMQqueueFormatter';

import { RabbitMQConfig } from '../RabbitMQConfig/RabbitMQConfigFactory';

export class RabbitMQEventBusFactory {
  static create(
    failoverPublisher: DomainEventFailoverPublisher,
    connection: RabbitMqConnection,
    queueNameFormatter: RabbitMQqueueFormatter,
    config: RabbitMQConfig
  ): RabbitMQEventBus {
    return new RabbitMQEventBus({
      failoverPublisher,
      connection,
      exchange: config.exchangeSettings.name,
      queueNameFormatter: queueNameFormatter,
      maxRetries: config.maxRetries
    });
  }
}
