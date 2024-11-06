import { type UserEmail } from '../../../Users/domain/UserEmail'
import { UserTokenNotExist } from '../../domain/UserTokenNotExist'
import { type UserTokenRepository } from '../../domain/UserTokenRepository'

export class UsersTokenFinder {
  constructor(private readonly repository: UserTokenRepository) {}

  async run(userEmail: UserEmail): Promise<string> {
    const userToken = await this.repository.search(userEmail)
    if (userToken === null) {
      throw new UserTokenNotExist()
    }
    return userToken.token.value
  }
}
