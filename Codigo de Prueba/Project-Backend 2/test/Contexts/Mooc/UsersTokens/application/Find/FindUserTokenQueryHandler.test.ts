import { FindUserTokenQuery } from '../../../../../../src/Contexts/Mooc/UsersTokens/application/Find/FindUserTokenQuery'
import { FindUserTokenQueryHandler } from '../../../../../../src/Contexts/Mooc/UsersTokens/application/Find/FindUserTokenQueryHandler'
import { UsersTokenFinder } from '../../../../../../src/Contexts/Mooc/UsersTokens/application/Find/UsersTokenFinder'
import { UserTokenNotExist } from '../../../../../../src/Contexts/Mooc/UsersTokens/domain/UserTokenNotExist'
import { UserTokenRepositoryMock } from '../../__mocks__/UserTokenRepositoryMock'
import { UserTokenMother } from '../../domain/UserTokenMother'

let repository: UserTokenRepositoryMock

describe('FindUserTokenQueryHandler', () => {
  beforeEach(() => {
    repository = new UserTokenRepositoryMock()
  })

  it('should find a valid user token', async () => {
    const token = UserTokenMother.random()
    repository.returnOnSearch(token)
    const finder = new UsersTokenFinder(repository)
    const handler = new FindUserTokenQueryHandler(finder)

    const response = await handler.handle(
      new FindUserTokenQuery(token.email.value)
    )
    repository.assertSearch(token.email)
    expect(token.token.value).toEqual(response.token)
  })

  it('should throw an exception when user token does not exist', async () => {
    const finder = new UsersTokenFinder(repository)
    const handler = new FindUserTokenQueryHandler(finder)

    await expect(
      handler.handle(new FindUserTokenQuery('jonhdoe@gmail.com'))
    ).rejects.toBeInstanceOf(UserTokenNotExist)
  })
})
