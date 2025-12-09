import { choose } from '∆/lib/array'
import { Sprite } from 'pixi.js'
import textures from '@/textures'
import { Label } from '@/ui/Label'

export class Pawn extends Sprite {

  private text: Label

  constructor () {
    super(textures.cell)

    this.text = new Label({
      text: choose(['2', '4']),
      style: {
        fontSize: 48,
      },
    })
    this.text.anchor.set(0.5)
    this.addChild(this.text)
    this.text.x = this.width * 0.5
    this.text.y = this.height * 0.5
  }

  public resize (width: number, height: number) {
    this.text.x = this.width * 0.5
    this.text.y = this.height * 0.5
  }
}
