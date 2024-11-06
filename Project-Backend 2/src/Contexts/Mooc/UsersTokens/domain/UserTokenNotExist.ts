export class UserTokenNotExist extends Error {
  constructor() {
    super('User token does not exist')
  }
}
