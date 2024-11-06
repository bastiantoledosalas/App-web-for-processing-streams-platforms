import { AggregateRoot } from '../../../Shared/domain/AggregateRoot'
import { UserAuthToken } from '../../Shared/domain/UsersTokens/UserAuthToken'
import { UserEmail } from '../../Users/domain/UserEmail'
import { UserTokenCreatedDomainEvent } from './UserTokenCreatedDomainEvent'
import { UserTokenId } from './UserTokenId'

export class UserToken extends AggregateRoot {
  public readonly id: UserTokenId
  public readonly email: UserEmail
  public readonly _token: UserAuthToken

  constructor(id: UserTokenId, email: UserEmail, token: UserAuthToken) {
    super()
    this.id = id
    this.email = email
    this._token = token
  }

  public get token(): UserAuthToken {
    return this._token
  }

  public static create(email: UserEmail, token: UserAuthToken): UserToken {
    const id = UserTokenId.random()
    const userToken = new UserToken(id, email, token)
    userToken.record(
      new UserTokenCreatedDomainEvent({
        aggregateId: userToken.id.value,
        token: userToken.token.value
      })
    )
    return userToken
  }

  public static fromPrimitives(plainData: {
    id: string
    email: string
    token: string
  }): UserToken {
    return new UserToken(
      new UserTokenId(plainData.id),
      new UserEmail(plainData.email),
      new UserAuthToken(plainData.token)
    )
  }

  public toPrimitives(): Record<string, unknown> {
    return {
      id: this.id.value,
      email: this.email.value,
      token: this._token.value
    }
  }
}
