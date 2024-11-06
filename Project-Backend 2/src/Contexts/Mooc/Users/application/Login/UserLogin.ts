import { type EventBus } from '../../../../Shared/domain/EventBus'
import { UserCredentials } from '../../domain/UserCredentials'
import { type UserEmail } from '../../domain/UserEmail'
import { UserCredentialsError } from '../../domain/UserCredentialsError'
import { type UserPassword } from '../../domain/UserPassword'
import { type UserRepository } from '../../domain/UserRepository'
import { type UserTokenRepository } from '../../../UsersTokens/domain/UserTokenRepository'

export class UserLogin {
  constructor(
    private readonly repository: UserRepository,
    private readonly eventBus: EventBus,
    private readonly repositoryTokens: UserTokenRepository
  ) {}

  async run(params: {
    email: UserEmail
    password: UserPassword
  }): Promise<void> {
    const user = await this.repository.search(params.email)
    if (user === null || user === undefined) {
      throw new UserCredentialsError(
        'Incorrect information, please re-enter the data'
      )
    }
    if (user.password.value !== params.password.value) {
      throw new UserCredentialsError(
        'Incorrect information, please re-enter the data'
      )
    }
    const userCredentials = UserCredentials.create(
      user.id,
      user.email,
      user.password
    )
    await this.eventBus.publish(userCredentials.pullDomainEvents())
    await this.repositoryTokens.search(user.email)
  }
}
