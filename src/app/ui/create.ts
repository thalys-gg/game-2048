import type { Spritesheet } from 'pixi.js'
import type { CheckOpts } from '@/ui/Check'
import { FancyButton } from '@pixi/ui'
import { engine } from '∆/engine.singleton'
import { Assets, Sprite, Texture } from 'pixi.js'
import { PopupPause } from '@/popups/popup.pause'
import { PopupSettings } from '@/popups/popup.settings'
import { Check } from '@/ui/Check'

const buttonAnimations = {
  hover: {
    props: { scale: { x: 1.1, y: 1.1 } },
    duration: 100,
  },
  pressed: {
    props: { scale: { x: 0.9, y: 0.9 } },
    duration: 100,
  },
}

class Checks {
  SoundAutoMute = () => {
    const spritesheet: Spritesheet = Assets.get('ui/ui-blue')

    const opts = {
      text: 'Mute on switch tabs',
      style: {
        checked: spritesheet.textures.check_square_color_checkmark,
        unchecked: spritesheet.textures.check_square_color,
      },
    } satisfies CheckOpts

    const element = new Check(opts)
    return element
  }
}

class _MainUI {
  btnPause = () => {
    const btn = new FancyButton({
      defaultView: 'icon-pause',
      anchor: 0.5,
      animations: buttonAnimations,
    })

    btn.onPress.connect(() => {
      engine().navigation.presentPopup(PopupPause)
    })

    return btn
  }

  btnSettings = () => {
    const btn = new FancyButton({
      defaultView: 'icon-settings',
      anchor: 0.5,
      animations: buttonAnimations,
    })

    btn.onPress.connect(() => {
      engine().navigation.presentPopup(PopupSettings)
    })

    return btn
  }
}

class _SettingsPopup {
  bg = () => {
    const element = new Sprite(Texture.WHITE)
    element.eventMode = 'static'
    element.tint = 0x000000
    element.alpha = 0.2
    element.interactive = true
    element.on('pointerup', () => {
      engine().navigation.dismissPopup()
    })
    return element
  }

  checks = new Checks()
}

class _PausePopup {

}

class Popups {
  Pause = new _PausePopup()
  Settings = new _SettingsPopup()
}

class Create {
  popup = new Popups()

  mainUI = new _MainUI()
}

export const create = new Create()
