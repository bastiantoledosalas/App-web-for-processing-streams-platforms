import { type DomainEvent } from '../../../../src/Contexts/Shared/domain/DomainEvent'
import { DomainEventFailoverPublisher } from '../../../../src/Contexts/Shared/infrastructure/EventBus/DomainEventFailoverPublisher/DomainEventFailoverPublisher'
import { DomainEventDeserializerMother } from '../__mother__/DomainEventDeserializerMother'
import { RabbitMQMongoClientMother } from '../__mother__/RabbitMQMongoClientMother'

export class DomainEventFailoverPublisherDouble extends DomainEventFailoverPublisher {
  private readonly publishMock: jest.Mock

  constructor() {
    super(
      RabbitMQMongoClientMother.create(),
      DomainEventDeserializerMother.create()
    )
    this.publishMock = jest.fn()
  }

  async publish(event: DomainEvent): Promise<void> {
    this.publishMock(event)
  }

  assertEventHasBeenPublished(event: DomainEvent): void {
    expect(this.publishMock).toHaveBeenCalledWith(event)
  }
}
