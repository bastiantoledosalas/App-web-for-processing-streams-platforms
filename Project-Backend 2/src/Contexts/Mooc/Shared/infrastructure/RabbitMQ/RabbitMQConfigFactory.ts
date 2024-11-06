import { type ConnectionSettings } from '../../../../Shared/infrastructure/EventBus/RabbitMQ/ConnectionSettings'
import { type ExchangeSettings } from '../../../../Shared/infrastructure/EventBus/RabbitMQ/ExchangeSettings'
import config from '../config'

export interface RabbitMQConfig {
  connectionSettings: ConnectionSettings
  exchangeSettings: ExchangeSettings
  maxRetries: number
  retryTtl: number
}

export class RabbitMQConfigFactory {
  static createConfig(): RabbitMQConfig {
    return config.get('rabbitmq')
  }
}
