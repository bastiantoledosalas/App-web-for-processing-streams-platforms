import { type Query } from '../../domain/Query'
import { type QueryHandler } from '../../domain/QueryHandler'
import { type Response } from '../../domain/Response'
import { QueryNotRegisteredError } from '../../domain/QueryNotRegisteredError'

export class QueryHandlers extends Map<Query, QueryHandler<Query, Response>> {
  constructor(queryHandlers: Array<QueryHandler<Query, Response>>) {
    super()
    queryHandlers.forEach((queryHandler) => {
      this.set(queryHandler.subscribedTo(), queryHandler)
    })
  }

  public get(query: Query): QueryHandler<Query, Response> {
    const queryHandler = super.get(query.constructor)
    if (queryHandler == null) {
      throw new QueryNotRegisteredError(query)
    }
    return queryHandler
  }
}
