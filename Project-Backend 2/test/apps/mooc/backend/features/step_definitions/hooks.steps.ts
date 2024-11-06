import { AfterAll, BeforeAll, setDefaultTimeout } from '@cucumber/cucumber'
import container from '../../../../../../src/apps/mooc/backend/dependency-injection'
import { type EnvironmentArranger } from '../../../../../Contexts/Shared/infrastructure/arranger/EnvironmentArranger'
import { MoocBackendApp } from '../../../../../../src/apps/mooc/backend/MoocBackendApp'
import { type EventBus } from '../../../../../../src/Contexts/Shared/domain/EventBus'

let application: MoocBackendApp
let environmentArranger: EnvironmentArranger
let eventBus: EventBus

setDefaultTimeout(300 * 1000)

BeforeAll(async () => {
  environmentArranger = await container.get<Promise<EnvironmentArranger>>(
    'Mooc.EnvironmentArranger'
  )
  eventBus = container.get<EventBus>('Mooc.Shared.domain.EventBus')
  await environmentArranger.arrange()
  application = new MoocBackendApp()
  await application.start()
})

AfterAll(async () => {
  await environmentArranger.close()
  await application.stop()
})

export { application, environmentArranger, eventBus }
