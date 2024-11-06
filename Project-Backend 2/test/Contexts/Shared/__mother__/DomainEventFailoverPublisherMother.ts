import { DomainEventFailoverPublisher } from '../../../../src/Contexts/Shared/infrastructure/EventBus/DomainEventFailoverPublisher/DomainEventFailoverPublisher'
import { DomainEventFailoverPublisherDouble } from '../__mocks__/DomainEventFailoverPublisherDouble'
import { DomainEventDeserializerMother } from './DomainEventDeserializerMother'
import { RabbitMQMongoClientMother } from './RabbitMQMongoClientMother'

export class DomainEventFailoverPublisherMother {
  static create(): DomainEventFailoverPublisher {
    const mongoClient = RabbitMQMongoClientMother.create()
    return new DomainEventFailoverPublisher(
      mongoClient,
      DomainEventDeserializerMother.create()
    )
  }

  static failOverDouble(): DomainEventFailoverPublisherDouble {
    return new DomainEventFailoverPublisherDouble()
  }
}
