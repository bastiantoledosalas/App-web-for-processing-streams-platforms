import { JWT } from '../../../../Shared/domain/value-object/JWT'

export class UserAuthToken extends JWT {
  public static createTokenForUser(params: { email: string }): JWT {
    return this.create(params)
  }
}
