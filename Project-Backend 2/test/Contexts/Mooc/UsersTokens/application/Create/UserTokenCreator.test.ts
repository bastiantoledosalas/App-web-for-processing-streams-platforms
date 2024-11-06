import EventBusMock from '../../../../Shared/domain/EventBusMock'
import { UserTokenCreator } from '../../../../../../src/Contexts/Mooc/UsersTokens/application/Create/UserTokenCreator'
import { UserTokenRepositoryMock } from '../../__mocks__/UserTokenRepositoryMock'
import { UserEmailMother } from '../../../Users/domain/UserEmailMother'
import { UserTokenMother } from '../../domain/UserTokenMother'

describe('UserTokenCreator', () => {
  let creator: UserTokenCreator
  let repository: UserTokenRepositoryMock
  let eventBus: EventBusMock

  beforeEach(() => {
    eventBus = new EventBusMock()
    repository = new UserTokenRepositoryMock()
    creator = new UserTokenCreator(repository, eventBus)
  })

  it('should create a valid user token', async () => {
    const userEmail = UserEmailMother.random()
    const userToken = UserTokenMother.fromEmail(userEmail)

    await creator.run(userEmail)

    repository.assertLastUserTokenSaved(userToken)
  })

  it('should not create a user token if it already exists', async () => {
    const userEmail = UserEmailMother.random()
    const userTokenOne = UserTokenMother.fromEmail(userEmail)
    UserTokenMother.fromEmail(userEmail)
    await creator.run(userEmail)

    repository.assertLastUserTokenSaved(userTokenOne)
  })
})
