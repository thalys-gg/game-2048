import { logger } from '@thalys/logger'
import { engine } from '∆/engine.singleton'
import { ScreenAssetLoader } from '@/screens/loading-screen/ScreenAssetLoader'
import { ScreenMain } from '@/screens/main/ScreenMain'
import { OverlayUI } from '@/screens/overlay/UI'

export async function start() {
  const { navigation } = engine()

  await navigation.showScreen(ScreenAssetLoader)
  await navigation.showScreen(ScreenMain)
  navigation.setOverlay(OverlayUI)

  logger.info('Starting 2048 game...')
}
