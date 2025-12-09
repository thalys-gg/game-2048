import { Sprite } from 'pixi.js'
import textures from '@/textures'
import { Label } from '@/ui/Label'

export class UIPawn extends Sprite {

  private _text: Label
  private _value: number
  public set value (value: number) {
    this._value = value
    this._text.text = `${value}`
  }

  public get value () {
    return this._value
  }

  constructor (value: number) {
    super(textures.cell)

    this._value = value
    this._text = new Label({
      text: `${value}`,
      style: {
        fontSize: 48,
      },
    })
    this._text.anchor.set(0.5)
    this.addChild(this._text)
    this._text.x = this.width * 0.5
    this._text.y = this.height * 0.5
  }

  public resize (width: number, height: number) {
    this._text.x = this.width * 0.5
    this._text.y = this.height * 0.5
  }
}
