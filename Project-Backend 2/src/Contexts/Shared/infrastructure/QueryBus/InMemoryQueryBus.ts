import { type Query } from '../../domain/Query'
import { type Response } from '../../domain/Response'
import { type QueryBus } from '../../domain/QueryBus'
import { type QueryHandlers } from './QueryHandlers'

export class InMemoryQueryBus implements QueryBus {
  constructor(private readonly queryHandlersInformation: QueryHandlers) {}

  async ask<R extends Response>(query: Query): Promise<R> {
    const handler = this.queryHandlersInformation.get(query)
    return await ((await handler.handle(query)) as Promise<R>)
  }
}
