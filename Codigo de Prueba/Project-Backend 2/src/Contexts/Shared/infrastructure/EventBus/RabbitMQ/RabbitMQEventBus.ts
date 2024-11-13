import { type DomainEvent } from '../../../domain/DomainEvent'
import { type EventBus } from '../../../domain/EventBus'
import { DomainEventDeserializer } from '../DomainEventDeserializer'
import { type DomainEventFailoverPublisher } from '../DomainEventFailoverPublisher/DomainEventFailoverPublisher'
import { DomainEventJsonSerializer } from '../DomainEventJsonSerializer'
import { type DomainEventSubscribers } from '../DomainEventSubscribers'
import { type RabbitMQConnection } from './RabbitMQConnection'
import { RabbitMQConsumerFactory } from './RabbitMQConsumerFactory'
import { type RabbitMQqueueFormatter } from './RabbitMQqueueFormatter'

/**
 * This class config the rabbitmq connection and publish the events
 */
export class RabbitMQEventBus implements EventBus {
  private readonly failoverPublisher: DomainEventFailoverPublisher
  private readonly connection: RabbitMQConnection
  private readonly exchange: string
  private readonly queueNameFormatter: RabbitMQqueueFormatter
  private readonly maxRetries: number

  constructor(params: {
    failoverPublisher: DomainEventFailoverPublisher
    connection: RabbitMQConnection
    exchange: string
    queueNameFormatter: RabbitMQqueueFormatter
    maxRetries: number
  }) {
    const {
      failoverPublisher,
      connection,
      exchange,
      queueNameFormatter,
      maxRetries
    } = params
    this.failoverPublisher = failoverPublisher
    this.connection = connection
    this.exchange = exchange
    this.queueNameFormatter = queueNameFormatter
    this.maxRetries = maxRetries
  }

  /**
   * This method is not implemented
   */
  async addSubscribers(subscribers: DomainEventSubscribers): Promise<void> {
    const deserializer = DomainEventDeserializer.configure(subscribers)
    this.failoverPublisher.setDeserializer(deserializer)
    const consumerFactory = new RabbitMQConsumerFactory(
      deserializer,
      this.connection,
      this.maxRetries
    )
    for (const subscriber of subscribers.items) {
      const queueName = this.queueNameFormatter.format(subscriber)
      const rabbitMQConsumer = consumerFactory.build(
        subscriber,
        this.exchange,
        queueName
      )
      await this.connection.consume(
        queueName,
        rabbitMQConsumer.onMessage.bind(rabbitMQConsumer)
      )
    }
  }

  /**
   * This method publish the events
   *
   * @param {DomainEvent[]} events The events to publish
   * @returns {void}
   */
  async publish(events: DomainEvent[]): Promise<void> {
    for (const event of events) {
      try {
        const routingKey = event.eventName
        const content = this.toBuffer(event)
        const options = this.options(event)
        await this.connection.publish({
          routingKey,
          content,
          options,
          exchange: this.exchange
        })
      } catch (error) {
        await this.failoverPublisher.publish(event)
      }
    }
  }

  /**
   * This method return the options to publish the events.
   *
   * @param {DomainEvent} event The event to publish
   * @returns {object} The options to publish the event
   */
  private options(event: DomainEvent): {
    messageId: string
    contentType: string
    contentEncoding: string
  } {
    return {
      messageId: event.eventId,
      contentType: 'application/json',
      contentEncoding: 'utf-8'
    }
  }

  private toBuffer(event: DomainEvent): Buffer {
    const eventPrimitives = DomainEventJsonSerializer.serialize(event)
    return Buffer.from(eventPrimitives)
  }
}
