import { type CommandHandler } from '../../../../Shared/domain/CommandHandler'
import { type UserCreator } from './UserCreator'
import { type Command } from '../../../../Shared/domain/Command'
import { UserId } from '../../../Shared/domain/Users/UserId'
import { UserFirstName } from '../../domain/UserFirstName'
import { UserLastName } from '../../domain/UserLastName'
import { UserEmail } from '../../domain/UserEmail'
import { UserPassword } from '../../domain/UserPassword'
import { CreateUserCommand } from '../../domain/CreateUserCommand'

export class CreateUserCommandHandler
  implements CommandHandler<CreateUserCommand>
{
  constructor(private readonly userCreator: UserCreator) {}

  subscribedTo(): Command {
    return CreateUserCommand
  }

  async handle(command: CreateUserCommand): Promise<void> {
    const id = new UserId(command.id)
    const firstName = new UserFirstName(command.firstName)
    const lastName = new UserLastName(command.lastName)
    const email = new UserEmail(command.email)
    const password = new UserPassword(command.password)
    await this.userCreator.run({ id, firstName, lastName, email, password })
  }
}
