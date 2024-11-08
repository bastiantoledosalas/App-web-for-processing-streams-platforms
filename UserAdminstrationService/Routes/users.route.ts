
//Router used to create modular, mountable route handlers
//Request reprents the HTTP request that express app receives.
//Response represents the HTTP response that express send when receive an HTTP request.
import { type Request, type Response, type Router } from 'express'

//body is used to define validation chains for request body parameters in Express routes
import { body } from 'express-validator'

//Importing the validateReqSchema in index.ts function from index.ts in routes directory
import { validateReqSchema } from '.'

//Importing container in index.ts from /dependency-injection/ directory
import container from '../dependency-injection'

/** register: function that take the router as argument 
 * 
 * @body id, firstName, lastName, repeatPassword  2 Validations: Check if this fields exist and verificate if are a string values    
 * @body email                                    2 Validations: Check if this field exist and verificate if is a valid email address format (alphanumeric part followed by the @ symbol)
 * for repeatPassword .custom defines a custom validation rule: Check if the value matches the value of password field                           
 * if the validation fails (passwords don't match) returns an error for the request.
 */

export const register = (router: Router): void => {
  const reqSchema = [
    body('id').exists().isString(),
    body('firstName').exists().isString(),
    body('lastName').exists().isString(),
    body('email').exists().isEmail(),
    body('password').exists().isString(),
    body('repeatPassword').exists().isString().custom((value, { req }) => {
        return value === req.body.password
      })
  ]

  /**
   * This code retrieves an instance of UserPutController class from dependency-injection container
   * @Apps.mooc.controllers.UserPutController is used as the indentifier or key to locate UserPutcontroller in dependency-injection/apps/application.json route
   */
  const userPutController = container.get('controllers.UserPutController')

  /**
   * PUT method is used to update or modified values in users
 * router.put: Define a PUT route handler for /users/:id endpoint
 * Besides to use the reqSchema Array to validate the request body parameters with validateReqSchema function
 * Delegated the handling of the request to run method in userPutController.ts locate in controller directory
 */
  router.put(
    '/users/:id',
    reqSchema,
    validateReqSchema,
    (req: Request, res: Response) => userPutController.run(req, res)
  )
}
