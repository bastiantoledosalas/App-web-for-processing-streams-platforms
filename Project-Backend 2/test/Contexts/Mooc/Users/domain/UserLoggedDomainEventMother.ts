import { type UserCredentials } from '../../../../../src/Contexts/Mooc/Users/domain/UserCredentials'
import { UserLoggedDomainEvent } from '../../../../../src/Contexts/Mooc/Users/domain/UserLoggedDomainEvent'

export class UserLoggedDomainEventMother {
  static create({
    aggregateId,
    email,
    eventId,
    occurredOn
  }: {
    aggregateId: string
    email: string
    eventId?: string
    occurredOn?: Date
  }): UserLoggedDomainEvent {
    return new UserLoggedDomainEvent({
      aggregateId,
      email,
      eventId,
      occurredOn
    })
  }

  static fromUserCredentials(
    userCredentials: UserCredentials
  ): UserLoggedDomainEvent {
    return this.create({
      aggregateId: userCredentials.id.value,
      email: userCredentials.email.value
    })
  }
}
