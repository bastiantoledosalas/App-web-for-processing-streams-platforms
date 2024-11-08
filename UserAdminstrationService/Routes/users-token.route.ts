
//Router utilizado para crear manejadores de rutas montables y modulares
//Request representa una SOLICITUD HTTP que la aplicación de Express recibe
//Response representa una RESPUESTA HTTP que la aplicación Express envia cuando recibe una SOLICITUD HTTP

import { type Request, type Response, type Router } from 'express'

//body es utilizado para definir cadenas de validación para solicitudes de parametros del body en rutas de Express
import { body } from 'express-validator'

//Importando la función validateReqSchema de la clase index.ts desde el directorio /routes
import { validateReqSchema } from '.'

//Importando el contenedor de dependencias 'container' ubicado en la clase index.ts desde el directorio /dependency-injection/
//Este contenedor se utiliza para gestionar las instancias de los controladores y otros servicios de la aplicación
import container from '../dependency-injection'

/**
 * register: Función utilizada para 
 * Defines a requestSchema (reqSchema) for the validation rules for request body parameters
 * 
 * 
 * 
*/ 
export const register = (router: Router): void => {
  const reqSchema = [
    body('email').exists().isEmail(),
    body('password').exists().isString()
  ]

/**
 * Register a POST route for handling user authentication login request or /auth/login route.
 * 
 * @const userPostController Esta instancia de controlador es utilizada para manejar la logica de una autenticación de usuario
 * Apps.mooc.controllers.UserPostController es utilizada como identificador para localizar la clase UserPostcontroller en el directorio /dependency-injection/apps/
 */ 
  const userPostController = container.get('controllers.UserPostController')

  
/**
 * POST method is used for send or agreggate a new users.
 * router.post: Registers a POST route handler for /auth/login endpoint
 * Besides to use the reqSchema Array to validate the request body parameters with validateReqSchema function
 * Delegated the handling of the request to run method in userPostController.ts locate in controllers directory
 */

  router.post(
    '/auth/login',
    reqSchema,
    validateReqSchema,
    (req: Request, res: Response) => userPostController.run(req, res)
  )
}
