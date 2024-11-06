import { Query } from '../../../../Shared/domain/Query'

export class FindUserTokenQuery extends Query {
  public readonly userEmail: string

  constructor(userEmail: string) {
    super()
    this.userEmail = userEmail
  }
}
