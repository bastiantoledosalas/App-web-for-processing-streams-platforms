import { type Query } from '../../../../Shared/domain/Query'
import { type QueryHandler } from '../../../../Shared/domain/QueryHandler'
import { FindUserTokenQuery } from './FindUserTokenQuery'
import { FindUserTokenResponse } from './FindUserTokenResponse'
import { type UsersTokenFinder } from './UsersTokenFinder'
import { UserEmail } from '../../../Users/domain/UserEmail'

export class FindUserTokenQueryHandler
  implements QueryHandler<FindUserTokenQuery, FindUserTokenResponse>
{
  constructor(private readonly finder: UsersTokenFinder) {}

  subscribedTo(): Query {
    return FindUserTokenQuery
  }

  async handle(query: FindUserTokenQuery): Promise<FindUserTokenResponse> {
    const token = await this.finder.run(new UserEmail(query.userEmail))
    return new FindUserTokenResponse(token)
  }
}
