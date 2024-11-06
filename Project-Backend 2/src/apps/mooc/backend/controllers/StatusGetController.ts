import { type Request, type Response } from 'express'
import httpStatus from 'http-status'
import { type Controller } from './Controller'

/**
 * Controller for the status route.
 *
 * @implements {Controller}
 * @exports
 */
export default class StatusGetController implements Controller {
  run(_req: Request, res: Response): void {
    res.status(httpStatus.OK).send()
  }
}
