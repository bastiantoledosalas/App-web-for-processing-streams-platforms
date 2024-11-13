import { DomainEvent } from '../../../Shared/domain/DomainEvent'

interface UserLoggedDomainEventAttributes {
  readonly email: string
  readonly eventName: string
  readonly aggregateId: string
}

export class UserLoggedDomainEvent extends DomainEvent {
  public static readonly EVENT_NAME = 'user.logged'

  readonly email: string

  constructor({
    aggregateId,
    email,
    eventId,
    occurredOn
  }: {
    aggregateId: string
    email: string
    eventId?: string
    occurredOn?: Date
  }) {
    super({
      eventName: UserLoggedDomainEvent.EVENT_NAME,
      aggregateId,
      eventId,
      occurredOn
    })
    this.email = email
  }

  public static fromPrimitives(params: {
    aggregateId: string
    eventId: string
    occurredOn: Date
    attributes: UserLoggedDomainEventAttributes
  }): DomainEvent {
    const { aggregateId, eventId, occurredOn, attributes } = params
    return new UserLoggedDomainEvent({
      aggregateId,
      email: attributes.email,
      eventId,
      occurredOn
    })
  }

  public toPrimitives(): UserLoggedDomainEventAttributes {
    const { email, aggregateId } = this
    return {
      email,
      eventName: UserLoggedDomainEvent.EVENT_NAME,
      aggregateId
    }
  }
}
