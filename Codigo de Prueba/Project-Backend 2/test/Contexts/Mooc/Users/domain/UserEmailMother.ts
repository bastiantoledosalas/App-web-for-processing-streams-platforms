import { EmailMother } from '../../../Shared/domain/EmailMother'
import { UserEmail } from '../../../../../src/Contexts/Mooc/Users/domain/UserEmail'

export class UserEmailMother {
  static create(value: string): UserEmail {
    return new UserEmail(value)
  }

  static random(): UserEmail {
    return this.create(EmailMother.random())
  }

  static invalid(): string {
    return 'invalid-email'
  }
}
