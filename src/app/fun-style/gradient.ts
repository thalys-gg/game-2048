import type { PTicker } from '∆/rosetta-stone/PixiJS'
import type { DisplayChild, DisplayChildMethods } from '@/fun-style/types'
import { PFillGradient, PGraphics } from '∆/rosetta-stone/PixiJS'

export function linGrad (): DisplayChild {
  const g = new PGraphics()

  return Object.assign(g, {
    ...g,
    onInit: () => {
      g.label = 'linGrad'
      return g
    },
    onResize: ({ sw, sh }) => {
      const gradient = new PFillGradient({
        type: 'linear',
        start: { x: 0, y: 0 },
        end: { x: sw, y: sh },
        colorStops: [
          { offset: 0, color: 0x1E1B4B },
          { offset: 0.5, color: 0x312E81 },
          { offset: 1, color: 0x1E1B4B },
        ],
        textureSpace: 'global',  // Use world coordinates
      })
      gradient.addColorStop(0, 0x000000)
      gradient.addColorStop(1, 0xFFFFFF)

      g.clear()
      g.rect(0, 0, sw, sh)
      g.fill(gradient)
    },
    onUpdate: (ticker: PTicker) => {},
  } satisfies DisplayChildMethods)
}

export function gradBase1 (): DisplayChild {
  const g = new PGraphics()

  return Object.assign(g, {
    ...g,
    onInit: () => {
      g.label = 'gradBase1'
      return g
    },
    onResize: ({ sw, sh }) => {
      g.clear()
      g.rect(0, 0, sw, sh)
      g.fill({
        color: 0x1A1A2E,
      })
    },
  } satisfies DisplayChildMethods)
}

export function gradBase2 (): DisplayChild {
  const g = new PGraphics()

  return Object.assign(g, {
    ...g,
    onInit: () => {
      g.label = 'gradBase2'
      return g
    },
    onResize: ({ sw, sh }) => {
      g.clear()
      g.rect(0, 0, sw, sh)
      g.fill({
        color: 0x0F0F1E,
      })
    },
  } satisfies DisplayChildMethods)
}

export function gradBase3 (): DisplayChild {
  const g = new PGraphics()

  return Object.assign(g, {
    ...g,
    onInit: () => {
      g.label = 'gradBase3'
      return g
    },
    onResize: ({ sw, sh }) => {
      g.clear()
      g.rect(0, 0, sw, sh)
      g.fill({
        color: 0x1A202C,
      })
    },
  } satisfies DisplayChildMethods)
}
