import { Sprite } from 'pixi.js'
import textures from '@/textures'

export class Cell extends Sprite {

  constructor () {
    super(textures.cell)

    // const sprite = Sprite.from(renderSquare(width, height, radius, color))
    // sprite.position.set(10)
    // this.addChild(sprite)
  }
}
