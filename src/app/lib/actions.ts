import type { FancyButton } from '@pixi/ui'
import type { IAppScreenConstructor } from '∆/navigation.types'
import { engine } from '∆/engine.singleton'
import { PopupPause } from '@/popups/popup.pause'
import { PopupSettings } from '@/popups/popup.settings'
import { ScreenMain } from '@/screens/main/ScreenMain'
import textures from '@/lib/textures'

export default new class {
  dismissPopup = () => {
    void engine().navigation.dismissPopup()
  }

  showScreen = (screen: IAppScreenConstructor) => { void engine().navigation.showScreen(screen) }

  goToPausePopup = () => { void engine().navigation.presentPopup(PopupPause) }

  goToSettings = () => { void engine().navigation.presentPopup(PopupSettings) }

  goToHome = () => { void engine().navigation.showScreen(ScreenMain) }

  goFullScreen = (btn: FancyButton) => {

    return async function toggleFullScreen () {
      try {
        if (!document.fullscreenElement) {
          await document.documentElement.requestFullscreen()
        } else {
          await document.exitFullscreen()
        }
        btn.defaultView = document.fullscreenElement ? textures.iconSmaller : textures.iconLarger

      } catch (err) {
        console.error('FullScreen error:', err)
      }
    }
  }

  onButtonHoverSound = () => {
    engine().audio.sfx.play('main/sounds/sfx-hover.wav')
  }

  onBtnPressSound = () => {
    engine().audio.sfx.play('main/sounds/sfx-press.wav')
  }
}()
