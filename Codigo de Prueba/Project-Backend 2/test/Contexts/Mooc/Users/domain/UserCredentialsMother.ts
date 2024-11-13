import { type UserPassword } from '../../../../../src/Contexts/Mooc/Users/domain/UserPassword'
import { type UserEmail } from '../../../../../src/Contexts/Mooc/Users/domain/UserEmail'
import { UserCredentials } from '../../../../../src/Contexts/Mooc/Users/domain/UserCredentials'
import { type UserLoginCommand } from '../../../../../src/Contexts/Mooc/Users/domain/UserLoginCommand'
import { UserEmailMother } from './UserEmailMother'
import { UserPasswordMother } from './UserPasswordMother'
import { type UserId } from '../../../../../src/Contexts/Mooc/Shared/domain/Users/UserId'
import { UserIdMother } from '../../Shared/domain/Users/UserIdMother'

export class UserCredentialsMother {
  static create(
    id: UserId,
    email: UserEmail,
    password: UserPassword
  ): UserCredentials {
    return new UserCredentials(id, email, password)
  }

  static from(command: UserLoginCommand, id: UserId): UserCredentials {
    return this.create(
      UserIdMother.create(id.value),
      UserEmailMother.create(command.email),
      UserPasswordMother.create(command.password)
    )
  }

  static random(): UserCredentials {
    return this.create(
      UserIdMother.random(),
      UserEmailMother.random(),
      UserPasswordMother.random()
    )
  }
}
