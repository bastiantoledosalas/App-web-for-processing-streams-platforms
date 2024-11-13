import { type DomainEvent } from '../../../domain/DomainEvent'
import { type DomainEventSubscriber } from '../../../domain/DomainEventSubscriber'
import { type DomainEventDeserializer } from '../DomainEventDeserializer'
import { type RabbitMQConnection } from './RabbitMQConnection'
import { RabbitMQConsumer } from './RabbitMQConsumer'

export class RabbitMQConsumerFactory {
  constructor(
    private readonly deserializer: DomainEventDeserializer,
    private readonly connection: RabbitMQConnection,
    private readonly maxRetries: number
  ) {}

  build(
    subscriber: DomainEventSubscriber<DomainEvent>,
    exchange: string,
    queueName: string
  ): RabbitMQConsumer {
    return new RabbitMQConsumer({
      subscriber,
      deserializer: this.deserializer,
      connection: this.connection,
      queueName,
      exchange,
      maxRetries: this.maxRetries
    })
  }
}
