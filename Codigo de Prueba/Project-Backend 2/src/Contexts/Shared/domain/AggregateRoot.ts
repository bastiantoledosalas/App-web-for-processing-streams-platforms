import { type DomainEvent } from './DomainEvent'

/**
 * This class is the base class for all aggregate roots in the domain.
 * It provides the basic functionality to record domain events.
 * @abstract
 */
export abstract class AggregateRoot {
  private domainEvents: DomainEvent[]

  constructor() {
    this.domainEvents = []
  }

  /**
   * This method is used to pull domain events.
   *
   * @returns {DomainEvent[]} The domain events.
   */
  public pullDomainEvents(): DomainEvent[] {
    const domainEvents = this.domainEvents.slice()
    this.domainEvents = []
    return domainEvents
  }

  /**
   * This method is used to record domain events.
   *
   * @param {DomainEvent} event The domain event.
   * @returns {void}
   */
  public record(event: DomainEvent): void {
    this.domainEvents.push(event)
  }

  /**
   * This methdo is used to convert in primitive data types.
   *
   * returns {any} The primitive data types.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  abstract toPrimitives(): any
}
