import { type EventBus } from '../../../../Shared/domain/EventBus'
import { UserAuthToken } from '../../../Shared/domain/UsersTokens/UserAuthToken'
import { type UserEmail } from '../../../Users/domain/UserEmail'
import { UserToken } from '../../domain/UserToken'
import { type UserTokenRepository } from '../../domain/UserTokenRepository'

export class UserTokenCreator {
  constructor(
    private readonly repository: UserTokenRepository,
    private readonly eventBus: EventBus
  ) {}

  async run(userEmail: UserEmail): Promise<void> {
    const userToken = await this.repository.search(userEmail)
    if (userToken === null || userToken === undefined) {
      const newUserToken = UserToken.create(
        userEmail,
        UserAuthToken.createTokenForUser({ email: userEmail.value })
      )
      await this.repository.save(newUserToken)
      await this.eventBus.publish(newUserToken.pullDomainEvents())
    }
  }
}
