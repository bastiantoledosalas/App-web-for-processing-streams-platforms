import { MongoRepository } from '../../../../Shared/infrastructure/persistence/mongo/MongoRepository'
import { UserToken } from '../../domain/UserToken'
import { type UserTokenRepository } from '../../domain/UserTokenRepository'
import { type UserEmail } from '../../../Users/domain/UserEmail'

interface UserTokenDocument {
  _id: string
  email: string
  token: string
}

export class MongoUserTokenRepository
  extends MongoRepository<UserToken>
  implements UserTokenRepository
{
  public async save(userToken: UserToken): Promise<void> {
    await this.persist(userToken.id.value, userToken)
  }

  public async search(userEmail: UserEmail): Promise<UserToken | null> {
    const collection = await this.collection()
    let retryCount = 0
    const maxRetries = 4
    let document: UserTokenDocument | null | undefined = null
    while (retryCount < maxRetries) {
      try {
        document = await collection.findOne<UserTokenDocument>({
          email: userEmail.value
        })
        if (document != null) {
          break
        }
      } catch (error) {
        console.log(`Error en el intento ${retryCount + 1}`, error)
      }
      retryCount++
      await new Promise((resolve) => setTimeout(resolve, 1000 * retryCount))
    }
    return document != null
      ? UserToken.fromPrimitives({
          id: document._id,
          email: document.email,
          token: document.token
        })
      : null
  }

  protected collectionName(): string {
    return 'usersTokens'
  }
}
