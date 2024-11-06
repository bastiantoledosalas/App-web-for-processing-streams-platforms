import jwt, { type JwtPayload } from 'jsonwebtoken'
import config from '../../../Mooc/Shared/infrastructure/config'

export class JWT {
  public readonly value: string

  constructor(value: string) {
    this.value = value
  }

  public static create(params: Record<string, unknown>): JWT {
    return new JWT(
      jwt.sign(params, config.get('auth.secret'), {
        expiresIn: config.get('auth.expiresIn')
      })
    )
  }

  public static decoded(token: JWT): string | JwtPayload {
    return jwt.verify(token.value, config.get('auth.secret'))
  }

  toString(): string {
    return this.value
  }
}
