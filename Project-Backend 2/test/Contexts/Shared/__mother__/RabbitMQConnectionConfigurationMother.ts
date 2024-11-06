import { type ExchangeSettings } from '../../../../src/Contexts/Shared/infrastructure/EventBus/RabbitMQ/ExchangeSettings'
import { type ConnectionSettings } from '../../../../src/Contexts/Shared/infrastructure/EventBus/RabbitMQ/ConnectionSettings'

export class RabbitMQConnectionConfigurationMother {
  static create(): {
    connectionSettings: ConnectionSettings
    exchangeSettings: ExchangeSettings
  } {
    return {
      connectionSettings: {
        username: 'guest',
        password: 'guest',
        vhost: '/',
        connection: {
          secure: false,
          hostname: 'localhost',
          port: 5672
        }
      },
      exchangeSettings: { name: '' }
    }
  }
}
