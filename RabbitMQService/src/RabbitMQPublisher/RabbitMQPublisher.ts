
import { DomainEvent } from '../../../domain/DomainEvent';

export class RabbitMQPublisher {
  constructor(private connection: RabbitMqConnection) {}

  async publish(event: DomainEvent, routingKey: string): Promise<void> {
    const exchange = 'simulation_exchange'; // Se puede parametrizar según sea necesario
    await this.connection.publish({
      exchange,
      routingKey,
      message: JSON.stringify(event), // Convertir el evento a JSON
    });
  }
}