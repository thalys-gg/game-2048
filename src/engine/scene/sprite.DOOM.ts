import { Sprite, Texture } from 'pixi.js'

export type DSpriteConstructorOptions = ConstructorParameters<typeof Sprite>[0]

export class DSprite extends Sprite {

  /**
   * Heat level goes from 0 -> MAX_HEAT_LEVEL
   * (luminance level 37, index 36 of the `paletteDOOM`)
   */
  public heatLevel: number = 0
  public row: number = 0
  public col: number = 0
  public index: number = 0
  constructor (options: DSpriteConstructorOptions) {
    super(options)
  }

  public static override from (source: Parameters<typeof Sprite['from']>[0], skipCache = false): DSprite {
    if (source instanceof Texture) {
      return new DSprite(source)
    }

    return new DSprite(Texture.from(source, skipCache))
  }
}
