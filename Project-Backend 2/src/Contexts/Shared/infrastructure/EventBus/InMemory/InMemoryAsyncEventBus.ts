import { EventEmitter } from 'events'
import { type DomainEvent } from '../../../domain/DomainEvent'
import { type EventBus } from '../../../domain/EventBus'
import { type DomainEventSubscribers } from '../DomainEventSubscribers'

/**
 * This class is used to publish events in a synchronous way.
 * It is used in the tests.
 */
export class InMemoryAsyncEventBus extends EventEmitter implements EventBus {
  /**
   * This method is used to publish events.
   *
   * @param {DomainEvent[]} events An array of domain events.
   * @returns A promise.
   */
  async publish(events: DomainEvent[]): Promise<void> {
    events.map((event) => this.emit(event.eventName, event))
  }

  /**
   * This method is used to add subscribers.
   *
   * @param {DomainEventSubscribers} subscribers An array of domain event subscribers.
   * @returns {void}
   */
  addSubscribers(subscribers: DomainEventSubscribers): void {
    subscribers.items.forEach((subscriber) => {
      subscriber.subscribedTo().forEach((event) => {
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        this.on(event.EVENT_NAME, subscriber.on.bind(subscriber))
      })
    })
  }
}
