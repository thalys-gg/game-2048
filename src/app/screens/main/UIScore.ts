import type { IChild, ResizeSignature } from '∆/navigation.types'
import { logger } from '@thalys/logger'
import { Container, Sprite } from 'pixi.js'
import { CONFIG } from '@/config'
import textures from '@/lib/textures'
import { STATE } from '@/screens/main/state'
import { Label } from '@/ui/Label'

const log = logger.custom` [${'UIScore'}]`

function createBackground (parent: Container) {
  const bg = Sprite.from(textures.scoreBg)
  bg.label = 'ScoreBackground'
  bg.alpha = 1
  bg.anchor.set(0.5)
  parent.addChild(bg)
  return bg
}

function createLabel (parent: Container, label?: string) {
  const text = new Label({
    text: '0',
    style: {
      fontSize: 28,
      fill: CONFIG.theme.score.text,
      align: 'center',
    },
  })
  text.label = label || 'ScoreText'
  text.alpha = 1
  text.anchor.set(0.5)
  parent.addChild(text)
  return text
}

export class UIScore extends Container implements IChild {

  private bg: Sprite
  private text: Label
  constructor () {
    super()
    this.bg = createBackground(this)
    this.text = createLabel(this)

    STATE.on('scoreChanged', (value, oldValue, receiver, property) => {
      log(`from: ${oldValue} -> to: ${value}`)
      this.text.text = `${value}`
    })
  }

  public resize ({ screen }: ResizeSignature) {

    const center = {
      x: screen.width * 0.5,
      y: screen.height * 0.5,
    }

    this.bg.x = center.x
    this.bg.y = screen.height * 0.1

    this.text.x = center.x
    this.text.y = this.bg.y
  }
}
