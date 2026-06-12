import { createApplication } from '@/game.create'
import { start } from '@/game.start'
import '@/extra-modules'

async function init() {
  await createApplication()
  await start()
}

init()
