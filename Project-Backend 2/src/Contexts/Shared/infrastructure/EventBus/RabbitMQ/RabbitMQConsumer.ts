import { type ConsumeMessage } from 'amqplib'
import { type DomainEvent } from '../../../domain/DomainEvent'
import { type DomainEventSubscriber } from '../../../domain/DomainEventSubscriber'
import { type DomainEventDeserializer } from '../DomainEventDeserializer'
import { type RabbitMQConnection } from './RabbitMQConnection'

export class RabbitMQConsumer {
  private readonly subscriber: DomainEventSubscriber<DomainEvent>
  private readonly deserializer: DomainEventDeserializer
  private readonly connection: RabbitMQConnection
  private readonly maxRetries: number
  private readonly queueName: string
  private readonly exchange: string

  constructor(params: {
    subscriber: DomainEventSubscriber<DomainEvent>
    deserializer: DomainEventDeserializer
    connection: RabbitMQConnection
    queueName: string
    exchange: string
    maxRetries: number
  }) {
    this.subscriber = params.subscriber
    this.deserializer = params.deserializer
    this.connection = params.connection
    this.maxRetries = params.maxRetries
    this.queueName = params.queueName
    this.exchange = params.exchange
  }

  async onMessage(message: ConsumeMessage): Promise<void> {
    const content = message.content.toString()
    const domainEvent = this.deserializer.deserialize(content)
    try {
      await this.subscriber.on(domainEvent)
    } catch (error) {
      await this.handleError(message)
    } finally {
      this.connection.ack(message)
    }
  }

  private async handleError(message: ConsumeMessage): Promise<void> {
    if (this.hasBeenRedeliveredTooMuch(message)) {
      await this.deadLetter(message)
    } else {
      await this.retry(message)
    }
  }

  private async retry(message: ConsumeMessage): Promise<void> {
    await this.connection.retry(message, this.queueName, this.exchange)
  }

  private async deadLetter(message: ConsumeMessage): Promise<void> {
    await this.connection.deadLetter(message, this.queueName, this.exchange)
  }

  private hasBeenRedeliveredTooMuch(message: ConsumeMessage): boolean {
    if (this.hasBeenRedelivered(message)) {
      const count = parseInt(message.properties.headers.redelivery_count)
      return count >= this.maxRetries
    }
    return false
  }

  private hasBeenRedelivered(message: ConsumeMessage): boolean {
    return message.properties.headers.redelivery_count !== undefined
  }
}
