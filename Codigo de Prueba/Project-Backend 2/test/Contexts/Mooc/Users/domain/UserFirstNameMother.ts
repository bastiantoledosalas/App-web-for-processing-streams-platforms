import { UserFirstName } from '../../../../../src/Contexts/Mooc/Users/domain/UserFirstName'
import { WordMother } from '../../../Shared/domain/WordMother'

export class UserFirstNameMother {
  static create(value: string): UserFirstName {
    return new UserFirstName(value)
  }

  static random(): UserFirstName {
    return this.create(WordMother.random({ maxLength: 100 }))
  }
}
