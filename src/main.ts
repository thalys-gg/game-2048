import { ScreenAssetLoader } from '@/screens/loading-screen/ScreenAssetLoader'
import game from './game'
import { createApplication } from './main.create'
import '∆/pixi.plugins'

async function init () {

  const engine = await createApplication()

  const { navigation } = engine

  await navigation.showScreen(ScreenAssetLoader)
  // // await navigation.showScreen(ScreenMemoryGameMenu)
  // await navigation.showScreen(ScreenMemoryGame)

  await game.start()
}

init()
