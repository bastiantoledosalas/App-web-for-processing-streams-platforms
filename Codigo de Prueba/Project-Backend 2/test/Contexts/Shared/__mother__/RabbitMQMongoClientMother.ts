import { type MongoClient } from 'mongodb'
import { MongoClientFactory } from '../../../../src/Contexts/Shared/infrastructure/persistence/mongo/MongoClientFactory'

export class RabbitMQMongoClientMother {
  static async create(): Promise<MongoClient> {
    const client = await MongoClientFactory.createClient('shared', {
      url: 'mongodb://localhost:27017/mooc-backend-test'
    })
    return client
  }
}
