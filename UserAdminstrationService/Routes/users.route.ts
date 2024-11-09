
// Se importa Router para la creación de controladores de rutas modulares y montables
// Se importa Request para representar la solicitud HTTP que recibe la aplicación Express
// Se importa Response para representar la respuesta HTTP que Express envía al recibir una solicitud HTTP
import { type Request, type Response, type Router } from 'express'

// Se importa body para realizar validaciones en los parámetros del cuerpo de las solicitudes HTTP
import { body } from 'express-validator'

// Se importa el método validateReqSchema encargado de validar el esquema de la solicitud utilizando reglas definidas previamente
import { validateReqSchema } from './index'

// Se importa el contenedor responsable de manejar la inyección de dependencias
import container from '../dependency-injection'


/**
 * register:        Método encargado de de definir y registrar una ruta para actualizar usuarios, valida y verifica que los datos sean correctos
 *                  Además se delega la lógica al controlador encargado de maneja la solicitud       
 * 
 * @param router    Utilizado para definir y manejar rutas de manera modular
 */
export const register = (router: Router): void => {

  // Se define un arreglo que contiene las validaciones para los campos dentro del cuerpo de una solicitud
  const reqSchema = [

    // Se selecciona la propiedad id del cuerpo de la solicitud y se verifica si esta propiedad se encuentre presente en el cuerpo de la solicitud
    body('id').exists().isString(),

    // Se selecciona la propiedad firstName del cuerpo de la solicitud y se verifica si esta propiedad se encuentre presente en el cuerpo de la solicitud
    body('firstName').exists().isString(),

    // Se selecciona la propiedad lastName del cuerpo de la solicitud y se verifica si esta propiedad se encuentra presente en el cuerpo de la solicitud
    body('lastName').exists().isString(),

    // Se selecciona la propiedad email del cuerpo de la solicitud y ser verifica si esta propiedad se encuentra presente en el cuerpo de la solicitud
    // Se utiliza el método isEmail para validar que este valor siga el formato estándar de un correo electrónico (alfanumerico, seguido del simbolo @ y un dominio válido)
    body('email').exists().isEmail(),

    // Se selecciona la propiedad password del cuerpo de la solicitud y ser verifica si esta propiedad se encuentra presente en el cuerpo de la solicitud
    body('password').exists().isString(),

    // Se selecciona la propiedad repeatPassword del cuerpo de la solicitud y se verifica si esta propiedad se encuentra presente en el cuerpo de la solicitud
    // Se llama al método custom que recibe value (valor de repeatPassword) y req (solicitud HTTP completa)
    // custom verifica que repeatPassword sea igual al valor de password dentro del cuerpo de la solicitud HTTP
    body('repeatPassword').exists().isString().custom((value, { req }) => {

        // Si los valores de repeatPassword y password son iguales se retorna value, en caso de no coincidir se genera un error de validación
        return value === req.body.password
      })
  ]

  // Se devuelve una instancia de UserPutController desde el contenedor de inyección de dependencias
  const userPutController = container.get('controllers.UserPutController')

  /**
   * router.put:    Método PUT del objeto router proporcionado por Express para definir y manejar solicitudes de actualización de usuarios
   * 
   * @param '/users/:id'        Se define el endpoint donde id representa el identificador del usuario que se quiere actualiza y será extraido de la URL de la solicitud HTTP (req.params.id)
   * @param reqSchema           Esquema de validación para el cuerpo de la solicitud HTTP, asegurandose que en el cuerpo de la solicitud HTTP los datos sean validos y cumplan el formato 
   * @param validateReqSchema   Método encargado de validar y procesar el resultado de la validación hecha por express-validatorr, permite que la solicitud sea manejada por un controlador especifico
   * @callback  (req,res)       Controlador final que maneja la solicitud y llama al controlador userPutController pasando el objeto req y res como parametros
   *                            userPutController se encarga de maneja la solicitud de actualización de datos de un usuario especifico      
   */
  router.put('/users/:id', reqSchema, validateReqSchema, (req: Request, res: Response) => userPutController.run(req, res) )
  router.get('/users', reqSchema, validateReqSchema, (req:Request, res:Response) => userGetController.run(req,res))
}

