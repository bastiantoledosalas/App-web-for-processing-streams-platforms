import { UserCreatedDomainEvent } from '../../../../../src/Contexts/Mooc/Users/domain/UserCreatedDomainEvent'
import { type User } from '../../../../../src/Contexts/Mooc/Users/domain/User'

export class UserCreatedDomainEventMother {
  static create({
    aggregateId,
    eventId,
    firstName,
    lastName,
    email,
    occurredOn
  }: {
    aggregateId: string
    eventId?: string
    firstName: string
    lastName: string
    email: string
    occurredOn?: Date
  }): UserCreatedDomainEvent {
    return new UserCreatedDomainEvent({
      aggregateId,
      eventId,
      firstName,
      lastName,
      email,
      occurredOn
    })
  }

  static fromUser(user: User): UserCreatedDomainEvent {
    return this.create({
      aggregateId: user.id.value,
      firstName: user.firstName.value,
      lastName: user.lastName.value,
      email: user.email.value
    })
  }
}
