import { Sprite, Texture } from 'pixi.js'

export class Logo extends Sprite {
  constructor () {
    super({
      texture: Texture.from('logo.svg'),
      anchor: 0.5,
      scale: 0.2,
    })
  }

  public resize (width: number, height: number) {
    this.position.set(width * 0.5, height * 0.5)
  }
}
