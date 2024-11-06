import { UserTokenId } from '../../../../../src/Contexts/Mooc/UsersTokens/domain/UserTokenId'
import { UuidMother } from '../../../Shared/domain/UuidMother'

export class UserTokenIdMother {
  static create(value: string): UserTokenId {
    return new UserTokenId(value)
  }

  static random(): UserTokenId {
    return this.create(UuidMother.random())
  }
}
