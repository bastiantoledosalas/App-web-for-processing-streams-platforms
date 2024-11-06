/**
 * This class is used to define the value objects that are
 * strings.
 */
export abstract class StringValueObject {
  public readonly value: string

  constructor(value: string) {
    this.value = value
  }

  /**
   * This method returns the value of the string value
   * object.
   *
   * @returns {string} The value of the string value object.
   */
  public toString(): string {
    return this.value
  }
}
