import { ZINC } from '∆/utils/colors'
import { Sprite } from 'pixi.js'
import { renderSquare } from '@/square'

export class Empty extends Sprite {

  constructor (width: number, height?: number) {
    super(renderSquare(width + 20, height ?? width + 20, 10, ZINC[600], 0))

    const sprite = Sprite.from(renderSquare(width, height ?? width, 10, ZINC[600]))
    sprite.position.set(10)
    this.addChild(sprite)
  }
}
