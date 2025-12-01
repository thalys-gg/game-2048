import type { ColorSource } from 'pixi.js'
import { engine } from '∆/engine.singleton'
import { Graphics, GraphicsContext, RenderTexture } from 'pixi.js'

export function render () {

  let gc: GraphicsContext
  let g: Graphics
  let rt: RenderTexture
  let width: number
  let height: number

  const api = {

    canvas (w: number, h: number, color: ColorSource = 0x000000, alpha = 0) {
      width = w
      height = h
      gc = new GraphicsContext()
      gc.rect(0, 0, width, height)
      gc.fill({ color, alpha })
      return api
    },

    draw () {
      return {
        squareRounded (x: number, y: number, width: number, height: number, radius: number, color: string, alpha: number = 1) {
          g = new Graphics(gc)
          g.roundRect(x, y, width, height, radius)
          g.fill({ color, alpha })
          return api
        },
      }
    },

    render () {
      const rt = RenderTexture.create({
        width,
        height,
      })

      engine().renderer.render({
        container: g,
        target: rt,
      })

      return rt
    },
  }

  return api
}
