
//Request representa una SOLICITUD HTTP que la app express recibe.
//Response representa una RESPUESTA HTTP que express envía cuando recibe una SOLICITUD HTTP.
import { type Request, type Response } from 'express'

//http-status es utilizada para referenciar los codígos de ESTADO HTTP en una aplicación Node.js.
import httpStatus from 'http-status'

//Importando la Interfaz Controller.ts Interface desde el directorio /controllers/
import { type Controller } from './Controller'

//Importando la Interfaz  QueryBus.ts desde el directorio /Contexts/Shared/domain/
import { type QueryBus } from '../../../../Contexts/Shared/domain/QueryBus'

//Importando la Interfaz CommandBus.ts desde el directorio /Contexts/Shared/domain/
import { type CommandBus } from '../../../../Contexts/Shared/domain/CommandBus'

//Importando la clase UserLoginCommand.ts desde el directorio /Contexts/Mooc/Users/domain/
import { UserLoginCommand } from '../../../../Contexts/App/Users/domain/UserLoginCommand'

//Importando la clase FindUserTokenQuery.ts desde el directorio /Contexts/Mooc/UsersToken/application/Find/
import { FindUserTokenQuery } from '../../../../Contexts/App/UsersTokens/application/Find/FindUserTokenQuery'

//Importando la clase FindUserTokenResponse.ts desde el directorio /Contexts/Mooc/UsersTokens/application/Find/
import { type FindUserTokenResponse } from '../../../../Contexts/App/UsersTokens/application/Find/FindUserTokenResponse'

/**
 * 
 * @type  UserPostRequest Define un nuevo tipo llamado 'UserPostRequest' el cual extiende  la Interfaz Request de Express.js para incluir una propiedad body.
 *                        Añade una propiedad adicional 'body' al tipo 'Request' para contener un objeto con las propiedades email y password propias de un Usuario.
 *                        El proposito es crea un tipo que represente una SOLICITUD HTTP especifica (Solicitud POST para usuarios) donde se espera que el cuerpo
 *                        de la solicitud 'body' tenga una estructura especifica con las propiedades email y password de tipo string.
 **/

type UserPostRequest = Request & {
  body: {
    email: string
    password: string
  }
}

/**
 * Define constructor para'UserPostController': Recibe 2 parámetros como argumentos: commandBus de tipo 'CommandBus' y queryBus de tipo 'QueryBus'
 *                                              'private readonly' indica que estos parámetros se guardan como propiedades privadas de solo lectura para la instancia 'UserPostController'
 *                                              Por lo tanto no se pueden modificar después de la creación de dicha instancia.
 *                                              El constructor utiliza el patrón de inyección de dependencias para recibir 'commandBus' y 'queryBus' como dependencias.                           
 *                                                                   
 * @param commandBus  instance of CommandBus class
 * @param queryBus    instance of QueryBus class
 **/

export class UserPostController implements Controller {
  
  constructor(private readonly commandBus: CommandBus, private readonly queryBus: QueryBus) { 
  }
  

/**
 * Define el método run: Encargado de manejar una SOLICITUD HTTP para autenticar a un usuario y devolver un TOKEN DE ACCESO.
 *                       Recibe 2 parámetros com argumento: req es un objeto de tipo 'UserPostRequest' y res es un objeto 'Response' de Express que representa una Respuesta HTTP.
 *                       Este método devuelve una Promesa que se resuelve a 'void'.
 * 
 * Utilizamos el método try...catch para manejar excepciones y errores que puedan llegar a ocurrir durante la ejecución del método run().
 *   
 * @const     email,password    Utilizados para permitir extraer los parámetros email y password desde el req.body y asignarlos a dichas constantes con el mismo nombre.
 * @const     loginCommand      Crea una nueva INSTANCIA de 'UserLoginCommand' pasando las constantes email y password como argumentos.
 * @function  dispatch          Función utilizada para ENVIAR los comandos a su respectivo manejador o 'handler' para su ejecución, besides send the loginCommand to the command bus
 * @const     query             creates a new instance of FindUserTokenQuery passing the email as an argument to the constructor FindUserTokenQuery
 * @const     token             
 **/ 

  async run(req: UserPostRequest, res: Response): Promise<void> {
    try {
      const { email, password } = req.body
      const loginCommand = new UserLoginCommand({email,password})
      await this.commandBus.dispatch(loginCommand)
      const query = new FindUserTokenQuery(email)
      const { token } = await this.queryBus.ask<FindUserTokenResponse>(query)
      res.status(httpStatus.OK).json({
        data: {
          token
        },
        ok: true
      })
    } catch (error) {
      console.log(error)
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send()
    }
  }
}
