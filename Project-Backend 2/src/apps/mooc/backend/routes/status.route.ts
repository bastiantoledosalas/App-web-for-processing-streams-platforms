import { type Router, type Request, type Response } from 'express'
import type StatusGetController from '../controllers/StatusGetController'
import container from '../dependency-injection'

/**
 * Registers the status route.
 *
 * @param router The router to register the route to.
 * @returns Nothing.
 */
export const register = (router: Router): void => {
  const controller: StatusGetController = container.get(
    'Apps.mooc.controllers.StatusGetController'
  )
  router.get('/status', (req: Request, res: Response) => {
    controller.run(req, res)
  })
}
