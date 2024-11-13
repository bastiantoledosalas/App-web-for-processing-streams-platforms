
//Módulo middleware bodyParser utilizado para analizar el cuerpo de la solicitud de entrada y exponerlo en req.body.
//Permite manejar datos enviados
import bodyParser from 'body-parser'

//Módulo middleware compress utilizado para comprimir las respuestas HTTP enviadas por el servidor de express
//Reduce el tamaño de las respuestas HTTP para los clientes.
import compress from 'compression'

//Módulo middleware errorHandler utilizado para manejar errores en aplicaciones express
//Captura errores no manejados durante el procesamiento de la solicitud y envía una respuesta de error adecuada al cliente
import errorHandler from 'errorhandler'

//Request representa la solicitud HTTP que recibe la aplicación express.
//Response representa la respuesta HTTP que envía express al recibir una solicitud HTTP.
//NextFunction se usa para definir funciones middleware y acceder o modificar req, res y las siguientes funciones middleware
import express, {
  type Request,
  type Response,
  type NextFunction
} from 'express'

//Router permite el soporte de promesas para los controladores de rutas
//Permite usar funciones asíncronas directamente como controladores de rutas sin manejar manualmente las promesas, como con express-async-handler
//Simplifica la escritura de controladores de rutas asíncronas
import Router from 'express-promise-router'

//Módulo middleware helmet utilizado para mejorar la seguridad en aplicaciones express.
//Permite establecer varios encabezados HTTP relacionados con medidas de seguridad, protegiendo la aplicación contra vulnerabilidades de seguridad comunes
//Cuando llega cualquier solicitud HTTP al servidor de Node, helmet es el primer filtro de seguridad que se usa para manejar esto.
import helmet from 'helmet'

//Importa el módulo http de Node
import type * as http from 'http'

//http-status se usa para referenciar códigos de estado HTTP en una aplicación Node.js
import httpStatus from 'http-status'

//Importa la función registerRoutes en index.ts desde el directorio /routes/
//Esta función registra automáticamente todas las rutas o registra rutas definidas en los módulos de rutas dentro de un directorio
import { registerRoutes } from './routes'

/**
 * Server:    Representa un servidor HTTP
 * 
 * @prvivate    express     Representa una instancia de la aplicación de Express
 * @private     port        Representa el puerto en que el servidor escuchará las solicitudes entrantes
 * @private     httpServer  Representa la instancia del servidor HTTP una vez que se inicializa y comienza a escuchar solicitudes 
*/
export class Server {
  private readonly express: express.Application
  private readonly port: string
  private httpServer?: http.Server

  /**
   * 
   * @param port    Representa el puerto en que el servidor escuchará
   */
  constructor(port: string) {
    this.port = port
    // Se crea una nueva instancia de la aplicación Express y se asigna a la propiedad express de la clase server
    this.express = express()
    
    // Configura el middleware bodyParser para analizar solicitudes entrantes con datos JSON
    // Permite que req.body contenga el contenido del cuerpo de la solicitud en formato JSON
    this.express.use(bodyParser.json())
    
    // Configura bodyParser para analizar datos codificados en URL y extiende el soporte a objetos complejos
    this.express.use(bodyParser.urlencoded({ extended: true }))

    // Se añade un filtro de protección contra ataque Cross-Site Scripting usando helmet que proporciona múltiples capas de seguridad para Express
    this.express.use(helmet.xssFilter())
    
    // Previene ataques en lo que el navegador intenta adivinar el MIME type y agrega una capa adicional contra ataques de inyección
    this.express.use(helmet.noSniff())

    // Se oculta el encabezado que indica que el servidor utiliza Express, evitando revelar detalles de implementación
    this.express.use(helmet.hidePoweredBy())

    // Protege contra ataques de tipo clickjacking evitando que la aplicación se cargue dentro de iframes
    this.express.use(helmet.frameguard({ action: 'deny' }))

    // Se añade compression para comprimir las respuestas HTTP, mejorando el rendimiento del servidor
    this.express.use(compress())

    // Se Crea una instancia de Router para definir rutas de forma modular
    const router = Router()

    // Se agrega un middleware para manejar errores
    router.use(errorHandler())

    // Se asocia el router a la aplicación express, permitiendo manejar las rutas definidas
    this.express.use(router)

    // Se llama al método encargado de registrar las rutas de la aplicación utilizando el router
    registerRoutes(router)

    // Se define un middleware de manejo de errores en el router. Si ocurre un error en alguna de las rutas se ejecuta esta función
    router.use(
      (err: Error, _req: Request, res: Response, _next: NextFunction) => {

        // Se imprimire el error en la consola
        console.log(err)

        // Se realiza una respuesta con el codigo 500 de error interno del servidor
        res.status(httpStatus.INTERNAL_SERVER_ERROR).send(err.message)
      }
    )
  }

  /**
   * getHttpServer:   Método que devuelve la instancia del servidor HTTP almacenada en httpServer o undefined si el servidor no ha sido actualizado
   *
   * @returns         Retorna la instancia del servidor HTTP almacenada en httpServer
   */
  getHttpServer(): http.Server | undefined {
    return this.httpServer
  }

  /**
   * listen:            Método asincrono que inicia el servidor HTTP
   * 
   */

  async listen(): Promise<void> {

    // Se crea una promesa que se resuelve cuando servidor comienza a escuchar
    await new Promise<void>((resolve) => {

      // Se inicia el servidor HTTP en el puerto especificado
      this.httpServer = this.express.listen(this.port, () => {
        
        // Mensaje por consola indicando que el servidor se esta ejecutando en el modo (env)
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
   * stop:    Método asincrono para detener el servidor express
   */
  async stop(): Promise<void> {

    // Se crea una promesa que se resuelve cuando el servidor se detiene
    await new Promise<void>((resolve, reject) => {

      // Se verifica si el servidor HTTP está definido
      if (this.httpServer != null) {

        // Se realiza el cierre del servidor usando el método close con el parametro error que contiene un error que pudo haber ocurrido durante el proceso de cierre del servidor
        this.httpServer.close((error) => {
          
          // Se comprueba si hay algun error al cerrar el servidor
          if (error != null) {
            
            // Se llama al método reject con el error para rechazar la promesa asociada al método stop, indicando que el cierre no fue exitoso
            reject(error)

            // Se usa return para salir de la función, evitando que se ejecute el codigo del resolve() en caso de que ocurra un error
            return
          }

          // En caso de no haber ocurrido ningún error se ejecuta el método resolver, indicando que el cierre del servidor fue exitoso
          resolve()
        })
      }

      // Si el servidor no estaba en ejecución, se resuelve llamando al método resolve
      resolve()
    })
  }
}
