import {
  type DomainEvent,
  type DomainEventClass
} from '../../domain/DomainEvent'
import { type DomainEventSubscribers } from './DomainEventSubscribers'

interface DomainEventJSON {
  type: string
  aggregateId: string
  eventId: string
  attributes: string
  occurred_on: string
}

/**
 * This class is used to deserialize a domain event
 */
export class DomainEventDeserializer extends Map<string, DomainEventClass> {
  /**
   * This method configures the deserializer with the provided subscribers.
   *
   * @subscribers {DomainEventSubscribers} The subscribers to be used to configure the deserializer.
   * @returns {DomainEventDeserializer} The deserializer configured with the provided subscribers.
   */
  static configure(
    subscribers: DomainEventSubscribers
  ): DomainEventDeserializer {
    const mapping = new DomainEventDeserializer()
    subscribers.items.forEach((subscriber) => {
      subscriber.subscribedTo().forEach(mapping.registerEvent.bind(mapping))
    })
    return mapping
  }

  /**
   * This method registers the provided domain event in the deserializer.
   *
   * @param {DomainEventClass} domainEvent The domain event to be registered.
   * @returns {void}
   */
  private registerEvent(domainEvent: DomainEventClass): void {
    const eventName = domainEvent.EVENT_NAME
    this.set(eventName, domainEvent)
  }

  /**
   * This method deserializes the provided event.
   *
   * @param {string} event The event to be deserialized.
   * @returns {DomainEvent} The deserialized event.
   */
  deserialize(event: string): DomainEvent {
    const eventData = JSON.parse(event).data as DomainEventJSON
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { type, aggregateId, attributes, occurred_on, eventId } = eventData
    const eventClass = super.get(type)
    if (eventClass == null) {
      throw Error(`DomainEvent mapping not found for event ${type}`)
    }
    return eventClass.fromPrimitives({
      aggregateId,
      attributes,
      occurredOn: new Date(occurred_on),
      eventId
    })
  }
}
