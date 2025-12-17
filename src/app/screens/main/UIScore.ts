import type { IChild, ResizeSignature } from '∆/types'
import type { DestroyOptions } from 'pixi.js'
import { logger } from '@thalys/logger'
import { Container, Sprite } from 'pixi.js'
import { getTheme } from '@/config'
import animations from '@/lib/animations'
import textures from '@/lib/textures'
import { STATE } from '@/screens/main/state'
import { Label } from '@/ui/Label'

const log = logger.custom`[ ${'UIScore'} ]`

const theme = getTheme()

function createBackground (parent: Container) {
  const bg = Sprite.from(textures.scoreBg)
  bg.label = 'ScoreBackground'
  bg.alpha = 1
  parent.addChild(bg)
  return bg
}

function createLabelTitle (parent: Container, text?: string, label?: string) {
  const _text = new Label({
    text: text || 'Score',
    style: {
      fontSize: 16,
      fill: theme.score.text,
      align: 'center',
    },
  })
  _text.label = label || 'ScoreText'
  _text.alpha = 1
  _text.anchor.set(0.5)
  parent.addChild(_text)
  return _text
}

function createLabelValue (parent: Container, text?: string, label?: string) {
  const _text = new Label({
    text: text || '0',
    style: {
      fontSize: 28,
      fill: theme.score.text,
      align: 'center',
    },
  })
  _text.label = label || 'ScoreText'
  _text.alpha = 1
  parent.addChild(_text)
  return _text
}

export class UIScore extends Container implements IChild {

  private bg: Sprite
  private textTitle: Label
  private textValue: Label

  private _rollupScoreRef: ReturnType<typeof animations.rollupScore> | null = null
  private _fadeScoreRef: ReturnType<typeof animations.fadeScore> | null = null

  constructor () {
    super()
    this.pivot.set(0.5)
    this.bg = createBackground(this)
    this.textTitle = createLabelTitle(this, 'SCORE')
    this.textValue = createLabelValue(this, '0')

    STATE.on('scoreChanged', (value, oldValue, receiver, property) => {

      if (value === 0) {
        this._fadeScoreRef = animations.fadeScore(this.textValue)
        return
      }
      this._rollupScoreRef = animations.rollupScore(this.textValue, oldValue || 0, value)
    })
  }

  public override destroy (options?: DestroyOptions | undefined) {
    super.destroy(options)
    this._rollupScoreRef?.destroy()
    this._rollupScoreRef = null
    this._fadeScoreRef?.destroy()
    this._fadeScoreRef = null
  }

  public resize ({ screen, parent }: ResizeSignature) {

    this.x = screen.width * 0.5 - this.bg.width * this.pivot.x
    this.y = 45

    this.bg.x = 0
    this.bg.y = 0

    const { top, bottom, left, width } = this.bg.getLocalBounds()

    this.textTitle.x = left + width * 0.5
    this.textTitle.y = top + this.textTitle.height * 0.5 + 10

    this.textValue.x = left + width * 0.5
    this.textValue.y = bottom - this.textValue.height * 0.5 - 10
  }
}
