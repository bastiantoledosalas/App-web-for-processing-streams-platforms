import {
  type NextFunction,
  type Response,
  type Router,
  type Request
} from 'express'
import { validationResult } from 'express-validator'
import { globSync } from 'glob'
import httpStatus from 'http-status'
import path from 'path'

/**
 * Registers a route.
 *
 * @param routePath The path to the route.
 * @param router The router to register the route with.
 * @returns A promise that resolves when the route has been registered.
 */
async function register(routePath: string, router: Router): Promise<void> {
  const route = await import(routePath)
  route.register(router)
}

/**
 * Registers all routes.
 *
 * @param router The router to register the routes with.
 * @returns A promise that resolves when all routes have been registered.
 */
export function registerRoutes(router: Router): void {
  const routes = globSync(path.join(__dirname, '**/*.route.*'))
  routes.forEach((route) => {
    void register(route, router)
  })
}

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
  const errors = validationErrors.mapped()
  res.status(httpStatus.UNPROCESSABLE_ENTITY).json({ errors })
}
