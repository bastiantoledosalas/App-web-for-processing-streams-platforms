import { type MongoClient } from 'mongodb'
import { EnvironmentArranger } from '../arranger/EnvironmentArranger'

export class MongoEnvironmentArranger extends EnvironmentArranger {
  constructor(private readonly _client: Promise<MongoClient>) {
    super()
  }

  public async arrange(): Promise<void> {
    await this.cleanDatabase()
  }

  protected async cleanDatabase(): Promise<void> {
    const collections = await this.collections()
    const client = await this.client()
    for (const collection of collections) {
      await client.db().collection(collection).deleteMany({})
    }
  }

  private async collections(): Promise<string[]> {
    const client = await this.client()
    const collections = await client
      .db()
      .listCollections(undefined, { nameOnly: true })
      .toArray()
    return collections.map((c) => c.name)
  }

  protected async client(): Promise<MongoClient> {
    return await this._client
  }

  public async close(): Promise<void> {
    await (await this.client()).close()
  }
}
