import { DomainEvent } from '../../../Shared/domain/DomainEvent'

interface CreateUserDomainEventAttributes {
  readonly firstName: string
  readonly lastName: string
  readonly email: string
  readonly eventName: string
  readonly aggregateId: string
}

/**
 * This class is used to represent the domain event
 * which is emitted when a user is created
 */
export class UserCreatedDomainEvent extends DomainEvent {
  public static readonly EVENT_NAME = 'user.created'

  readonly firstName: string
  readonly lastName: string
  readonly email: string

  constructor({
    aggregateId,
    firstName,
    lastName,
    email,
    eventId,
    occurredOn
  }: {
    aggregateId: string
    firstName: string
    lastName: string
    email: string
    eventId?: string
    occurredOn?: Date
  }) {
    super({
      eventName: UserCreatedDomainEvent.EVENT_NAME,
      aggregateId,
      eventId,
      occurredOn
    })
    this.firstName = firstName
    this.lastName = lastName
    this.email = email
  }

  /**
   * This method returns a new instance of this domain event
   * using the provided parameters.
   *
   * @param {Object} params The parameters to be used to
   * created the new instance.
   * @param {string} params.aggregateId The user id.
   * @param {string} params.eventId The event id.
   * @param {Date} params.occurredOn The date when the event occurred.
   * @param {CreateUserDomainEventAttributes} params.attributes The attributes of the event.
   * @returns {UserCreatedDomainEvent} A new instance of this domain event.
   */
  public static fromPrimitives(params: {
    aggregateId: string
    eventId: string
    occurredOn: Date
    attributes: CreateUserDomainEventAttributes
  }): DomainEvent {
    const { aggregateId, eventId, occurredOn, attributes } = params
    return new UserCreatedDomainEvent({
      aggregateId,
      firstName: attributes.firstName,
      lastName: attributes.lastName,
      email: attributes.email,
      eventId,
      occurredOn
    })
  }

  /**
   * This method returns the attributes of the domain event
   * in a primitive form.
   *
   * @returns {CreateUserDomainEventAttributes} The attributes of the domain event.
   */
  public toPrimitives(): CreateUserDomainEventAttributes {
    const { firstName, lastName, email, aggregateId } = this
    return {
      firstName,
      lastName,
      email,
      eventName: UserCreatedDomainEvent.EVENT_NAME,
      aggregateId
    }
  }
}
