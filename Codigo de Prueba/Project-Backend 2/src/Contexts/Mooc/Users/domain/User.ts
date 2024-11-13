import { AggregateRoot } from '../../../Shared/domain/AggregateRoot'
import { UserId } from '../../Shared/domain/Users/UserId'
import { UserCreatedDomainEvent } from './UserCreatedDomainEvent'
import { UserEmail } from './UserEmail'
import { UserFirstName } from './UserFirstName'
import { UserLastName } from './UserLastName'
import { UserPassword } from './UserPassword'

/**
 * User domain entity.
 */
export class User extends AggregateRoot {
  public readonly id: UserId
  public readonly firstName: UserFirstName
  public readonly lastName: UserLastName
  public readonly email: UserEmail
  public readonly password: UserPassword

  constructor(
    id: UserId,
    firstName: UserFirstName,
    lastName: UserLastName,
    email: UserEmail,
    password: UserPassword
  ) {
    super()
    this.id = id
    this.firstName = firstName
    this.lastName = lastName
    this.email = email
    this.password = password
  }

  /**
   * Create a new User
   *
   * @param {UserId} id User id.
   * @param {UserFirstName} firstName User first name.
   * @param {UserLastName} lastName User last name.
   * @param {UserEmail} email User email.
   * @param {UserPassword} password User password.
   * @returns {User} A new User instance.
   */
  public static create(
    id: UserId,
    firstName: UserFirstName,
    lastName: UserLastName,
    email: UserEmail,
    password: UserPassword
  ): User {
    const user = new User(id, firstName, lastName, email, password)
    user.record(
      new UserCreatedDomainEvent({
        aggregateId: user.id.value,
        firstName: user.firstName.value,
        lastName: user.lastName.value,
        email: user.email.value
      })
    )
    return user
  }

  /**
   * Create a new User from primitives.
   *
   * @param {Object} plainData User plain data.
   * @param {string} plainData.id User id.
   * @param {string} plainData.firstName User first name.
   * @param {string} plainData.lastName User last name.
   * @param {string} plainData.email User email.
   * @param {string} plainData.password User password.
   * @returns {User} A new User instance.
   */
  public static fromPrimitives(plainData: {
    id: string
    firstName: string
    lastName: string
    email: string
    password: string
  }): User {
    return new User(
      new UserId(plainData.id),
      new UserFirstName(plainData.firstName),
      new UserLastName(plainData.lastName),
      new UserEmail(plainData.email),
      new UserPassword(plainData.password)
    )
  }

  /**
   * Convert the User to primitives.
   *
   * @returns {Object} User plain data.
   */
  public toPrimitives(): Record<string, unknown> {
    return {
      id: this.id.value,
      firstName: this.firstName.value,
      lastName: this.lastName.value,
      email: this.email.value,
      password: this.password.value
    }
  }
}
