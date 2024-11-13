import {
  type DomainEvent,
  type DomainEventClass
} from '../../../../src/Contexts/Shared/domain/DomainEvent'
import { type DomainEventSubscriber } from '../../../../src/Contexts/Shared/domain/DomainEventSubscriber'
import { DomainEventDummy } from './DomainEventDummy'

export class DomainEventSubscriberDummy
  implements DomainEventSubscriber<DomainEventDummy>
{
  private readonly events: DomainEvent[]
  private readonly failsFirstTime: boolean = false
  private readonly alwaysFails: boolean = false
  private alreadyFailed = false

  constructor(params?: { failsFirstTime?: boolean; alwaysFails?: boolean }) {
    if (params?.failsFirstTime === true) {
      this.failsFirstTime = true
    }
    if (params?.alwaysFails === true) {
      this.alwaysFails = true
    }
    this.events = []
  }

  static failsFirstTime(): DomainEventSubscriberDummy {
    return new DomainEventSubscriberDummy({ failsFirstTime: true })
  }

  static alwaysFails(): DomainEventSubscriberDummy {
    return new DomainEventSubscriberDummy({ alwaysFails: true })
  }

  subscribedTo(): DomainEventClass[] {
    return [DomainEventDummy]
  }

  async on(domainEvent: DomainEventDummy): Promise<void> {
    if (this.alwaysFails) {
      throw new Error("I'm a dummy and I always fail")
    }
    if (!this.alreadyFailed && this.failsFirstTime) {
      this.alreadyFailed = true
      throw new Error("I'm a dummy and I fail the first time")
    }
    this.events.push(domainEvent)
  }

  async assertConsumedEvents(events: DomainEvent[]): Promise<void> {
    await new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        try {
          expect(this.events.length).toEqual(events.length)
          expect(this.events).toEqual(events)
          resolve()
        } catch (error) {
          reject(error)
        }
      }, 400)
    })
  }
}
