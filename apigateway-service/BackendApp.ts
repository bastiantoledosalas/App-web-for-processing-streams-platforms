
//Se importa el módulo http como un tipo en TypeScript
//Permite usar los tipos definidos en el módulo http dentro de TypeScript sin importar el módulo en tiempo de ejecución
import type * as http from 'http'

//Se importa la interfaz que contiene el Bus de Eventos
import { type EventBus } from '../../../Contexts/Shared/domain/EventBus'

//Se importa el contenedor de inyección de dependencias
import container from './dependency-injection'

//Se importa la clase server que representa un servidor HTTP
import { Server } from './server'

//Se importa la clase DomainEventSubscribers responsable de encontrar todos los suscriptores de eventos de dominio
import { DomainEventSubscribers } from '../../../Contexts/Shared/infrastructure/EventBus/DomainEventSubscribers'

//Se importa la clase RabbitMQConnection responsable de realizar la conexión hacia RabbitMQ
import { type RabbitMQConnection } from '../../../Contexts/Shared/infrastructure/EventBus/RabbitMQ/RabbitMQConnection'

/**
 * BackendApp:      Clase responsable de manejar el servidor http
*/
export class BackendApp {
  
  // Propiedad opcional que contiene la instancia del servidor HTTP
  server?: Server

  /**
   * get httpServer:  Método utilizado para obtener el servidor HTTP asociado a una instancia de la clase server
   * 
   * @returns:        Se retorna el servidor HTTP en caso de existir y undefined en caso de no existir  
   */
  get httpServer(): http.Server | undefined {
    return this.server?.getHttpServer()
  }

  /**
   * start:     Método asincrono utilizado para iniciar el servidor HTTP de la aplicación
   * 
   * @return Promise<void>  Se retorna una promesa que se resuelve cuando la aplicación backend ha sido completamente iniciada
   */
  async start(): Promise<void> {

    // Se determina en que puerto se ejecutará el servidor
    // process.env.PORT intenta obtener el valor del puerto definido en las variables de entorno del sistema
    const port = process.env.PORT ?? '5000'

    // Se crea una nueva instancia de server pasandole el valor del puerto al constructor
    this.server = new Server(port)

    // Se llama al método configureEventBus para configurar el bus de eventos de la aplicación que maneja la conexión con RabbitMQ y agrega suscriptores de eventos de dominio
    await this.configureEventBus()

    // Se llama al método listen para que el servidor comience a escuchar solicitudes de entrada en el puerto definido
    await this.server.listen()
  }

  /**
   * stop:      Método asincrono responsable de devolver una promesa que se resuelve cuando la aplicación se ha detenido por completo         
   * 
   * @returns Promise<void>   Una promesa que se resuelve cuando la aplicación es detenida por completo
   */
  async stop(): Promise<void> {

    // Se obtiene una instancia de RabbitMQConnection desde el contenedor de dependencias, almacena y gestiona instancias compartidas en la aplicación
    const rabbitMQConnection = container.get<RabbitMQConnection>(
      'Shared.RabbitMQConnection'
    )

    // Se llama al método close de la instancia de RabbitMQConnection para cerrar la conexión con el servidor RabbitMQ
    await rabbitMQConnection.close()

    // Se llama al método stop para realizar el cierre del servidor HTTP si es que este existe
    await this.server?.stop()
  }

  /**
   * configureEventBus:   Método asincrono responsable de inicializar el bus de eventos para obtener las dependencias necesarias del contenedor
   *                      Conectandose a RabbitMQ y agregando suscriptores al bus de eventos para manejar eventos de dominio en el sistema
   */
  private async configureEventBus(): Promise<void> {

    // Se obtiene una instancia del bus de eventos del contenedor de dependencias
    const eventBus = container.get<EventBus>('App.Shared.domain.EventBus')

    // Se obtiene una instancia de RabbitMQConnection desde el contenedor de dependencias
    const rabbitMQConnection = container.get<RabbitMQConnection>('Shared.RabbitMQConnection')

    // Se establece una conexión al servidor de RabbitMQ para poder interactuar con las colas de mensajes
    await rabbitMQConnection.connect()

    // Se llama al método from para obtener todos los suscriptores de eventos de dominio desde el contenedor de dependencias
    // Se llama al método addSubscribers para agregar los suscriptores de eventos al bus de eventos, permitiendo que la aplicación responda a los eventos del dominio
    eventBus.addSubscribers(DomainEventSubscribers.from(container))
  }
}
