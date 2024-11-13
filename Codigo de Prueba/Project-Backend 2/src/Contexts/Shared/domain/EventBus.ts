import { type DomainEventSubscribers } from '../infrastructure/EventBus/DomainEventSubscribers'
import { type DomainEvent } from './DomainEvent'

export interface EventBus {
  publish: (events: DomainEvent[]) => Promise<void>
  addSubscribers: (subscribers: DomainEventSubscribers) => void
}
