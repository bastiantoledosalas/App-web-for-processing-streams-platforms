
//Request representa una SOLICITUD HTTP que la app express app recibe.
//Response representa una RESPUESTA HTTP que express ENVIA cuando recibe una SOLICITUD HTTP.
import { type Request, type Response } from 'express'

/**
 *  Controller:     Definición de una Interfaz para controladores.
 *                  Todas las clases que implementen esta interfaz deben poseer un método run() que reciba por parametro una req y res y devuelvan una promesa vacía
 * 
 * @function  run   Función que administra las SOLICITUDES HTTP y realiza operaciones asyncronas, además de correr los controladores a través de la función 'run'
 * @param     req   Representa un OBJETO SOLICITUD HTTP que representa un OBJETO SOLICITUD ENTRANTE provisto por algún framework web como EXPRESS JS.
 * @param     res   Representa un OBJETO RESPUESTA HTTP que representa un OBJETO RESPUESTA SALIENTE provisto por algún framework web como EXPRESS JS.
 * @return    void  Retorna una PROMESA que es RESUELTA en un valor 'void'.
 */
export interface Controller {
  run: (req: Request, res: Response) => Promise<void> | void
}
