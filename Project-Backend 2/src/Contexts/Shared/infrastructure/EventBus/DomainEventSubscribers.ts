import {
  type ContainerBuilder,
  type Definition
} from 'node-dependency-injection'
import { type DomainEvent } from '../../domain/DomainEvent'
import { type DomainEventSubscriber } from '../../domain/DomainEventSubscriber'

/**
 * This class is responsible for finding all the domain event subscribers
 */
export class DomainEventSubscribers {
  constructor(public items: Array<DomainEventSubscriber<DomainEvent>>) {}

  /**
   * This method find all the domain event subscribers in the container
   *
   * @param {ContainerBuilder} container The container builder
   * @returns {DomainEventSubscribers} The domain event subscribers
   */
  static from(container: ContainerBuilder): DomainEventSubscribers {
    const subscriberDefinitions = container.findTaggedServiceIds(
      'domainEventSubscriber'
    ) as Map<string, Definition>
    const subscribers: Array<DomainEventSubscriber<DomainEvent>> = []
    subscriberDefinitions.forEach((_value: Definition, key: string) => {
      const domainEventSubscriber = container.get<
        DomainEventSubscriber<DomainEvent>
      >(key.toString())
      subscribers.push(domainEventSubscriber)
    })
    return new DomainEventSubscribers(subscribers)
  }
}
