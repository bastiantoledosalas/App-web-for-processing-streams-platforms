
//bodyParser middleware module for analyze the body of the entry request and expose in req.body.
//Allow handling data sent
import bodyParser from 'body-parser'

//compress middleware module used to compress HTTP responses sent by the express server
//Reduces the size of HTTP responses for clients.
import compress from 'compression'

//errorHandler middleware module used to handle error in express applications
//Catches unhandled errors during request processing and sends an appropiate error response to the client
import errorHandler from 'errorhandler'

//Request reprents the HTTP request that express app receives.
//Response represents the HTTP response that express send when receive an HTTP request.
//NextFunction used to define middleware functions and access or modified to req,res and next middleware functions
import express, {
  type Request,
  type Response,
  type NextFunction
} from 'express'

//Router allow support promises for route handlers
//Allow use asynchronous functions directly as route handlers without the manual promise handling like express-async-handler
//Simplifies writing asynchronous route handlers
import Router from 'express-promise-router'

//helmet middleware module used to enhance the security in express applications.
//Allow setting various HTTP headers related to security measures, protect the application against common security vulnerabilties
//When arrive any HTTP Request to the Node serve helmet is the first filter security used to manage this.
import helmet from 'helmet'

//import http from http module of node
import type * as http from 'http'

//http-status used to reference HTTP status codes in Node.js application
import httpStatus from 'http-status'

//Import registerRouters function in index.ts from /routes/ directory
//this function Automatically Registers all routes or registers routes defined in route modules within a directory
import { registerRoutes } from './routes'

/**
 * Server class: An HTTP server.
 *
 * @private readonly express    declares a private property express of type express.Aplication
 * @private readonly port       declares a private property port on which the server will listen for incoming requests
 * @private httpServer?         declares a private property httpServer of type http.Server, represent the HTTP server instance
 *                              ? indicates that the property is optional and can be undefined
 * 
 * readonly is used to declare properties in a class that can only be assigned a value during initialization or within the constructor
 * Once initialized, their values cann't be changed
*/
export class Server {
  private readonly express: express.Application
  private readonly port: string
  private httpServer?: http.Server

  /**
   * Constructor function creates a new HTTP server
   *
   * @param   port        The port to listen on.
   * @this    .port       Assigns the port parameter passed to the constructor to the port property of the class instance
   * @this    .express    inicializes the express property of the class instance with a new instance of Express application
  
   * @middleware  bodyParser.json()       Use the bodyParser.json() middleware to analyze the body of the incoming requests with JSON format.
   *                                      Allow to the server read the data in the body of a HTTP Request in JSON format.
   * 
   * @middleware bodyParser.urlencoded()  Use the bodyParser.urlencoded() middleware to to analyze the body incoming request with the data format.
   *                                      Extended parameter stablish in true to allow the analysis of nested objects in the data form.
   * 
   * @middleware  xssFilter               Use helmet.xssFilter() middleware to add the Header HTTP 'X-XSS-Protection'.
   *                                      Help to prevent scripting atacks (XSS) filtering requests that contain malicious scripts.
   * 
   * @middleware  noSniff                 Use helmet.noSniff() middleware to add the Header HTTP 'X-Content-Type-Options'.
   *                                      Help to prevent MIME sniffing atacks forzing that the Web Browser respect the type of content specific in the HTTP Responses.
   *  
   * @middleware  hidePoweredBy           Use helmet.hidePoweredBy() middleware to delete o replace the Header HTTP 'X-Powered-By'.
   *                                      Help to hide details over the server and reduce the exposition to potential vulnerabilities.
   *  
   * @middleware frameguard               Use helmet.frameguard() middleware to add HTTP 'X-Frame-Options'.
   *                                      Control if any Web Browser can charge the page content in a frame.
   *                                      The configuration deny that the Web Browser charge the page content in a frame.
   *                                      Protection against clickjacking atacks.
   * 
   * @function   express.use(compress)    Configure the content compression for the HTTP Responses.
   *                                      Compress the Response before sending to the client and help to improve the perfomance of the application.
   *                                      Reducing the size of the transferred data.
   * 
   * @const  router                       Creates a new instance of an Express router that will be used to hanlde the application's routes.
   * @function router.use(errorhandler)   Adds middleware to the router to handle errors.
   *                                      If an error ocurrs during the processing of a request in this router, the errorHandler() will be called to handle the error.
   * @function  this.express.use(router)  Mounts the router on the main express app.
   *                                      All the requests arriving at the application will be processed by the route.
   *                                      The router will handle directing the request to the apropiate controller based on the specified route.
   *@registerRoutes(router)          calls a function registerRoutes passing the router instance as an argument that registers routes on the router
   * @router.use(err,_req,res,_next)  adds error handling middleware to the router to handle any uncaught errors during request processing and sends an appropriate error response.
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
   * @this httpServer   starts the express app listening on the specified port. 
   *                    When the server starts successfully, the callback function provided to the listen method is executed
   * @console log       logs a message indicating that the MoocBackendApp is running, including the URL and the mod in which it's running
   *                    include a message for stop the MoocBackendApp (Ctrl-C)
   * @returns           A promise resolves using resolver() when the server has started.
   */
  async listen(): Promise<void> {
    await new Promise<void>((resolve) => {
      this.httpServer = this.express.listen(this.port, () => {
        console.log(
          `Backend App is running at http://localhost:${this.port} in ${
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
   * check if the httpServer is not null, ensuring that the server is running and needs to be stopped
   * if the server is running closes the server calling close() method and provides a callback function to handle any error that occur during the closing process
   * if an error ocurred the Promise is rejected with the error
   * ensure that the Promise always will be resolved using resolver()
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
