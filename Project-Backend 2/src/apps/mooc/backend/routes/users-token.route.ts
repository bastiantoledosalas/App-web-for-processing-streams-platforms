import { type Request, type Response, type Router } from 'express'
import { body } from 'express-validator'
import { validateReqSchema } from '.'
import container from '../dependency-injection'

export const register = (router: Router): void => {
  const reqSchema = [
    body('email').exists().isEmail(),
    body('password').exists().isString()
  ]
  const userPostController = container.get(
    'Apps.mooc.controllers.UserPostController'
  )
  router.post(
    '/auth/login',
    reqSchema,
    validateReqSchema,
    (req: Request, res: Response) => userPostController.run(req, res)
  )
}
