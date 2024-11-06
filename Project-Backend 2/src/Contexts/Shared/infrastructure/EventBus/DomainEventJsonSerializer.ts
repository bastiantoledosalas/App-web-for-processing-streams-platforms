import { type DomainEvent } from '../../domain/DomainEvent'

export class DomainEventJsonSerializer {
  static serialize(event: DomainEvent): string {
    return JSON.stringify({
      data: {
        aggregateId: event.aggregateId,
        eventId: event.eventId,
        type: event.eventName,
        occurred_on: event.occurredOn.toISOString(),
        attributes: event.toPrimitives()
      }
    })
  }
}
