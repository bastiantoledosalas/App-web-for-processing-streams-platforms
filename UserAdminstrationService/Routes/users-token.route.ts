
// Se importa Router para la creación de controladores de rutas modulares y montables
// Se importa Request para representar la solicitud HTTP que recibe la aplicación Express
// Se importa Response para representar la respuesta HTTP que Express envía al recibir una solicitud HTTP
import { type Request, type Response, type Router } from 'express'

// Se importa body para realizar validaciones en los parámetros del cuerpo de las solicitudes HTTP
import { body } from 'express-validator'

// Se importa el método validateReqSchema encargado de validar el esquema de la solicitud utilizando reglas definidas previamente
import { validateReqSchema } from './index'

//Importando el contenedor de dependencias 'container' ubicado en la clase index.ts desde el directorio /dependency-injection/
//Este contenedor se utiliza para gestionar las instancias de los controladores y otros servicios de la aplicación
import container from '../dependency-injection'

/**
 * register:        Método que define las reglas de validación asegurando que cualquier solicitud HTTP contenga email y password
 * 
 * @param router    Se utiliza para definir rutas de manera modular y manejarlas en aplicaciones Express
 */
export const register = (router: Router): void => {

  // Se declara un Array que contiene reglas de validación para aplicar sobre el cuerpo de las solicitudes HTTP recibidas por las rutas configuradas
  const reqSchema = [

    // Se valida que dentro del cuerpo de la solicitud HTTP exista la propiedad email y se verifica que este valor cumpla con el formato estandar de un correo electronico
    body('email').exists().isEmail(),

    // Se valida que dentro del cuerpo de la solicitud HTTP exista la propiedad password y se verifica que este valor sea de tipo string
    body('password').exists().isString()
  ]

  // Se devuelve una instancia de UserPostController desde el contenedor de inyección de dependencias
  const userPostController = container.get('controllers.UserPostController')

  /**
   * router.post:       Se define la ruta POST utilizada para manejar solicitudes HTTP POST dirigidas al servidor
   * 
   * @param '/auth/login'       Se define el endpoint donde las solicitudes enviadas a esta ruta seran manejadas por userPostController
   * @param reqSchema           Esquema de validación para el cuerpo de la solicitud HTTP contenga las propiedades email y password
   * @param validateReqSchema   Método encargado de validar y procesar el resultado de la validación hecha por express-validatorr, permite que la solicitud sea manejada por un controlador especifico
   * @callback  (req,res)       Controlador final que maneja la solicitud y llama al controlador userPostController pasando el objeto req y res como parametros
   *                            userPostController maneja las solicitudes de inicio de sesión      
   */
  router.post('/auth/login', reqSchema, validateReqSchema, (req: Request, res: Response) => userPostController.run(req, res) )
}
