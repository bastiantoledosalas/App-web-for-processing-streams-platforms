//Este importe hace referencia a la interfaz encargada de definir la estructura que tiene la conexión de RabbitMQ
import { ConnectionSettings } from './ConnectionSettings';

//Este importe hace referencia a la interfaz que define la configuración del intercambio de mensajes en RabbitMQ
import { ExchangeSetting } from './ExchangeSetting';


//Este importe hace referencia al esquema de configuración para los servicios del backend
import config from '../config'

/**
 * RabbitMQConfig:    Se define la interfaz que contiene la estructura de la configuración para RabbitMQ
 */
export interface RabbitMQConfig {
  //  Se define la propiedad relacionada con la configuración de la conexión de RabbitMQ
  connectionSettings: ConnectionSettings
  //  Se define la propiedad relacionada con la configuración del intercambio de mensajes de RabbitMQ
  exchangeSettings: ExchangeSetting
  //  Se define la propiedad relacionada con el número maximo de reintentos permitidos para el reenvio de un mensaje fallido
  maxRetries: number
  //  Se define la propiedad relacionada con el tiempo de vida de los mensajes en la cola de reintentos de RabbitMQ
  retryTtl: number
}

/**
 * RabbitMQConfigFactory:   Esta clase fabrica define una forma de simplificar la forma de obtener la configuración de RabbitMQ
 */
export class RabbitMQConfigFactory {
  /**
   * createConfig:    Método encargado de devolver una configuración completa de RabbitMQ
   *                  La configuración se busca dentro de la variable config con la clave 'rabbitmq'
   * 
   * @returns         Se retorna la configuración de RabbitMQ contenida en la variable config
   */
  static createConfig(): RabbitMQConfig {
    //  Se llama al método get que toma los ajustes especificos de RabbitMQ desde el archivo index.ts
    //  get devuelve la configuración necesaria en forma de un objeto que cumple con la interfaz RabbitMQConfig
    return config.get('rabbitmq')
  }
}
