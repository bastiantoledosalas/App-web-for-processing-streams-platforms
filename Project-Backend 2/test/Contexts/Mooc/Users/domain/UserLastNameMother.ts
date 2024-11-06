import { UserLastName } from '../../../../../src/Contexts/Mooc/Users/domain/UserLastName'
import { WordMother } from '../../../Shared/domain/WordMother'

export class UserLastNameMother {
  static create(value: string): UserLastName {
    return new UserLastName(value)
  }

  static random(): UserLastName {
    return this.create(WordMother.random({ maxLength: 100 }))
  }
}
