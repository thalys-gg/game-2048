import type { FancyButton } from '@pixi/ui'
import type { IAppScreenConstructor } from '@thalys/pixi-shared/types'
import { logger } from '@thalys/logger'
import { engine } from '@thalys/pixi-shared/engine.singleton'
import textures from '@/lib/textures'
import { GameOver } from '@/popups/popup.game-over'
import { GameWon } from '@/popups/popup.game-won'
import { PopupPause } from '@/popups/popup.pause'
import { PopupSettings } from '@/popups/popup.settings'
import { ScreenMain } from '@/screens/main/ScreenMain'

export default new (class {
  dismissPopup = () => {
    void engine().navigation.dismissPopup()
  }

  showScreen = (screen: IAppScreenConstructor) => {
    void engine().navigation.showScreen(screen)
  }

  showGameWon = () => {
    void engine().navigation.presentPopup(GameWon)
  }

  showGameOver = () => {
    void engine().navigation.presentPopup(GameOver)
  }

  showPausePopup = () => {
    void engine().navigation.presentPopup(PopupPause)
  }

  showSettings = () => {
    void engine().navigation.presentPopup(PopupSettings)
  }

  goToHome = () => {
    void engine().navigation.showScreen(ScreenMain)
  }

  goFullScreen = (btn: FancyButton) => {
    return async function toggleFullScreen() {
      try {
        if (!document.fullscreenElement) {
          await document.documentElement.requestFullscreen()
        } else {
          await document.exitFullscreen()
        }
        btn.defaultView = document.fullscreenElement ? textures.iconSmaller : textures.iconLarger
      } catch (err) {
        logger.error('FullScreen error:', err)
      }
    }
  }

  onButtonHoverSound = () => {
    engine().audio.sfx.play('main/sounds/sfx-hover.wav')
  }

  onBtnPressSound = () => {
    engine().audio.sfx.play('main/sounds/sfx-press.wav')
  }
})()
