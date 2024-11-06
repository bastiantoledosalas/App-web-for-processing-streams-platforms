import { type Nullable } from '../../../../Shared/domain/Nullable'
import { MongoRepository } from '../../../../Shared/infrastructure/persistence/mongo/MongoRepository'
import { User } from '../../domain/User'
import { type UserRepository } from '../../domain/UserRepository'
import { type UserEmail } from '../../domain/UserEmail'

/**
 * This interface is used to define the document
 * that will be stored in the database.
 */
interface UserDocument {
  _id: string
  firstName: string
  lastName: string
  email: string
  password: string
}

/**
 * This class is used to store the users in a MongoDB database.
 */
export class MongoUserRepository
  extends MongoRepository<User>
  implements UserRepository
{
  /**
   * This method is used to save a user in the database.
   *
   * @param {User} user The user to save.
   * @returns {Promise<void>}
   */
  public async save(user: User): Promise<void> {
    await this.persist(user.id.value, user)
  }

  /**
   * This method is used to search a user in the database.
   *
   * @param {UserEmail} email The email of the user to search.
   * @returns {Promise<Nullable<User>>} The user, if found. Null, otherwise.
   */
  public async search(email: UserEmail): Promise<Nullable<User>> {
    const collection = await this.collection()
    const document = await collection.findOne<UserDocument>({
      email: email.value
    })

    return document != null
      ? User.fromPrimitives({
          id: document._id,
          firstName: document.firstName,
          lastName: document.lastName,
          email: document.email,
          password: document.password
        })
      : null
  }

  /**
   * This method is used to define the name of the collection
   * where the users will be stored.
   *
   * @returns {string} The name of the collection.
   */
  protected collectionName(): string {
    return 'users'
  }
}
