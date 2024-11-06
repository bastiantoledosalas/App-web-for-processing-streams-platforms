import { RabbitMQEventBus } from '../../../../../src/Contexts/Shared/infrastructure/EventBus/RabbitMQ/RabbitMQEventBus'
import { type RabbitMQConnection } from '../../../../../src/Contexts/Shared/infrastructure/EventBus/RabbitMQ/RabbitMQConnection'
import { UserCreatedDomainEventMother } from '../../../Mooc/Users/domain/UserCreatedDomainEventMother'
import { RabbitMQMongoClientMother } from '../../__mother__/RabbitMQMongoClientMother'
import { MongoEnvironmentArranger } from '../mongo/MongoEnvironmentArranger'
import { RabbitMQConnectionMother } from '../../__mother__/RabbitMQConnectionMother'
import { DomainEventFailoverPublisherMother } from '../../__mother__/DomainEventFailoverPublisherMother'
import { UuidMother } from '../../domain/UuidMother'
import { type DomainEventFailoverPublisher } from '../../../../../src/Contexts/Shared/infrastructure/EventBus/DomainEventFailoverPublisher/DomainEventFailoverPublisher'
import { RabbitMQConfigurer } from '../../../../../src/Contexts/Shared/infrastructure/EventBus/RabbitMQ/RabbitMQConfigurer'
import { RabbitMQqueueFormatter } from '../../../../../src/Contexts/Shared/infrastructure/EventBus/RabbitMQ/RabbitMQqueueFormatter'
import { DomainEventDummyMother } from '../../__mocks__/DomainEventDummy'
import { DomainEventSubscriberDummy } from '../../__mocks__/DomainEventSubscriberDummy'
import { DomainEventSubscribers } from '../../../../../src/Contexts/Shared/infrastructure/EventBus/DomainEventSubscribers'
import { DomainEventDeserializer } from '../../../../../src/Contexts/Shared/infrastructure/EventBus/DomainEventDeserializer'
import { type DomainEvent } from '../../../../../src/Contexts/Shared/domain/DomainEvent'
import { RabbitMQConsumerFactory } from '../../../../../src/Contexts/Shared/infrastructure/EventBus/RabbitMQ/RabbitMQConsumerFactory'

const event = UserCreatedDomainEventMother.create({
  aggregateId: UuidMother.random(),
  eventId: UuidMother.random(),
  occurredOn: new Date(),
  firstName: 'test',
  lastName: 'test',
  email: 'test@test.com'
})

describe('RabbitMQEventBus test', () => {
  const exchange = 'test_domain_events'
  let arranger: MongoEnvironmentArranger
  const queueNameFormatter = new RabbitMQqueueFormatter('mooc')

  beforeAll(async () => {
    arranger = new MongoEnvironmentArranger(RabbitMQMongoClientMother.create())
  })

  beforeEach(async () => {
    await arranger.arrange()
  })

  afterAll(async () => {
    await arranger.close()
  })

  describe('unit', () => {
    it('should use the failover publisher if publish to RabbitMQ fails', async () => {
      const connection = RabbitMQConnectionMother.failOnPublish()
      const failoverPublisher =
        DomainEventFailoverPublisherMother.failOverDouble()
      const eventBus = new RabbitMQEventBus({
        failoverPublisher,
        connection,
        exchange,
        queueNameFormatter,
        maxRetries: 3
      })
      await eventBus.publish([event])
      failoverPublisher.assertEventHasBeenPublished(event)
    })
  })

  describe('integration', () => {
    let connection: RabbitMQConnection
    let dummySubscriber: DomainEventSubscriberDummy
    let configurer: RabbitMQConfigurer
    let failoverPublisher: DomainEventFailoverPublisher
    let subscribers: DomainEventSubscribers

    beforeEach(async () => {
      connection = await RabbitMQConnectionMother.create()
      failoverPublisher = DomainEventFailoverPublisherMother.create()
      configurer = new RabbitMQConfigurer(connection, queueNameFormatter, 50)
      await arranger.arrange()
      dummySubscriber = new DomainEventSubscriberDummy()
      subscribers = new DomainEventSubscribers([dummySubscriber])
    })

    afterEach(async () => {
      await cleanEnvironment()
      await connection.close()
    })

    afterAll(async () => {
      await arranger.close()
    })

    it('should consume the events published to RabbitMQ', async () => {
      await configurer.configure({ exchange, subscribers: [dummySubscriber] })
      const eventBus = new RabbitMQEventBus({
        failoverPublisher,
        connection,
        exchange,
        queueNameFormatter,
        maxRetries: 3
      })
      await eventBus.addSubscribers(subscribers)
      const event = DomainEventDummyMother.random()

      await eventBus.publish([event])
      await dummySubscriber.assertConsumedEvents([event])
    })

    it('should retry failed domain events', async () => {
      dummySubscriber = DomainEventSubscriberDummy.failsFirstTime()
      subscribers = new DomainEventSubscribers([dummySubscriber])
      await configurer.configure({ exchange, subscribers: [dummySubscriber] })
      const eventBus = new RabbitMQEventBus({
        failoverPublisher,
        connection,
        exchange,
        queueNameFormatter,
        maxRetries: 3
      })
      await eventBus.addSubscribers(subscribers)
      const event = DomainEventDummyMother.random()
      await eventBus.publish([event])
      await dummySubscriber.assertConsumedEvents([event])
    })

    it('it should send events to dead letter after retry failer', async () => {
      dummySubscriber = DomainEventSubscriberDummy.alwaysFails()
      subscribers = new DomainEventSubscribers([dummySubscriber])
      await configurer.configure({ exchange, subscribers: [dummySubscriber] })
      const eventBus = new RabbitMQEventBus({
        failoverPublisher,
        connection,
        exchange,
        queueNameFormatter,
        maxRetries: 3
      })
      await eventBus.addSubscribers(subscribers)
      const event = DomainEventDummyMother.random()
      await eventBus.publish([event])
      await dummySubscriber.assertConsumedEvents([])
      await assertDeadLetter([event])
    })

    async function cleanEnvironment(): Promise<void> {
      await connection.deleteQueue(queueNameFormatter.format(dummySubscriber))
      await connection.deleteQueue(
        queueNameFormatter.formatRetry(dummySubscriber)
      )
      await connection.deleteQueue(
        queueNameFormatter.formatDeadLetter(dummySubscriber)
      )
    }

    async function assertDeadLetter(events: DomainEvent[]): Promise<void> {
      await connection.close()
      connection = await RabbitMQConnectionMother.create()
      const deadLetterQueue =
        queueNameFormatter.formatDeadLetter(dummySubscriber)
      const deadLetterSubscriber = new DomainEventSubscriberDummy()
      const deadLetterSubscribers = new DomainEventSubscribers([
        dummySubscriber
      ])
      const deserializer = DomainEventDeserializer.configure(
        deadLetterSubscribers
      )
      const consumerFactory = new RabbitMQConsumerFactory(
        deserializer,
        connection,
        4
      )
      const rabbitMQConsumer = consumerFactory.build(
        deadLetterSubscriber,
        exchange,
        deadLetterQueue
      )
      await connection.consume(
        deadLetterQueue,
        rabbitMQConsumer.onMessage.bind(rabbitMQConsumer)
      )
      await deadLetterSubscriber.assertConsumedEvents(events)
    }
  })
})
