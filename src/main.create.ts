import { initDevtools } from '@pixi/devtools'
import { logger } from '@thalys/logger'
import { CreationEngine } from '∆/engine'
import { setEngine } from '∆/engine.singleton'
import { ZINC } from '∆/utils/colors'
import { userSettings } from '∆/utils/user.settings'
import { Stats } from 'pixi-stats'
import { getAppVersion, isDev } from '@/global'
import '@/extra-modules'

export async function createApplication () {

  const engine = new CreationEngine()
  setEngine(engine)

  await engine.init({
    resizeOptions: { minWidth: 480, minHeight: 720, letterbox: false },
    background: ZINC[900],
    antialias: true,
    hello: isDev(),
    powerPreference: 'high-performance',
  })

  initDevtools({ app: engine })
  const stats = new Stats(engine.renderer)

  // Initialize the user settings
  userSettings.init()

  if (isDev()) {
    logger.table(JSON.parse(JSON.stringify(import.meta.env)))
    logger.info(JSON.parse(JSON.stringify(`App version: \n${getAppVersion()}`)))
    // engine.navigation.setMeasureLayer(Ruler)
  }

  return engine
}
