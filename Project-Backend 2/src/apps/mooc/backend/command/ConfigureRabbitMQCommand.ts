import { DomainEventSubscribers } from '../../../../Contexts/Shared/infrastructure/EventBus/DomainEventSubscribers'
import { RabbitMQConfigurer } from '../../../../Contexts/Shared/infrastructure/EventBus/RabbitMQ/RabbitMQConfigurer'
import { type RabbitMQConnection } from '../../../../Contexts/Shared/infrastructure/EventBus/RabbitMQ/RabbitMQConnection'
import { type RabbitMQConfig } from '../../../../Contexts/Mooc/Shared/infrastructure/RabbitMQ/RabbitMQConfigFactory'
import container from '../dependency-injection'
import { type RabbitMQqueueFormatter } from '../../../../Contexts/Shared/infrastructure/EventBus/RabbitMQ/RabbitMQqueueFormatter'

export class ConfigureRabbitMQCommand {
  static async run(): Promise<ConfigureRabbitMQCommand> {
    const connection = container.get<RabbitMQConnection>(
      'Mooc.Shared.RabbitMQConnection'
    )
    const nameFormatter = container.get<RabbitMQqueueFormatter>(
      'Mooc.Shared.RabbitMQqueueFormatter'
    )
    const { exchangeSettings, retryTtl } = container.get<RabbitMQConfig>(
      'Mooc.Shared.RabbitMQConfig'
    )
    await connection.connect()
    const configurer = new RabbitMQConfigurer(
      connection,
      nameFormatter,
      retryTtl
    )
    const subscribers = DomainEventSubscribers.from(container).items
    await configurer.configure({ exchange: exchangeSettings.name, subscribers })
    return new ConfigureRabbitMQCommand()
  }
}
