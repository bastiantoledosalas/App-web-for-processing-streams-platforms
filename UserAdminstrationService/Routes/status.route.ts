
//Router es utilizado para definir manejadores 'handlers' de rutas modulares y montables en Express.
//Request representa una SOLICITUD HTTP en Express.
//Response representa una RESPUESTA HTTP en Express que es enviada cuando se recibe una SOLICITUD HTTP.
import { type Router, type Request, type Response } from 'express'

//Importando la clase StatusGetController.ts desde el directorio /controllers/
//Este controlador maneja la lógica para la ruta de estado o 'status'
import type StatusGetController from '../controllers/StatusGetController'

//Importando el contenedor de dependencias 'container' ubicado en la clase index.ts desde el directorio /dependency-injection/
//Este contenedor se utiliza para gestionar las instancias de los controladores y otros servicios de la aplicación
import container from '../dependency-injection'

/**register: Función implementada para registrar un manejador de ruta (clase StatusGetController) para una SOLICITUD GET a la ruta '/status'
 * 
 * Respuesta con codigo HTTP 200 es utilizada para indicar que el servidor se encuentra funcionando correctamente
 * 
 * @const controller  Especifica su tipo como StatusGetController
 * @param router      Enrutador al que se registrará la ruta
 * @const container   Contenedor de dependencias utilizado para gestionar las instancias de los controladores y otros servicios de la aplicación
 * @returns           El retorno de la función register es vacío (void).
 * 
 * Apps.mooc.controllers.StatusGetController es utilizada para identificar el controlador que debe obtener
 */
export const register = (router: Router): void => {
  const controller: StatusGetController = container.get('controllers.StatusGetController')

/**
 * router.get:  Función encargada de registrar un manejador de ruta para las SOLICITUDES GET a la ruta '/status'
 *              Cuando se realiza una Solicitud GET a la ruta o endpoint /status, la función del enrutador encargado de manejar dicha solicitud es ejecutado
 * Delegated the handling of the request to run method in StatusGetController.ts locate in controllers directory
 * This execute a res.status(httpStatus.OK).send()
 */
  router.get('/status', (req: Request, res: Response) => {
    controller.run(req, res)
  })
}
