import { type Collection, type MongoClient } from 'mongodb'
import { type DomainEvent } from '../../../domain/DomainEvent'
import { type DomainEventDeserializer } from '../DomainEventDeserializer'
import { DomainEventJsonSerializer } from '../DomainEventJsonSerializer'

/**
 * This class is used to publish domain events to the failover collection
 */
export class DomainEventFailoverPublisher {
  static collectionName = 'domain_events_failover'

  constructor(
    private readonly _client: Promise<MongoClient>,
    private deserializer?: DomainEventDeserializer
  ) {}

  /**
   * This method returns the failover collection
   *
   * @returns {Collection} The failover collection
   */
  protected async collection(): Promise<Collection> {
    return (await this._client)
      .db()
      .collection(DomainEventFailoverPublisher.collectionName)
  }

  /**
   * This method publishes the provided event to the failover collection
   *
   * @param {DomainEvent} event The event to be published
   * @returns {void} A promise that resolves when the event is published
   */
  async publish(event: DomainEvent): Promise<void> {
    const collection = await this.collection()
    const eventSerialized = DomainEventJsonSerializer.serialize(event)
    const options = { upsert: true }
    const update = {
      $set: {
        eventId: event.eventId,
        event: eventSerialized
      }
    }

    await collection.updateOne(
      {
        eventId: event.eventId
      },
      update,
      options
    )
  }

  /**
   * This method returns all the events in the failover collection
   *
   * @returns {DomainEvent[]} A promise that resolves with all the events in the failover collection
   */
  async consume(): Promise<Array<DomainEvent | undefined>> {
    const collection = await this.collection()
    const documents = await collection.find().limit(200).toArray()
    if (this.deserializer === null || this.deserializer === undefined) {
      throw new Error('Deserializer has not been set yet')
    }
    const events = documents.map((document) => {
      if (this.deserializer !== null && this.deserializer !== undefined) {
        return this.deserializer.deserialize(document.event)
      }
      return undefined
    })
    return events.filter(Boolean)
  }

  setDeserializer(deserializer: DomainEventDeserializer): void {
    this.deserializer = deserializer
  }
}
