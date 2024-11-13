
//Request represent the HTTP request that express app receives.
//Response represent the HTTP response that express send when receive an HTTP request.
import { type Request, type Response } from 'express'

//http-status used to reference HTTP status codes in Node.js application
import httpStatus from 'http-status'

//importing CommandBus.ts Interface from /Contexts/Shared/domain/ directory
import { type CommandBus } from '../../../../Contexts/Shared/domain/CommandBus'

//Importing Controller.ts Interface from /controllers/ directory
import { type Controller } from './Controller'

//Importing CreateUserCommand.ts from /Contexts/Mooc/Users/domain/ directory
import { CreateUserCommand } from '../../../../Contexts/App/Users/domain/CreateUserCommand'

/**
 * 
 * @type  UserPutRequest Define a new type UserPutRequest which extends the Request type provided by Express.js
 *                        Add additionals property body to contain an object with specific fields
 **/
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

/**
 * constructor that receive CommandBus parameter, these are marked as readonly that indicate that can't be reassigned after initialization in the constructor
 * 
 * @param commandBus  instance of CommandBus class
 **/
export class UserPutController implements Controller {
  constructor(private readonly commandBus: CommandBus) {}


/**
 * 
 * @const     id,firstName,lastName,etc   extract properties from the req.body and assign to const with the same name
 * @const     createUserCommand           create a new instance of CreateUserCommand and passing const to the constructor class of CreateUserCommand 
 * @function  dispatch                    used for sending the command to its handler for execution, besides send the createUserCommand to the command bus
 * @function  sendStatus                  used to send an HTTP response with the status code 201 Created, the request resource has been successfully created on the server
 * @function  status                      used to send an HTTP response with the status code 500 Internal Server Error and an empty response body.
 **/

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
