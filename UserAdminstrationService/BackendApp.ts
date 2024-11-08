
//import http module like alias type in Typescript
//Permit use the defined types in the http module inside the typescript without import the module in execution time
import type * as http from 'http'

//Importing Eventus.ts Inteface from /Contexts/Shared/domain/ directory
import { type EventBus } from '../../../Contexts/Shared/domain/EventBus'

//Importing container in index.ts from /dependency-injection/ directory
import container from './dependency-injection'

//Importing Server.ts from /backend/ directory
import { Server } from './server'

//Importing DomainEventSubscribers.ts from /Contexts/Shared/infrastructure/EventBus/ directory
//This class is responsible for finding all the domain event subscribers
import { DomainEventSubscribers } from '../../../Contexts/Shared/infrastructure/EventBus/DomainEventSubscribers'

//Importing RabbitMQConnection.ts from /Contexts/Shared/infrastructure/EventBus/RabbitMQ/ directory
//This class is the connection to RabbitMQ
import { type RabbitMQConnection } from '../../../Contexts/Shared/infrastructure/EventBus/RabbitMQ/RabbitMQConnection'

/**
 * The Mooc Backend App.
 *
 * @function start Starts the app.
 * @function stop Stops the app.
 */
export class BackendApp {
  server?: Server


  /**
 * getter method used to get the server HTTP asociate a instance of the server class
 * if server value is null or undenfined then returns undefined
 * else call the getHttpServer function to get the server Httpp.
 */
  get httpServer(): http.Server | undefined {
    return this.server?.getHttpServer()
  }

  /**
   * start the HTTP server of the app.
   * 
   * @function start                async function that return a promise that will be resolve with void value.
   * @const port                    inicialize port variable with process.env.PORT value, if process.env.Port variable isn't defined assign 5000 as predefined value.
   * @this server                   Create a new Instance of class Server that represent the HTTP server
   * @await this.configureEventBus  wait for complete the execution of configureEventBus method, configureEventBus configurate a event bus for the app.
   * @await this.server.listen      wait that the HTTP server begin to listen the entry request, listen() method return a promise that been resolve when the server is ready to accept conections
   * @returns                       A promise that resolves when the app has started.
   */
  async start(): Promise<void> {
    const port = process.env.PORT ?? '5000'
    this.server = new Server(port)
    await this.configureEventBus()
    await this.server.listen()
  }

  /**
   * Stops the app.
   *
   * @const rabbitMQConnection  get a instance of RabbitMQConnection from the container of dependencies located in dependency-injection/Shared/application.json file
   * @await rabbitMQConnection  wait for the RabbitMQConnection to close using close() method
   * @await this.server         The HTTP server is stopped and prevents erros if this.server isn't null or undefined.
   * @operator ?                Used to guarantee that the call to stop() just be realize if this.server isn't null or undefined
   * @returns                   A promise that resolves when the app has stopped.
   */
  async stop(): Promise<void> {
    const rabbitMQConnection = container.get<RabbitMQConnection>(
      'Shared.RabbitMQConnection'
    )
    await rabbitMQConnection.close()
    await this.server?.stop()
  }

  /**
   * Initializes the event bus by obtaining necessary dependencies from the container
   * Connecting to RabbitMQ and adding suscribers to the event bus to handle domain events
   * 
   * @const eventBus            retrieves an instance of EventBus that is responsible for managing event-related operations
   *                            the instance of EventBus is obtaining from the container of dependencies located in dependency-injection/Shared/application.json file
   * @const rabbitMQConnection  obtain a instance of RabbitMQConnection from the container of dependencies located in dependency-injection/Shared/application.json file
   * @await rabbitMQConnection  connects to the RabbitMQ server using the connect() method of rabbitMQConnection instance
   * @function addSubscribers   suscribers are added to the event bus to handle domain events
   * @function container.get<RabbitMQConnection>('Mooc.Shared.RabbitMQConnection') obtain an instance of the service RabbitMQConnection.
   * @function DomainEventSubscribers.from(container) take the container DI as argument and extract the event suscribers domain from the container 
   */
  private async configureEventBus(): Promise<void> {
    const eventBus = container.get<EventBus>('App.Shared.domain.EventBus')
    const rabbitMQConnection = container.get<RabbitMQConnection>('Shared.RabbitMQConnection')
    await rabbitMQConnection.connect()
    eventBus.addSubscribers(DomainEventSubscribers.from(container))
  }
}
