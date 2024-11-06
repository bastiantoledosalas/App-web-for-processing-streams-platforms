import { DomainEvent } from '../../../Shared/domain/DomainEvent'

interface CreateUserTokenDomainEventAttributes {
  readonly aggregateId: string
  readonly token: string
  readonly eventName: string
}

export class UserTokenCreatedDomainEvent extends DomainEvent {
  public static readonly EVENT_NAME = 'user.token.created'

  readonly token: string

  constructor({
    aggregateId,
    token,
    eventId,
    occurredOn
  }: {
    aggregateId: string
    token: string
    eventId?: string
    occurredOn?: Date
  }) {
    super({
      eventName: UserTokenCreatedDomainEvent.EVENT_NAME,
      aggregateId,
      eventId,
      occurredOn
    })
    this.token = token
  }

  public static fromPrimitives(params: {
    aggregateId: string
    eventId: string
    occurredOn: Date
    attributes: CreateUserTokenDomainEventAttributes
  }): DomainEvent {
    const { aggregateId, eventId, occurredOn, attributes } = params
    return new UserTokenCreatedDomainEvent({
      aggregateId,
      token: attributes.token,
      eventId,
      occurredOn
    })
  }

  public toPrimitives(): CreateUserTokenDomainEventAttributes {
    const { token, aggregateId } = this
    return {
      eventName: UserTokenCreatedDomainEvent.EVENT_NAME,
      aggregateId,
      token
    }
  }
}
