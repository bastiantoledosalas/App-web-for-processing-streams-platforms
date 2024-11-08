
//Import BackendApp.ts from /backend/ directory
import { BackendApp } from './BackendApp'

try {
  void new BackendApp().start()
} catch (error) {
  console.error(error)
  process.exit(1)
}

process.on('uncaughtException', (err) => {
  console.error('uncaughtException', err)
  process.exit(1)
})
