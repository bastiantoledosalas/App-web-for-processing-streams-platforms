import { type Request, type Response } from 'express'

/**
 * Interface for controllers.
 *
 * @function run The function that runs the controller.
 */
export interface Controller {
  run: (req: Request, res: Response) => Promise<void> | void
}
