//index.ts (master class for express.Router)
//import specific types from express library

//NextFunction used to define middleware functions and access or modified to req,res and next middleware functions
//Router used to create modular, mountable route handlers
//Request reprents the HTTP request that express app receives.
//Response represents the HTTP response that express send when receive an HTTP request.

import {
  type NextFunction,
  type Router,
  type Request,
  type Response
} from 'express'

//ValidationResult used for inputs validation
import { validationResult } from 'express-validator'

//glob used for file system operations
//globSync is used to finding files that match a specific pattern in a directory.
import { globSync } from 'glob'

//http-status used to reference HTTP status codes in Node.js application
import httpStatus from 'http-status'

//path module used to working with file paths and directory paths
import path from 'path'



/**
 * register function: Registers a route
 * 
 * @param routePath A string representing The path to a route module.
 * @param router    A instance of the Express Router that will be used to register routes.
 * @returns         A promise that resolves when the route has been registered.
 * The await import is used to asynchronously load the module.
 * Once the module is loaded, it's assigned to the route variable.
 */

async function register(routePath: string, router: Router): Promise<void> {
  const route = await import(routePath)
  route.register(router)
}

/**
 * registerRouters function: Automatically Registers all routes or registers routes defined in route modules within a directory
 *
 * @param router  An instance of the Express Router to which the routes will be registered.
 * @returns       An promise that resolves when all routes have been registered.
 * const routes matches files with any name that have .route extension in any subdirectory (status.routes.ts, user-token.route.ts,etc)
 * for each route file call the register function to register the route defined in that file with the provided router.
 */

export function registerRoutes(router: Router): void {
  const routes = globSync(path.join(__dirname, '**/*.route.*'))
  routes.forEach((route) => {
    void register(route, router)
  })
}

/**
 * validateReqSchema function: Validates the request schema using the validationResult function
 *
 * @param Request   An instance of request object 
 * @param Response  An instance of response object
 * @param next      The next middleware function in the Express middleware chain 
 * ValidationResult extract validation errors from the request, if is empty return an undefined
 * 
 */
export function validateReqSchema(
  req: Request,
  res: Response,
  next: NextFunction
): undefined {
  const validationErrors = validationResult(req)
  if (validationErrors.isEmpty()) {
    next()
    return
  }
  /**
   * ValidationErrors.mapped converts the array of errors into an object where each key is the parameter or field name 
   * The value is the corresponding error message
   * If there are validations errors the HTTP response status code to 422 and send JSON response with the validation errors
   */
  const errors = validationErrors.mapped()
  res.status(httpStatus.UNPROCESSABLE_ENTITY).json({ errors })
}
