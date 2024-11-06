import { UserCreator } from '../../../../../src/Contexts/Mooc/Users/application/Create/UserCreator'
import { UserMother } from '../domain/UserMother'
import { UserRepositoryMock } from '../__mocks__/UserRepositoryMock'
import EventBusMock from '../../../Shared/domain/EventBusMock'
import { UserCreatedDomainEventMother } from '../domain/UserCreatedDomainEventMother'
import { CreateUserCommandHandler } from '../../../../../src/Contexts/Mooc/Users/application/Create/CreateUserCommandHandler'
import { CreateUserCommandMother } from './CreateUserCommandMother'

let repository: UserRepositoryMock
let creator: UserCreator
let eventBus: EventBusMock
let handler: CreateUserCommandHandler

beforeEach(() => {
  repository = new UserRepositoryMock()
  eventBus = new EventBusMock()
  creator = new UserCreator(repository, eventBus)
  handler = new CreateUserCommandHandler(creator)
})

describe('CreateUserCommandHandler', () => {
  it('should create a valid user', async () => {
    const command = CreateUserCommandMother.random()
    const user = UserMother.from(command)
    const domainEvent = UserCreatedDomainEventMother.fromUser(user)

    await handler.handle(command)

    repository.assertSaveHaveBeenCalledWith(user)
    eventBus.assertLastPublishedEventIs(domainEvent)
  })
  // TODO: add test for invalid email
})
