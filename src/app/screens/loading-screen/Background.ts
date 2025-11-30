import { engine } from '∆/engine.singleton'
import { Container, Graphics } from 'pixi.js'

export class Background extends Container {
  constructor () {
    super()

    this.config()
    this.drawSquare()
  }

  private config () {
    this.pivot.set(0.5)
  }

  resize (width: number, height: number) {

  }

  private drawSquare () {
    const { screen } = engine()
    const { width, height } = screen
    const color = '#1E1E1E'
    // const color = '#140C0C'

    const draw = new Graphics()
    draw.rect(0, 0, width, height)
    draw.fill(color)
    this.addChild(draw)
  }
}

// ObsidianLavaBlack:         #382B46
// DarkLava:                  #140c0c
// GenericBlackLava:          #231C1C
// BrightRedLava:             #CF1020
// VolcanicRock Brown:        #A67C69
// OldLavaBrown:              #694A38
// EliccLavaRock:             #674539
// BasaltGrey:                #575E5F
// SlightlyLighterBasaltGrey: #5F6465
// VolcanicRockGray:          #6D6B67
