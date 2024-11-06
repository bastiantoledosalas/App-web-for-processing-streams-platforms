import { type UserEmail } from '../../Users/domain/UserEmail'
import { type UserToken } from './UserToken'

export interface UserTokenRepository {
  save: (token: UserToken) => Promise<void>
  search: (email: UserEmail) => Promise<UserToken | null>
}
