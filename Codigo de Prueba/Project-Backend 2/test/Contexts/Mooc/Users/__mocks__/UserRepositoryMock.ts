import { type UserEmail } from '../../../../../src/Contexts/Mooc/Users/domain/UserEmail'
import { type User } from '../../../../../src/Contexts/Mooc/Users/domain/User'
import { type UserRepository } from '../../../../../src/Contexts/Mooc/Users/domain/UserRepository'
import { type Nullable } from '../../../../../src/Contexts/Shared/domain/Nullable'

export class UserRepositoryMock implements UserRepository {
  private readonly saveMock: jest.Mock
  private readonly searchMock: jest.Mock
  private readonly users: User[] = []

  constructor() {
    this.saveMock = jest.fn()
    this.searchMock = jest.fn()
  }

  async save(user: User): Promise<void> {
    this.saveMock(user)
  }

  async search(email: UserEmail): Promise<Nullable<User>> {
    this.searchMock(email)
    return this.users.find((user) => user.email.value === email.value)
  }

  assertSaveHaveBeenCalledWith(user: User): void {
    expect(this.saveMock).toHaveBeenCalledWith(user)
  }

  assertSearchHaveBeenCalledWith(email: UserEmail): void {
    expect(this.searchMock).toHaveBeenCalledWith(email)
  }

  searchMockReturnValue(user: User): void {
    this.users.push(user)
  }
}
