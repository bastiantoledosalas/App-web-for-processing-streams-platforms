
import { type Controller } from './Controller'


type UserGetRequest = Request & {
    body: {
      id: string
      firstName: string
      lastName: string
      email: string
      password: string
    }
  }

export class UserGetController implements Controller {

    constructor(private readonly commandBus: CommandBus) {}

    run: (req: UserGetRequest, res: Response) => Promise<void> | void{
        try {
            const { id, firstName, lastName, email, password } = req.body
            const loginCommand = new UserLoginCommand({id,firstName, lastName, email, password})
            
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
