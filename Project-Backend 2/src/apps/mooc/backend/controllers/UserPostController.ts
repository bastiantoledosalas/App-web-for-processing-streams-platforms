import { type Request, type Response } from 'express'
import httpStatus from 'http-status'
import { type Controller } from './Controller'
import { type QueryBus } from '../../../../Contexts/Shared/domain/QueryBus'
import { type CommandBus } from '../../../..//Contexts/Shared/domain/CommandBus'
import { UserLoginCommand } from '../../../../Contexts/Mooc/Users/domain/UserLoginCommand'
import { FindUserTokenQuery } from '../../../../Contexts/Mooc/UsersTokens/application/Find/FindUserTokenQuery'
import { type FindUserTokenResponse } from '../../../../Contexts/Mooc/UsersTokens/application/Find/FindUserTokenResponse'

type UserPostRequest = Request & {
  body: {
    email: string
    password: string
  }
}

export class UserPostController implements Controller {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  async run(req: UserPostRequest, res: Response): Promise<void> {
    try {
      const { email, password } = req.body
      const loginCommand = new UserLoginCommand({
        email,
        password
      })
      await this.commandBus.dispatch(loginCommand)
      const query = new FindUserTokenQuery(email)
      const { token } = await this.queryBus.ask<FindUserTokenResponse>(query)
      res.status(httpStatus.OK).json({
        data: {
          token
        },
        ok: true
      })
    } catch (error) {
      console.log(error)
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send()
    }
  }
}
