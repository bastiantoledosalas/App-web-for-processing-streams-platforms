import { type Command } from '../../domain/Command'
import { type CommandHandler } from '../../domain/CommandHandler'
import { CommandNotRegisteredError } from '../../domain/CommandNotRegisteredError'

export class CommandHandlers extends Map<Command, CommandHandler<Command>> {
  constructor(commandHandlers: Array<CommandHandler<Command>>) {
    super()
    commandHandlers.forEach((commandHandler) => {
      this.set(commandHandler.subscribedTo(), commandHandler)
    })
  }

  public get(command: Command): CommandHandler<Command> {
    const commandHandler = super.get(command.constructor)
    if (commandHandler == null) {
      throw new CommandNotRegisteredError(command)
    }
    return commandHandler
  }
}
