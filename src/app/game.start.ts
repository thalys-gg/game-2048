import { logger } from '@thalys/logger'
import { engine } from '@thalys/pixi-shared/engine.singleton'
import { navigationConfig } from '@/screens/navigation.config'
import { ScreenAssetLoader } from '@/screens/loading-screen/ScreenAssetLoader'
import { ScreenMain } from '@/screens/main/ScreenMain'
import { OverlayUI } from '@/screens/overlay/UI'

export async function start() {
  const { navigation } = engine()

  // Inject game routing/persistence before any screen is shown
  navigation.configure(navigationConfig)

  await navigation.showScreen(ScreenAssetLoader)
  await navigation.showScreen(ScreenMain)
  navigation.setOverlay(OverlayUI)

  logger.info('Starting 2048 game...')
}
