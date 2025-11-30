import { AnimatedSprite } from 'pixi.js'

export type SSpriteAnimatedConstructorOptions = ConstructorParameters<typeof AnimatedSprite>[0]

export class SSpriteAnimated extends AnimatedSprite {

  public offset: number = 0
  public direction: number = 0
  public turningSpeed: number = 0
  public speed: number = 0
  constructor (options: SSpriteAnimatedConstructorOptions) {
    super(options)
  }
}
