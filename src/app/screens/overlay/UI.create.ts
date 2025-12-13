import { FancyButton } from '@pixi/ui'
import actions from '@/lib/actions'
import { btnTransitions } from '@/lib/buttons'
import textures from '@/lib/textures'

export const create = new class {

  public get createBtnPause () {

    const btn = new FancyButton({
      defaultView: textures.iconPause,
      anchor: 0.5,
      scale: 0.5,
      animations: { ...btnTransitions },
    })

    btn.label = 'btnPause'
    btn.onPress.connect(actions.showPausePopup)
    return btn
  }

  public get createBtnHome () {

    const btn = new FancyButton({
      defaultView: textures.iconHome,
      anchor: 0.5,
      scale: 0.5,
      animations: { ...btnTransitions },
    })

    btn.label = 'btnHome'
    btn.onPress.connect(actions.goToHome)
    return btn
  }

  public get createBtnSettings () {

    const btn = new FancyButton({
      defaultView: textures.iconSettings,
      anchor: 0.5,
      scale: 0.5,
      animations: { ...btnTransitions },
    })

    btn.label = 'btnSettings'
    btn.onPress.connect(actions.showSettings)
    return btn
  }

  public get createBtnFullScreen () {

    const btn = new FancyButton({
      defaultView: textures.iconLarger,
      anchor: 0.5,
      scale: 0.5,
      animations: { ...btnTransitions },
    })

    btn.label = 'btnFullScreen'
    const toggleFullScreen = actions.goFullScreen(btn)
    btn.onPress.connect(() => void toggleFullScreen())
    return btn
  }
}()
