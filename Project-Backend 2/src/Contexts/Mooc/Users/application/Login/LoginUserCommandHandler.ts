import { type Command } from '../../../../Shared/domain/Command'
import { type CommandHandler } from '../../../../Shared/domain/CommandHandler'
import { UserLoginCommand } from '../../domain/UserLoginCommand'
import { type UserLogin } from './UserLogin'
import { UserEmail } from '../../domain/UserEmail'
import { UserPassword } from '../../domain/UserPassword'

export class LoginUserCommandHandler
  implements CommandHandler<UserLoginCommand>
{
  constructor(private readonly userLogin: UserLogin) {}

  subscribedTo(): Command {
    return UserLoginCommand
  }

  async handle(command: UserLoginCommand): Promise<void> {
    const email = new UserEmail(command.email)
    const password = new UserPassword(command.password)
    await this.userLogin.run({ email, password })
  }
}
