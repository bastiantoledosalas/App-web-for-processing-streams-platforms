import { type DomainEvent } from '../../../domain/DomainEvent'
import { type DomainEventSubscriber } from '../../../domain/DomainEventSubscriber'

export class RabbitMQqueueFormatter {
  constructor(private readonly moduleName: string) {}

  format(subscriber: DomainEventSubscriber<DomainEvent>): string {
    const value = subscriber.constructor.name
    const name = value
      .split(/(?=[A-Z])/)
      .join('_')
      .toLowerCase()
    return `${this.moduleName}_${name}`
  }

  formatRetry(subscriber: DomainEventSubscriber<DomainEvent>): string {
    const name = this.format(subscriber)
    return `retry.${name}`
  }

  formatDeadLetter(subscriber: DomainEventSubscriber<DomainEvent>): string {
    const name = this.format(subscriber)
    return `dead_letter.${name}`
  }
}
