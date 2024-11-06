import { type UserId } from '../../../../../src/Contexts/Mooc/Shared/domain/Users/UserId'
import { type CreateUserCommand } from '../../../../../src/Contexts/Mooc/Users/domain/CreateUserCommand'
import { type UserEmail } from '../../../../../src/Contexts/Mooc/Users/domain/UserEmail'
import { type UserFirstName } from '../../../../../src/Contexts/Mooc/Users/domain/UserFirstName'
import { type UserLastName } from '../../../../../src/Contexts/Mooc/Users/domain/UserLastName'
import { type UserPassword } from '../../../../../src/Contexts/Mooc/Users/domain/UserPassword'
import { UserIdMother } from '../../Shared/domain/Users/UserIdMother'
import { UserEmailMother } from '../domain/UserEmailMother'
import { UserFirstNameMother } from '../domain/UserFirstNameMother'
import { UserLastNameMother } from '../domain/UserLastNameMother'
import { UserPasswordMother } from '../domain/UserPasswordMother'

export class CreateUserCommandMother {
  static create(
    id: UserId,
    firstName: UserFirstName,
    lastName: UserLastName,
    email: UserEmail,
    password: UserPassword,
    repeatPassword: UserPassword
  ): CreateUserCommand {
    return {
      id: id.value,
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
      password: password.value,
      repeatPassword: repeatPassword.value
    }
  }

  static random(): CreateUserCommand {
    const password = UserPasswordMother.random()
    return this.create(
      UserIdMother.random(),
      UserFirstNameMother.random(),
      UserLastNameMother.random(),
      UserEmailMother.random(),
      password,
      password
    )
  }

  static invalid(): CreateUserCommand {
    return {
      id: UserIdMother.random().value,
      firstName: UserFirstNameMother.random().value,
      lastName: UserLastNameMother.random().value,
      email: UserEmailMother.invalid(),
      password: UserPasswordMother.random().value,
      repeatPassword: UserPasswordMother.random().value
    }
  }
}
