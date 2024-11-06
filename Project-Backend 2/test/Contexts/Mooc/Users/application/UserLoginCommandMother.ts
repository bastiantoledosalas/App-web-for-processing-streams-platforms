import { type UserPassword } from '../../../../../src/Contexts/Mooc/Users/domain/UserPassword'
import { type UserEmail } from '../../../../../src/Contexts/Mooc/Users/domain/UserEmail'
import { type UserLoginCommand } from '../../../../../src/Contexts/Mooc/Users/domain/UserLoginCommand'
import { UserEmailMother } from '../domain/UserEmailMother'
import { UserPasswordMother } from '../domain/UserPasswordMother'

export class UserLoginCommandMother {
  static create(email: UserEmail, password: UserPassword): UserLoginCommand {
    return {
      email: email.value,
      password: password.value
    }
  }

  static invalid(): UserLoginCommand {
    return this.create(UserEmailMother.random(), UserPasswordMother.random())
  }
}
