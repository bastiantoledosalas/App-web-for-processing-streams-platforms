import { type DomainEventClass } from '../../../../Shared/domain/DomainEvent'
import { type DomainEventSubscriber } from '../../../../Shared/domain/DomainEventSubscriber'
import { UserEmail } from '../../../Users/domain/UserEmail'
import { UserLoggedDomainEvent } from '../../../Users/domain/UserLoggedDomainEvent'
import { type UserTokenCreator } from './UserTokenCreator'

export class CreateUserTokenOnUserLogged
  implements DomainEventSubscriber<UserLoggedDomainEvent>
{
  constructor(private readonly creator: UserTokenCreator) {}

  subscribedTo(): DomainEventClass[] {
    return [UserLoggedDomainEvent]
  }

  async on(domainEvent: UserLoggedDomainEvent): Promise<void> {
    await this.creator.run(new UserEmail(domainEvent.email))
  }
}
