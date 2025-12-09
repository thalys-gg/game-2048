import game from './game'
import { createApplication } from './main.create'
import '@/extra-modules'

async function init () {

  await createApplication()

  await game.start()
}

init()
