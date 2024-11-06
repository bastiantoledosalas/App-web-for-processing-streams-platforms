import amqplib, {
  type ConsumeMessage,
  type ConfirmChannel,
  type Connection
} from 'amqplib'
import { type ConnectionSettings } from './ConnectionSettings'
import { type Nullable } from '../../../domain/Nullable'
import { RabbitMQExchangeNameFormatter } from './RabbitMQExchangeNameFormatter'

/**
 * This class is the connection to RabbitMQ
 */
export class RabbitMQConnection {
  protected connectionSettings: ConnectionSettings
  protected channel?: ConfirmChannel
  protected connection?: Connection

  constructor(params: { connectionSettings: ConnectionSettings }) {
    this.connectionSettings = params.connectionSettings
  }

  /**
   * This method connect to RabbitMQ
   * @returns {void}
   */
  async connect(): Promise<void> {
    this.connection = await this.amqpConnect()
    this.channel = await this.amqpChannel()
  }

  async exchange(params: {
    name: string
  }): Promise<Nullable<amqplib.Replies.AssertExchange>> {
    return await this.channel?.assertExchange(params.name, 'topic', {
      durable: true
    })
  }

  async queue(params: {
    exchange: string
    name: string
    routingKeys: string[]
    deadLetterExchange?: string
    deadLetterQueue?: string
    messageTtl?: number
  }): Promise<void> {
    const durable = true
    const exclusive = false
    const autoDelete = false
    const args = this.getQueueArguments(params)
    await this.channel?.assertQueue(params.name, {
      exclusive,
      durable,
      autoDelete,
      arguments: args
    })
    for (const routingKey of params.routingKeys) {
      if (this.channel !== undefined) {
        await this.channel.bindQueue(params.name, params.exchange, routingKey)
      }
    }
  }

  private getQueueArguments(params: {
    exchange: string
    name: string
    routingKeys: string[]
    deadLetterExchange?: string
    deadLetterQueue?: string
    messageTtl?: number
  }): Record<string, unknown> {
    let args = {}
    if (params.deadLetterExchange !== undefined) {
      args = { ...args, 'x-dead-letter-exchange': params.deadLetterExchange }
    }
    if (params.deadLetterQueue !== undefined) {
      args = { ...args, 'x-dead-letter-routings-key': params.deadLetterQueue }
    }
    if (params.messageTtl !== undefined) {
      args = { ...args, 'x-message-ttl': params.messageTtl }
    }

    return args
  }

  async deleteQueue(
    queue: string
  ): Promise<Nullable<amqplib.Replies.DeleteQueue>> {
    return await this.channel?.deleteQueue(queue)
  }

  async consume(
    queue: string,
    onMessage: (message: ConsumeMessage) => Promise<void>
  ): Promise<void> {
    await this.channel?.consume(queue, (message: ConsumeMessage | null) => {
      if (message !== null) {
        void onMessage(message)
      }
    })
  }

  public ack(message: ConsumeMessage): void {
    this.channel?.ack(message)
  }

  async retry(
    message: ConsumeMessage,
    queue: string,
    exchange: string
  ): Promise<void> {
    const retryExchange = RabbitMQExchangeNameFormatter.retry(exchange)
    const options = this.getMessageOptions(message)
    await this.publish({
      exchange: retryExchange,
      routingKey: queue,
      content: message.content,
      options
    })
  }

  async deadLetter(
    message: ConsumeMessage,
    queue: string,
    exchange: string
  ): Promise<void> {
    const deadLetterExchange =
      RabbitMQExchangeNameFormatter.deadLetter(exchange)
    const options = this.getMessageOptions(message)
    await this.publish({
      exchange: deadLetterExchange,
      routingKey: queue,
      content: message.content,
      options
    })
  }

  private getMessageOptions(message: ConsumeMessage): {
    messageId: string
    headers: Record<string, unknown>
    contentType: string
    contentEncoding: string
    priority: number
  } {
    const { messageId, contentType, contentEncoding, priority } =
      message.properties
    const options = {
      messageId,
      headers: this.incrementRedeliveryCount(message),
      contentType,
      contentEncoding,
      priority
    }
    return options
  }

  /**
   * This method connect to RabbitMQ
   *
   * @returns {Connection} The connection to RabbitMQ
   */
  private async amqpConnect(): Promise<Connection> {
    const { hostname, port, secure } = this.connectionSettings.connection
    const { username, password, vhost } = this.connectionSettings
    const protocol = secure ? 'amqps' : 'amqp'
    const connection = await amqplib.connect({
      protocol,
      hostname,
      port,
      username,
      password,
      vhost
    })

    connection.on('error', (err) => {
      void Promise.reject(err)
    })

    return connection
  }

  /**
   * This method create a channel to RabbitMQ
   *
   * @returns {ConfirmChannel} The channel to RabbitMQ
   * @throws {Error} If no connection
   */
  private async amqpChannel(): Promise<ConfirmChannel> {
    if (this.connection == null) throw new Error('No connection')
    const channel = await this.connection.createConfirmChannel()
    await channel.prefetch(1)
    return channel
  }

  /**
   * This method publish the events
   *
   * @param {object} params The params to publish the event
   * @param {string} params.exchange The exchange to publish the event
   * @param {string} params.routingKey The routingKey to publish the event
   * @param {Buffer} params.content The content to publish the event
   * @param {object} params.options The options to publish the event
   * @returns {boolean} If the event is published
   *
   */
  async publish(params: {
    exchange: string
    routingKey: string
    content: Buffer
    options: {
      messageId: string
      contentType: string
      contentEncoding: string
      priority?: number
      headers?: Record<string, unknown>
    }
  }): Promise<void> {
    const { routingKey, content, options, exchange } = params
    await new Promise<void>((resolve, reject) => {
      if (this.channel == null) throw new Error('No channel')
      this.channel.publish(exchange, routingKey, content, options, (error) => {
        error !== null ? reject(error) : resolve()
      })
    })
  }

  /**
   * This method close the connection to RabbitMQ
   *
   * @returns {void}
   */
  async close(): Promise<void> {
    await this.channel?.close()
    return await this.connection?.close()
  }

  private incrementRedeliveryCount(
    message: ConsumeMessage
  ): amqplib.MessagePropertyHeaders {
    if (this.hasBeenRedelivered(message)) {
      const count = parseInt(message.properties.headers.redelivery_count)
      message.properties.headers.redelivery_count = count + 1
    } else {
      message.properties.headers.redelivery_count = 1
    }

    return message.properties.headers
  }

  private hasBeenRedelivered(message: ConsumeMessage): boolean {
    return message.properties.headers.redelivery_count !== undefined
  }
}
