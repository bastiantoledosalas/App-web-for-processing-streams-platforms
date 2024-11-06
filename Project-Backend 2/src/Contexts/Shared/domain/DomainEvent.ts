import { Uuid } from './value-object/Uuid'

/**
 * This class is the base class for all domain events in the domain.
 */
export abstract class DomainEvent {
  public static EVENT_NAME: string
  public static fromPrimitives: (params: {
    aggregateId: string
    eventId: string
    occurredOn: Date
    attributes: DomainEventAttributes
  }) => DomainEvent

  public readonly aggregateId: string
  public readonly eventId: string
  public readonly occurredOn: Date
  public readonly eventName: string

  constructor(params: {
    eventName: string
    aggregateId: string
    eventId?: string
    occurredOn?: Date
  }) {
    const { eventName, aggregateId, eventId, occurredOn } = params
    this.aggregateId = aggregateId
    this.eventId = eventId ?? Uuid.random().value
    this.occurredOn = occurredOn ?? new Date()
    this.eventName = eventName
  }

  abstract toPrimitives(): DomainEventAttributes
}

export interface DomainEventClass {
  EVENT_NAME: string
  fromPrimitives: (params: {
    aggregateId: string
    eventId: string
    occurredOn: Date
    attributes: DomainEventAttributes
  }) => DomainEvent
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DomainEventAttributes = any
