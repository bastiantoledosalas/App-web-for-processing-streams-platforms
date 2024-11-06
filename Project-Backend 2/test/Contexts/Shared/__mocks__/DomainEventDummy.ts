import { DomainEvent } from '../../../../src/Contexts/Shared/domain/DomainEvent'
import { UuidMother } from '../domain/UuidMother'

export class DomainEventDummy extends DomainEvent {
  static readonly EVENT_NAME = 'dummy'

  constructor(data: {
    aggregateId: string
    eventId?: string
    occurredOn?: Date
  }) {
    const { aggregateId, eventId, occurredOn } = data
    super({
      eventName: DomainEventDummy.EVENT_NAME,
      aggregateId,
      eventId,
      occurredOn
    })
  }

  toPrimitives(): Record<string, string> {
    return {
      id: this.aggregateId
    }
  }

  public static fromPrimitives(params: {
    aggregateId: string
    eventId: string
    occurredOn: Date
    attributes: Record<string, unknown>
  }): DomainEventDummy {
    const { aggregateId, eventId, occurredOn } = params
    return new DomainEventDummy({
      aggregateId,
      eventId,
      occurredOn
    })
  }
}

export class DomainEventDummyMother {
  static random(): DomainEventDummy {
    return new DomainEventDummy({
      aggregateId: UuidMother.random(),
      eventId: UuidMother.random(),
      occurredOn: new Date()
    })
  }
}
