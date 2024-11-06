import { MotherCreator } from './MotherCreator'

export class PasswordMother {
  static random({
    minLength = 1,
    maxLength
  }: {
    minLength?: number
    maxLength: number
  }): string {
    return (
      MotherCreator.random().internet.password(
        Math.floor(Math.random() * (maxLength - minLength)) + minLength
      ) ?? 'password'
    )
  }
}
