import { engine } from '∆/engine.singleton'
import { Graphics, GraphicsContext, RenderTexture, Sprite } from 'pixi.js'

export function renderSquare (width: number, height: number, radius: number, color: string, alpha: number = 1) {
  const context = new GraphicsContext()
  context.rect(0, 0, width, height)
  context.fill({ color: 0x000000, alpha: 0 })

  const g = new Graphics(context)
  g.roundRect(0, 0, width, height, radius)
  g.fill({ color, alpha })

  const rt = RenderTexture.create({
    width,
    height,
  })

  engine().renderer.render({
    container: g,
    target: rt,
  })

  return rt
}

export class Square extends Sprite {
  constructor (width: number, height: number, radius: number, color: string) {
    super()
  }
}
