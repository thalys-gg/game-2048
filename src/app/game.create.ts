import { initDevtools } from '@pixi/devtools'
import { Assets } from 'pixi.js'
import { CreationEngine } from '@thalys/pixi-shared/engine'
import { setEngine } from '@thalys/pixi-shared/engine.singleton'
import { ZINC } from '@thalys/pixi-shared/lib/colors'
import { userSettings } from '@thalys/pixi-shared/utils/user.settings'
import { isDev } from '@/lib/global'
import manifest from '../gen/manifest.json'

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

  // Init PixiJS assets with this game's asset manifest, then preload the
  // `preload` bundle and background-load the rest.
  await Assets.init({ manifest, basePath: 'assets' })
  await Assets.loadBundle('preload')
  Assets.backgroundLoadBundle(manifest.bundles.map(item => item.name))

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
