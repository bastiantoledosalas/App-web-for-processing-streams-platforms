import { type DomainEvent, type DomainEventClass } from './DomainEvent'

export interface DomainEventSubscriber<T extends DomainEvent> {
  subscribedTo: () => DomainEventClass[]
  on: (event: T) => Promise<void>
}
