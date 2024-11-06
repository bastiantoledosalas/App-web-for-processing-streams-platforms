import bodyParser from 'body-parser'
import compress from 'compression'
import errorHandler from 'errorhandler'
import express, {
  type Request,
  type Response,
  type NextFunction
} from 'express'
import Router from 'express-promise-router'
import helmet from 'helmet'
import type * as http from 'http'
import httpStatus from 'http-status'
import { registerRoutes } from './routes'

/**
 * An HTTP server.
 *
 * @constructor Creates a new HTTP server.
 * @function listen Starts the HTTP server.
 * @function stop Stops the HTTP server.
 */

export class Server {
  private readonly express: express.Application
  private readonly port: string
  private httpServer?: http.Server

  /**
   * Creates a new HTTP server.
   *
   * @param port The port to listen on.
   * @returns The new HTTP server.
   */
  constructor(port: string) {
    this.port = port
    this.express = express()
    this.express.use(bodyParser.json())
    this.express.use(bodyParser.urlencoded({ extended: true }))
    this.express.use(helmet.xssFilter())
    this.express.use(helmet.noSniff())
    this.express.use(helmet.hidePoweredBy())
    this.express.use(helmet.frameguard({ action: 'deny' }))
    this.express.use(compress())
    const router = Router()
    router.use(errorHandler())
    this.express.use(router)
    registerRoutes(router)
    router.use(
      (err: Error, _req: Request, res: Response, _next: NextFunction) => {
        console.log(err)
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err.message)
      }
    )
  }

  /**
   * Gets the HTTP server.
   *
   * @returns The HTTP server.
   */
  getHttpServer(): http.Server | undefined {
    return this.httpServer
  }

  /**
   * Starts the HTTP server.
   *
   * @returns A promise that resolves when the server has started.
   */
  async listen(): Promise<void> {
    await new Promise<void>((resolve) => {
      this.httpServer = this.express.listen(this.port, () => {
        console.log(
          `Mooc Backend App is running at http://localhost:${this.port} in ${
            this.express.get('env') as string
          } mode`
        )
        console.log('Press CTRL-C to stop\n')
        resolve()
      })
    })
  }

  /**
   * Stops the HTTP server.
   *
   * @returns A promise that resolves when the server has stopped.
   */
  async stop(): Promise<void> {
    await new Promise<void>((resolve, reject) => {
      if (this.httpServer != null) {
        this.httpServer.close((error) => {
          if (error != null) {
            reject(error)
            return
          }
          resolve()
        })
      }
      resolve()
    })
  }
}
