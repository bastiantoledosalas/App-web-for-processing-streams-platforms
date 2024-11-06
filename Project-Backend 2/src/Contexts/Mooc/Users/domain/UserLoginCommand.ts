import { Command } from '../../../Shared/domain/Command'

interface Params {
  email: string
  password: string
}

export class UserLoginCommand extends Command {
  readonly email: string
  readonly password: string

  constructor({ email, password }: Params) {
    super()
    this.email = email
    this.password = password
  }
}
