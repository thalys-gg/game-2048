import { choose } from '∆/lib/array'
import { Sprite } from 'pixi.js'
import textures from '@/textures'
import { Label } from '@/ui/Label'

export class Cell extends Sprite {

  private text: Label

  constructor () {
    super(textures.cell)

    this.text = new Label({
      text: choose(['2', '4', '8', '16', '32', '64', '128', '256', '512', '1024', '2048', '4096']),
      style: {
        fontSize: 48,
      },
    })
    this.addChild(this.text)
  }

  public resize (width: number, height: number) {
    this.text.x = this.width * 0.5
    this.text.y = this.height * 0.5
  }
}
