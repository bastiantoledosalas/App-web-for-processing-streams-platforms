import { AggregateRoot } from '../../../Shared/domain/AggregateRoot'
import { UserId } from '../../Shared/domain/Users/UserId'
import { UserEmail } from './UserEmail'
import { UserLoggedDomainEvent } from './UserLoggedDomainEvent'
import { UserPassword } from './UserPassword'

export class UserCredentials extends AggregateRoot {
  public readonly id: UserId
  public readonly email: UserEmail
  public readonly password: UserPassword

  constructor(id: UserId, email: UserEmail, password: UserPassword) {
    super()
    this.id = id
    this.email = email
    this.password = password
  }

  public static create(
    id: UserId,
    email: UserEmail,
    password: UserPassword
  ): UserCredentials {
    const userCredentials = new UserCredentials(id, email, password)
    userCredentials.record(
      new UserLoggedDomainEvent({
        aggregateId: userCredentials.id.value,
        email: userCredentials.email.value
      })
    )
    return userCredentials
  }

  public static fromPrimitives(plainData: {
    id: string
    email: string
    password: string
  }): UserCredentials {
    return new UserCredentials(
      new UserId(plainData.id),
      new UserEmail(plainData.email),
      new UserPassword(plainData.password)
    )
  }

  public toPrimitives(): Record<string, unknown> {
    return {
      email: this.email.value
    }
  }
}
