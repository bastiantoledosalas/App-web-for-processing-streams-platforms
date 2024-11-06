import { type Nullable } from '../../../Shared/domain/Nullable'
import { type User } from './User'
import { type UserEmail } from './UserEmail'

export interface UserRepository {
  save: (user: User) => Promise<void>
  search: (email: UserEmail) => Promise<Nullable<User>>
}
