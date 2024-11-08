
import { RabbitMQConfig } from '../RabbitMQConfig/RabbitMQConfigFactory';

import { DomainEventSubscribers } from '../../../../Contexts/Shared/infrastructure/EventBus/DomainEventSubscribers';

import { RabbitMQConfigurer } from '../RabbitMQConfig/RabbitMQConfigurer';

import { RabbitMqConnection } from '../RabbitMQConnection/RabbitMqConnection';

import { RabbitMQqueueFormatter } from '../RabbitMQFormatterNameQueue/RabbitMQqueueFormatter';

export class ConfigureRabbitMQCommand {

  static async run() {
    const connection = container.get<RabbitMqConnection>('Backoffice.Shared.RabbitMQConnection');

    const nameFormatter = container.get<RabbitMQqueueFormatter>('Backoffice.Shared.RabbitMQQueueFormatter');

    const { exchangeSettings, retryTtl } = container.get<RabbitMQConfig>('Backoffice.Shared.RabbitMQConfig');

    await connection.connect();

    const configurer = new RabbitMQConfigurer(connection, nameFormatter, retryTtl);

    const subscribers = DomainEventSubscribers.from(container).items;

    await configurer.configure({ exchange: exchangeSettings.name, subscribers });
    
    await connection.close();
  }
}
