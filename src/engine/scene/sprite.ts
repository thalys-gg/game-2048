import { Sprite, Texture } from 'pixi.js'

export type SSpriteConstructorOptions = ConstructorParameters<typeof Sprite>[0]

export class SSprite extends Sprite {

  public offset: number = 0
  public direction: number = 0
  public turningSpeed: number = 0
  public speed: number = 0
  constructor (options: SSpriteConstructorOptions) {
    super(options)
  }

  public static override from (source: Parameters<typeof Sprite['from']>[0], skipCache = false): SSprite {
    if (source instanceof Texture) {
      return new SSprite(source)
    }

    return new SSprite(Texture.from(source, skipCache))
  }
}
