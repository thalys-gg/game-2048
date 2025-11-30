import { gsap } from 'gsap'
import { Assets, Sprite } from 'pixi.js'
import { engine } from '@/getEngine'
import { UI_CONSTANTS } from './config'

export class UIHeart extends Sprite {
  private _index = -1

  constructor (index: number) {
    const spritesheet = Assets.get('memory-game-phaser/ui')
    const textures = spritesheet.textures
    super(textures.heart)

    this._index = index

    this.scale.set(UI_CONSTANTS.HEART_SCALE)
    this.x = this._index * this.width
    this.y = 0
  }

  animateIn () {
    const { width } = engine().screen

    const finalX = this.x
    this.x = width + 100
    gsap.to(this, { x: finalX, duration: 1, delay: 1 + this._index * 0.1, ease: 'expo.out' })
  }

  animateOut () {
    gsap.to(this, {
      y: -100,
      alpha: 0,
      duration: 0.5,
      ease: 'back.in',
      onComplete: () => this.destroy(),
    })
  }
}
