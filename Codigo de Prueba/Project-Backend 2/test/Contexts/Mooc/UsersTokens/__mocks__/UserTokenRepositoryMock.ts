import { type UserTokenRepository } from '../../../../../src/Contexts/Mooc/UsersTokens/domain/UserTokenRepository'
import { UserToken } from '../../../../../src/Contexts/Mooc/UsersTokens/domain/UserToken'
import { type UserEmail } from '../../../../../src/Contexts/Mooc/Users/domain/UserEmail'

export class UserTokenRepositoryMock implements UserTokenRepository {
  private readonly mockSave = jest.fn()
  private readonly mockSearch = jest.fn()
  private userToken: UserToken | null = null

  async search(email: UserEmail): Promise<UserToken | null> {
    this.mockSearch(email)
    return this.userToken
  }

  async save(token: UserToken): Promise<void> {
    this.mockSave(token)
  }

  returnOnSearch(userToken: UserToken): void {
    this.userToken = userToken
  }

  assertSearch(email: UserEmail): void {
    expect(this.mockSearch).toHaveBeenCalledWith(email)
  }

  assertNotSave(): void {
    expect(this.mockSave).toHaveBeenCalledTimes(0)
  }

  assertLastUserTokenSaved(userToken: UserToken): void {
    const mock = this.mockSave.mock
    const lastUserToken = mock.calls[mock.calls.length - 1][0] as UserToken
    const { id: id1, ...userTokenPrimitives } = userToken.toPrimitives()
    const { id: id2, ...lastSavedPrimitives } = lastUserToken.toPrimitives()

    expect(lastUserToken).toBeInstanceOf(UserToken)
    expect(lastSavedPrimitives).toEqual(userTokenPrimitives)
  }
}
