import { createApplication } from '@/game.create'
import game from '@/game.start'
import '@/extra-modules'

async function init () {

  await createApplication()

  await game.start()
}

init()
