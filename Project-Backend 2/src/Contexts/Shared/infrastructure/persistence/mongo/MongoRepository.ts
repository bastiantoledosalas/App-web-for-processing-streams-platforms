import { type Collection, type MongoClient } from 'mongodb'
import { type AggregateRoot } from '../../../domain/AggregateRoot'

/**
 * This class is a base class for mongo repositories.
 * It provides some basic methods to persist and retrieve
 * aggregate roots.
 */
export abstract class MongoRepository<T extends AggregateRoot> {
  constructor(private readonly _client: Promise<MongoClient>) {}

  /**
   * Gets the name of the collection to use.
   *
   * @returns {string} The name of the collection.
   */
  protected abstract collectionName(): string

  /**
   * Gets the mongo client.
   *
   * @returns {MongoClient} The mongo client.
   */
  protected async client(): Promise<MongoClient> {
    return await this._client
  }

  /**
   * Gets the mongo collection.
   *
   * @returns {Collection} The mongo collection.
   */
  protected async collection(): Promise<Collection> {
    return (await this._client).db().collection(this.collectionName())
  }

  /**
   * This method persist data from an aggregate root.
   *
   * @param {string} id The id of the aggregate root.
   * @param {AggregateRoot} aggregateRoot The aggregate root to persist.
   * @returns {void}
   */
  protected async persist(id: string, aggregateRoot: T): Promise<void> {
    // TODO: Review the way to manually create the _id in version 5.7.0 of mongodb, currently it works in 4.0.0
    const collection = await this.collection()
    const document = {
      ...aggregateRoot.toPrimitives(),
      _id: id,
      id: undefined
    }
    await collection.updateOne(
      { _id: id },
      { $set: document },
      { upsert: true }
    )
  }
}
