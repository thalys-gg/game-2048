import { FancyButton } from '@pixi/ui'
import { ZINC } from '∆/lib/colors'
import { waitFor } from '∆/lib/promise'
import actions from '@/lib/actions'
import textures from '@/lib/textures'
import { Label } from '@/ui/Label'

const btnTransitions = {
  hover: { props: { scale: { x: 1.03, y: 1.03 } }, duration: 100 },
  pressed: { props: { scale: { x: 0.97, y: 0.97 } }, duration: 100 },
}

export default new class {

  public createBtnPlay (text: string, onPress: () => void) {

    const textColor = ZINC[100]
    const disabled = false
    const padding = 0
    const textOffsetX = 0.5
    const textOffsetY = 0.5
    const defaultTextScale = 1
    const defaultTextAnchorX = 0.5
    const defaultTextAnchorY = 0.5
    const anchorX = 0.5
    const anchorY = 0.5
    const animationDuration = 65
    const fontSize = 28
    const scale = 0.6

    const label = new Label({
      text,
      style: { fill: textColor, fontSize, fontFamily: 'Kenney Future' },
    })

    const btn = new FancyButton({
      defaultView: textures.btnPlay(),
      pressedView: textures.btnPlayPressed(),
      scale,
      text: label,
      padding,
      textOffset: {
        x: textOffsetX,
        y: textOffsetY,
      },
      defaultTextScale,
      defaultTextAnchor: {
        x: defaultTextAnchorX,
        y: defaultTextAnchorY,
      },
      animations: {
        hover: {
          props: { scale: { x: 1.03, y: 1.03 }, y: 0 },
          duration: animationDuration,
        },
        pressed: {
          props: { scale: { x: 0.97, y: 0.97 }, y: 6 },
          duration: animationDuration,
        },
      },
    })

    btn.anchor.set(anchorX, anchorY)
    btn.label = `btnPlay-${text}`
    btn.onPress.connect(() => {
      void (async () => {
        btn.enabled = false
        actions.onBtnPressSound()
        await waitFor(0.2)
        onPress()
      })()
    })
    btn.onHover.connect(actions.onButtonHoverSound)
    return btn
  }

  public get createBtnPause () {

    const btn = new FancyButton({
      defaultView: textures.iconPause,
      anchor: 0.5,
      scale: 0.5,
      animations: { ...btnTransitions },
    })

    btn.label = 'btnPause'
    btn.onPress.connect(actions.goToPausePopup)
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
    btn.onPress.connect(actions.goToSettings)
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

  public createBtnPopupDone (text: string, fontSize: number = 50) {

    const btn = new FancyButton({
      defaultView: textures.btnPlay(),
      pressedView: textures.btnPlayPressed(),
      anchor: 0.5,
      scale: 0.44,
      animations: { ...btnTransitions },
      text: new Label({
        text,
        style: { fill: ZINC[900], align: 'center', fontSize },
      }),
    })

    btn.label = 'btnPopupDone'
    btn.onPress.connect(() => {
      void (async function () {
        btn.enabled = false
        actions.onBtnPressSound()
        await waitFor(0.2)
        actions.dismissPopup()
      })()
    })
    return btn
  }

}()
