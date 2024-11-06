import { type EventBus } from '../../../../Shared/domain/EventBus'
import { type UserId } from '../../../Shared/domain/Users/UserId'
import { User } from '../../domain/User'
import { type UserEmail } from '../../domain/UserEmail'
import { type UserFirstName } from '../../domain/UserFirstName'
import { type UserLastName } from '../../domain/UserLastName'
import { type UserPassword } from '../../domain/UserPassword'
import { type UserRepository } from '../../domain/UserRepository'

/**
 * Create a new user
 */
export class UserCreator {
  constructor(
    private readonly repository: UserRepository,
    private readonly eventBus: EventBus
  ) {}

  /**
   * Create a new user
   *
   * @param {CreateUserRequest} params The user params
   * @param {UserId} params.id The user id
   * @param {UserFirstName} params.firstName The user first name
   * @param {UserLastName} params.lastName The user last name
   * @param {UserEmail} params.email The user email
   * @param {UserPassword} params.password The user password
   * @returns {void}
   */
  async run(params: {
    id: UserId
    firstName: UserFirstName
    lastName: UserLastName
    email: UserEmail
    password: UserPassword
  }): Promise<void> {
    const user = User.create(
      params.id,
      params.firstName,
      params.lastName,
      params.email,
      params.password
    )
    await this.repository.save(user)
    await this.eventBus.publish(user.pullDomainEvents())
  }
}
