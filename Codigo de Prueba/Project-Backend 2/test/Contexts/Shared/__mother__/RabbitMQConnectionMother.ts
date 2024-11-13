import { RabbitMQConnection } from '../../../../src/Contexts/Shared/infrastructure/EventBus/RabbitMQ/RabbitMQConnection'
import { RabbitMQConnectionDouble } from '../__mocks__/RabbitMQConnectionDouble'
import { RabbitMQConnectionConfigurationMother } from './RabbitMQConnectionConfigurationMother'

export class RabbitMQConnectionMother {
  static async create(): Promise<RabbitMQConnection> {
    const config = RabbitMQConnectionConfigurationMother.create()
    const connection = new RabbitMQConnection(config)
    await connection.connect()
    return connection
  }

  static failOnPublish(): RabbitMQConnection {
    return new RabbitMQConnectionDouble(
      RabbitMQConnectionConfigurationMother.create()
    )
  }
}
