import { UserLogin } from '../../../../../src/Contexts/Mooc/Users/application/Login/UserLogin'
import { UserRepositoryMock } from '../__mocks__/UserRepositoryMock'
import EventBusMock from '../../../Shared/domain/EventBusMock'
import { LoginUserCommandHandler } from '../../../../../src/Contexts/Mooc/Users/application/Login/LoginUserCommandHandler'
import { UserMother } from '../domain/UserMother'
import { UserLoginCommandMother } from './UserLoginCommandMother'
import { UserCredentialsMother } from '../domain/UserCredentialsMother'
import { UserLoggedDomainEventMother } from '../domain/UserLoggedDomainEventMother'
import { UserCredentialsError } from '../../../../../src/Contexts/Mooc/Users/domain/UserCredentialsError'
import { UserPasswordMother } from '../domain/UserPasswordMother'
import { UserTokenRepositoryMock } from '../../UsersTokens/__mocks__/UserTokenRepositoryMock'

let repository: UserRepositoryMock
let repositoryToken: UserTokenRepositoryMock
let userLogin: UserLogin
let eventBus: EventBusMock
let handler: LoginUserCommandHandler

beforeEach(() => {
  repository = new UserRepositoryMock()
  repositoryToken = new UserTokenRepositoryMock()
  eventBus = new EventBusMock()
  userLogin = new UserLogin(repository, eventBus, repositoryToken)
  handler = new LoginUserCommandHandler(userLogin)
})

describe('LoginUserCommandHandler', () => {
  it('should login a valid user', async () => {
    const user = UserMother.random()
    repository.searchMockReturnValue(user)
    const command = UserLoginCommandMother.create(user.email, user.password)
    const userCredentials = UserCredentialsMother.from(command, user.id)
    const domainEvent =
      UserLoggedDomainEventMother.fromUserCredentials(userCredentials)

    await handler.handle(command)
    repository.assertSearchHaveBeenCalledWith(userCredentials.email)
    eventBus.assertLastPublishedEventIs(domainEvent)
  })
  it('should not login an invalid user', async () => {
    expect(async () => {
      const user = UserMother.random()
      repository.searchMockReturnValue(user)
      const command = UserLoginCommandMother.invalid()
      const userCredentials = UserCredentialsMother.from(command, user.id)
      await handler.handle(command)
      repository.assertSearchHaveBeenCalledWith(userCredentials.email)
    }).not.toBeInstanceOf(UserCredentialsError)
  })
  it('should not login an invalid password', async () => {
    expect(async () => {
      const user = UserMother.random()
      repository.searchMockReturnValue(user)
      const command = UserLoginCommandMother.create(
        user.email,
        UserPasswordMother.random()
      )
      const userCredentials = UserCredentialsMother.from(command, user.id)
      await handler.handle(command)
      repository.assertSearchHaveBeenCalledWith(userCredentials.email)
    }).not.toBeInstanceOf(UserCredentialsError)
  })
})
