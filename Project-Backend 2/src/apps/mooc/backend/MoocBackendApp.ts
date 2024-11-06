import type * as http from 'http'
import { type EventBus } from '../../../Contexts/Shared/domain/EventBus'
import container from './dependency-injection'
import { Server } from './server'
import { DomainEventSubscribers } from '../../../Contexts/Shared/infrastructure/EventBus/DomainEventSubscribers'
import { type RabbitMQConnection } from '../../../Contexts/Shared/infrastructure/EventBus/RabbitMQ/RabbitMQConnection'

/**
 * The Mooc Backend App.
 *
 * @function start Starts the app.
 * @function stop Stops the app.
 */
export class MoocBackendApp {
  server?: Server

  get httpServer(): http.Server | undefined {
    return this.server?.getHttpServer()
  }

  /**
   * Starts the app.
   *
   * @returns A promise that resolves when the app has started.
   */
  async start(): Promise<void> {
    const port = process.env.PORT ?? '5000'
    this.server = new Server(port)
    await this.configureEventBus()
    await this.server.listen()
  }

  /**
   * Stops the app.
   *
   * @returns A promise that resolves when the app has stopped.
   */
  async stop(): Promise<void> {
    const rabbitMQConnection = container.get<RabbitMQConnection>(
      'Mooc.Shared.RabbitMQConnection'
    )
    await rabbitMQConnection.close()
    await this.server?.stop()
  }

  /**
   * Configures the event bus
   *
   * @returns {void}
   */
  private async configureEventBus(): Promise<void> {
    const eventBus = container.get<EventBus>('Mooc.Shared.domain.EventBus')
    const rabbitMQConnection = container.get<RabbitMQConnection>(
      'Mooc.Shared.RabbitMQConnection'
    )
    await rabbitMQConnection.connect()
    eventBus.addSubscribers(DomainEventSubscribers.from(container))
  }
}
