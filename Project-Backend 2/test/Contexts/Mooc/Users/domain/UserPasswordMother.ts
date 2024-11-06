import { PasswordMother } from '../../../Shared/domain/PasswordMother'
import { UserPassword } from '../../../../../src/Contexts/Mooc/Users/domain/UserPassword'

export class UserPasswordMother {
  static create(value: string): UserPassword {
    return new UserPassword(value)
  }

  static random(): UserPassword {
    return this.create(PasswordMother.random({ minLength: 10, maxLength: 20 }))
  }
}
