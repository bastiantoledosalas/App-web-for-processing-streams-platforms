import { type Request, type Response } from 'express'
import httpStatus from 'http-status'
import { type CommandBus } from '../../../../Contexts/Shared/domain/CommandBus'
import { type Controller } from './Controller'
import { CreateUserCommand } from '../../../../Contexts/Mooc/Users/domain/CreateUserCommand'

type UserPutRequest = Request & {
  body: {
    id: string
    firstName: string
    lastName: string
    email: string
    password: string
    repeatPassword: string
  }
}

export class UserPutController implements Controller {
  constructor(private readonly commandBus: CommandBus) {}

  async run(req: UserPutRequest, res: Response): Promise<void> {
    try {
      const { id, firstName, lastName, email, password, repeatPassword } = req.body
      const createUserCommand = new CreateUserCommand({
        id,
        firstName,
        lastName,
        email,
        password,
        repeatPassword
      })
      await this.commandBus.dispatch(createUserCommand)
      res.sendStatus(httpStatus.CREATED)
    } catch (error) {
      console.log(error)
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send()
    }
  }
}
