import game from './game'
import { createApplication } from './main.create'
import '∆/pixi.plugins'

async function init () {

  await createApplication()

  await game.start()
}

init()
