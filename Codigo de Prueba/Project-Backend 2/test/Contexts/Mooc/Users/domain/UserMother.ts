import { type UserId } from '../../../../../src/Contexts/Mooc/Shared/domain/Users/UserId'
import { type CreateUserCommand } from '../../../../../src/Contexts/Mooc/Users/domain/CreateUserCommand'
import { User } from '../../../../../src/Contexts/Mooc/Users/domain/User'
import { type UserFirstName } from '../../../../../src/Contexts/Mooc/Users/domain/UserFirstName'
import { type UserLastName } from '../../../../../src/Contexts/Mooc/Users/domain/UserLastName'
import { type UserPassword } from '../../../../../src/Contexts/Mooc/Users/domain/UserPassword'
import { UserIdMother } from '../../Shared/domain/Users/UserIdMother'
import { UserEmailMother } from './UserEmailMother'
import { UserFirstNameMother } from './UserFirstNameMother'
import { UserLastNameMother } from './UserLastNameMother'
import { UserPasswordMother } from './UserPasswordMother'

export class UserMother {
  static create(
    id: UserId,
    firstName: UserFirstName,
    lastName: UserLastName,
    email: UserFirstName,
    password: UserPassword
  ): User {
    return new User(id, firstName, lastName, email, password)
  }

  static from(command: CreateUserCommand): User {
    return this.create(
      UserIdMother.create(command.id),
      UserFirstNameMother.create(command.firstName),
      UserLastNameMother.create(command.lastName),
      UserEmailMother.create(command.email),
      UserPasswordMother.create(command.password)
    )
  }

  static random(): User {
    return this.create(
      UserIdMother.random(),
      UserFirstNameMother.random(),
      UserLastNameMother.random(),
      UserEmailMother.random(),
      UserPasswordMother.random()
    )
  }
}
