//index.ts (master class for express.Router)
//import specific types from express library

// NextFunction used to define middleware functions and access or modified to req,res and next middleware functions
// Se importa Router para la creación de controladores de rutas modulares y montables
// Se importa Request para representar la solicitud HTTP que recibe la aplicación Express
// Se importa Response para representar la respuesta HTTP que Express envía al recibir una solicitud HTTP
import { type NextFunction, type Router, type Request, type Response } from 'express'

// Se importa el método validationResult para revisar si las validaciones de parámetros de las solicitudes HTTP han fallado o no
import { validationResult } from 'express-validator'

// Se importa globSync para realizar la carga de las rutas dinámicamente desde los archivos en el sistema de archivos del contenedor del servicio
import { globSync } from 'glob'

// Se importa el módulo httpStatus para el retorno del codigo de error cuando las validaciones no son correctas
import httpStatus from 'http-status'

// Se importa el módulo path para el manejo de rutas de archivos de forma segura y compatible entre sistemas operativos
import path from 'path'

/**
 * register:        Método encargado de cargar rutas de manera dinámica y registrarlas en el enrutador de Express
 * 
 * @param routePath   Ruta del archivo de ruta que se desea cargar
 * @param router      Instancia del enrutador de Express
 */
async function register(routePath: string, router: Router): Promise<void> {

  // El import(routePath) permite cargar el módulo dinamicamente en tiempo de ejecución en la ruta especificada por routePath
  const route = await import(routePath)
  
  // Se registra la ruta definida en el enrutador de Express
  route.register(router)
}

/**
 * registerRoutes:  Método responsable de realizar la busqueda de clases que manejejn rutas especificas y se encarga de ejecutar la función register de cada una de estas
 *                  pasando la instancia del router para que registre las rutas en la app de Express
 * 
 * @param router    Instancia del enrutador de Express
 */
export function registerRoutes(router: Router): void {

  // Se obtiene la lista de archivos que coincidan con el patrón .route
  // __dirname es la variable especial de Node que referencia el directorio donde se encuentra la clase que se esta ejecutando (index.ts)
  const routes = globSync(path.join(__dirname, '**/*.route.*'))

  // Se recorre cada ruta de archivo presente en la lista routes que ha sido encontrada utilizando la variable route
  routes.forEach((route) => {

    // Se ejecuta el método register de cada una de las clases .route encontradas
    void register(route, router)
  })
}

/**
 * validateReqSchema:   Método utilizado para validar la entrada de solicitudes HTTP antes de realizar la ejecución de controladores para estas
 *                      Se verifica si los datos enviados en la solicitud HTTP cumplen con los criterios de validación definidos
 *                      Si falla la validación se retorna un error con los detalles
 * 
 * @param req     Objeto de solicitud que contiene los datos enviados por el cliente 
 * @param res     Objeto de respuesta que se usa para enviar una respuesta al cliente
 * @param next    Método utilizado para pasar el controlor a un controlador o middleware
 * @returns       No se retorna nada
 */
export function validateReqSchema( req: Request, res: Response, next: NextFunction ): undefined {

  // Se hace el llamado al método validationResult para verificar si los datos en la solicitud cumplen con las reglas de validación definidas
  const validationErrors = validationResult(req)

  // Si la validación se realiza correctamente y los datos cumplen con las reglas de validación se llama al método next para pasar el control al middleware o controlador de la ruta
  if (validationErrors.isEmpty()) {
    next()
    
    // Se detiene la función y no se ejecuta el resto de codigo
    return
  }
  
  // Se llama al método mapped para convertir los errores de validación en un formato estructurado, donde las claves son los nombres de los campos que fallaron la validación y valores
  const errors = validationErrors.mapped()

  // Al encontrarse errores de validación de la solicitud HTTP se establace el codigo de estado de la respuesta HTTP a 422  Unprocessable Entity usando el módulo http-status
  // Se envia la respuesta JSON con los detalles de los errores de validación
  res.status(httpStatus.UNPROCESSABLE_ENTITY).json({ errors })
}
