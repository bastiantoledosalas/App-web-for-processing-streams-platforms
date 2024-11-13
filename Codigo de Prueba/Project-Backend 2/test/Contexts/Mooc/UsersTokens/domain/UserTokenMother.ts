import { UserTokenId } from '../../../../../src/Contexts/Mooc/UsersTokens/domain/UserTokenId'
import { UserToken } from '../../../../../src/Contexts/Mooc/UsersTokens/domain/UserToken'
import { UserEmailMother } from '../../Users/domain/UserEmailMother'
import { UserAuthToken } from '../../../../../src/Contexts/Mooc/Shared/domain/UsersTokens/UserAuthToken'
import { type UserEmail } from '../../../../../src/Contexts/Mooc/Users/domain/UserEmail'

export class UserTokenMother {
  static create(
    id: UserTokenId,
    email: UserEmail,
    token: UserAuthToken
  ): UserToken {
    return new UserToken(id, email, token)
  }

  static random(): UserToken {
    const email = UserEmailMother.random()
    return new UserToken(
      UserTokenId.random(),
      email,
      UserAuthToken.createTokenForUser({ email: email.value })
    )
  }

  static fromEmail(email: UserEmail): UserToken {
    return new UserToken(
      UserTokenId.random(),
      email,
      UserAuthToken.createTokenForUser({ email: email.value })
    )
  }
}
