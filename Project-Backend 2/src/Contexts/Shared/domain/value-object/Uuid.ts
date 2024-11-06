import { v4 as uuid } from 'uuid'
import validate from 'uuid-validate'
import { InvalidArgumentError } from './InvalidArgumentError'

/**
 * This class is used to define the value object
 * that will be used to store data the id of the aggregate root.
 * And it is used for others objects that need to store an id.
 */
export class Uuid {
  public readonly value: string

  constructor(value: string) {
    this.value = value
    this.ensureIsValidUuid(value)
  }

  /**
   * This method is used to create a new instance of the value
   * object with value random.
   *
   * @returns {Uuid} The new instance of the value object.
   */
  public static random(): Uuid {
    return new Uuid(uuid())
  }

  /**
   * This method is used to validate the value is correct uuid.
   *
   * @param {string} id The value to validate.
   * @throws {InvalidArgumentError} If the value is not valid.
   * @returns {void}
   */
  private ensureIsValidUuid(id: string): void {
    if (!validate(id)) {
      throw new InvalidArgumentError(
        `<${this.constructor.name}> does not allow the value <${id}>`
      )
    }
  }

  /**
   * This method is used to convert in primitive data type.
   *
   * @returns {string} The value converted.
   */
  toString(): string {
    return this.value
  }
}
