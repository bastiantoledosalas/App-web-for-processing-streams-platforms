
//Request representa un SOLICITUD HTTP que la app express recibe.
//Response representa una RESPUESTA HTTP RESPONSE que express envia cuando recibe una SOLICITUD HTTP.
import { type Request, type Response } from 'express'

//httpStatus del paquete http-status es utilizada para referenciar los CODIGOS DE ESTADO HTTP en Node JS o una aplicación Express.
import httpStatus from 'http-status'

// Se importa la interfaz de Controller que define el método run que debe ser utilizado por todos aquellos controladores que implementen esta interfaz
import { type Controller } from './Controller'

/**
 * run: Este método está diseñado para responder de manera rápida con un estado HTTP 200 (OK) a cualquier solicitud que reciba. 
 *      Útil para confirmaciones rápidas que el servidor esta operativo.
 *
 * La RESPUESTA o RES con codigo HTTP 200 indica que el servicio esta funcionando correctamente.
 * 
 * @implements {Controller} Importa la interfaz Controller y puede ser usada por la clase StatusGetController.
 * @param _req              Objeto de tipo REQUEST de Express. Representa una SOLICITUD HTTP ENTRANTE y  el prefijo '_' indica que este parametro no será usado en la función body
 * @param res               Objeto de tipo RESPONSE de Express. Representa una RESPUESTA HTTP SALIENTE
 * @function status()       Configura el ESTADO HTTP de la RESPUESTA del Objeto 'res' a '200 OK'
 * @variable httpStatus.OK  Contiene el codigo HTTP 200 e indica que la RESPUESTA fue EXITOSA.
 * @fucntion send()         Envia la RESPUESTA HTTP vacia o 'void' indicando que la SOLICITUD fue PROCESADA correctamente.           
 * @exports default         Exporta la clase StatuGetController para que esta pueda ser utilizada por otras clases de ser necesario.
 * 
 */
export default class StatusGetController implements Controller{
  run(_req: Request, res: Response): void {
    res.status(httpStatus.OK).send()
  }
}
