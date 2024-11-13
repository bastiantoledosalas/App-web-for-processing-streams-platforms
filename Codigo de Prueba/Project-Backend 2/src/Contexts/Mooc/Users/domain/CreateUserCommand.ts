import { Command } from '../../../Shared/domain/Command'

interface Params {
  id: string
  firstName: string
  lastName: string
  email: string
  password: string
  repeatPassword: string
}

export class CreateUserCommand extends Command {
  readonly id: string
  readonly firstName: string
  readonly lastName: string
  readonly email: string
  readonly password: string
  readonly repeatPassword: string

  constructor({
    id,
    firstName,
    lastName,
    email,
    password,
    repeatPassword
  }: Params) {
    super()
    this.id = id
    this.firstName = firstName
    this.lastName = lastName
    this.email = email
    this.password = password
    this.repeatPassword = repeatPassword
  }
}
