import { CreationEngine } from '∆/index'
import { Ruler } from '∆/scene/stage-ruler'
import { setEngine } from '@/getEngine'
import { ScreenMemoryGame } from '@/screens/game/ScreenMemoryGame'
import { ScreenAssetLoader } from '@/screens/loading-screen/ScreenAssetLoader'
import { userSettings } from '@/utils/userSettings'
import '∆/pixi.plugins'

// Create a new creation engine instance
const engine = new CreationEngine()
setEngine(engine)

async function init () {
  // Initialize the creation engine instance
  await engine.init({
    background: '#1E1E1E',
    resizeOptions: { minWidth: 768, minHeight: 1024, letterbox: false },
  })

  // if (import.meta.env.DEV) {
  //   engine.navigation.setRulerLayer(Ruler)
  // const stats = new Stats(engine.renderer)
  // document.body.appendChild(stats.domElement)
  // }

  // Initialize the user settings
  userSettings.init()

  const { navigation } = engine

  await navigation.showScreen(ScreenAssetLoader)
  // await navigation.showScreen(ScreenMemoryGameMenu)
  await navigation.showScreen(ScreenMemoryGame)
}

init()
