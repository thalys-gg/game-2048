import { initDevtools } from '@pixi/devtools'
import { CreationEngine } from '∆/engine'
import { setEngine } from '∆/engine.singleton'
import { ZINC } from '∆/lib/colors'
import { userSettings } from '∆/utils/user.settings'
import { isDev } from '@/lib/global'

export async function createApplication() {
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

  // Initialize the user settings
  userSettings.init()

  if (isDev()) {
    // logger.table(JSON.parse(JSON.stringify(import.meta.env)))
    // logger.info(JSON.parse(JSON.stringify(`App version: \n${getAppVersion()}`)))
    // engine.navigation.setMeasureLayer(Ruler)
  }

  return engine
}
