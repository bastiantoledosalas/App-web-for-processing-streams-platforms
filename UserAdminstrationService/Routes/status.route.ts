
// Se importa Router para la creación de controladores de rutas modulares y montables
// Se importa Request para representar la solicitud HTTP que recibe la aplicación Express
// Se importa Response para representar la respuesta HTTP que Express envía al recibir una solicitud HTTP
import { type Router, type Request, type Response } from 'express'

// Se importa el controlador encargado de manejar la lógica para la ruta de estado 'status'
import type StatusGetController from '../controllers/StatusGetController'

// Se importa el contenedor responsable de manejar la inyección de dependencias
import container from '../dependency-injection'

/**
 * register:    Método encargado de definir una nueva ruta modular para el servidor HTTP de Express      
 * 
 * @param router    Se utiliza para definir rutas de manera modular y manejarlas en aplicaciones Express
 */
export const register = (router: Router): void => {

  // Se devuelve una instancia de controller que debe ser de tipo StatusGetController desde el contenedor de inyección de dependencias
  const controller: StatusGetController = container.get('controllers.StatusGetController')

  /**
   * router.get:      Se define la ruta GET utilizada para manejar solicitudes HTTP GET dirigidas al servidor para conocer el estado de este
   * 
   * @callback (req,res)  Se llama al controlador encargado de manejar la solicitud HTTP GET con la ruta '/status' consultando por el estado del servidor express
   *                      El controlador StatusGetController es el encargado de manejar y resolver esta solicitud HTTP GET        
   */
  router.get('/status', (req: Request, res: Response) => {controller.run(req, res)} )
}
