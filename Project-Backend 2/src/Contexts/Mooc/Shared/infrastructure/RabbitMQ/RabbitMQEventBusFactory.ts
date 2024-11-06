import { type DomainEventFailoverPublisher } from '../../../../Shared/infrastructure/EventBus/DomainEventFailoverPublisher/DomainEventFailoverPublisher'
import { type RabbitMQConnection } from '../../../../Shared/infrastructure/EventBus/RabbitMQ/RabbitMQConnection'
import { RabbitMQEventBus } from '../../../../Shared/infrastructure/EventBus/RabbitMQ/RabbitMQEventBus'
import { type RabbitMQqueueFormatter } from '../../../../Shared/infrastructure/EventBus/RabbitMQ/RabbitMQqueueFormatter'
import { type RabbitMQConfig } from './RabbitMQConfigFactory'

export class RabbitMQEventBusFactory {
  static create(
    failoverPublisher: DomainEventFailoverPublisher,
    connection: RabbitMQConnection,
    queueNameFormatter: RabbitMQqueueFormatter,
    config: RabbitMQConfig
  ): RabbitMQEventBus {
    return new RabbitMQEventBus({
      failoverPublisher,
      connection,
      exchange: config.exchangeSettings.name,
      queueNameFormatter,
      maxRetries: config.maxRetries
    })
  }
}
