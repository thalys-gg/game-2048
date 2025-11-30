import type { DisplayChild, DisplayChildMethods } from '@/fun-style/types'
import { PContainer, PGraphics } from '∆/rosetta-stone/PixiJS'

export interface PropsFnBase {
  label?: string
}

interface PropsFnContainer extends PropsFnBase {}

export function container (opts?: PropsFnContainer): DisplayChild {
  const {
    label = 'container-base',
  } = opts || {}

  const c = new PContainer()

  return Object.assign(c, {
    ...c,
    onInit: () => {
      c.label = label
      return c
    },
    onResize: ({ sw, sh }) => {
      c.position.set(0)
    },
  } satisfies DisplayChildMethods)
}

interface PropsFnSquareRounded {
  color?: number
  size?: number
  radius?: number
  alpha?: number
  stroke?: {
    color?: number
    alpha?: number
    width?: number
  }
}

export function squareRounded (opts?: PropsFnSquareRounded): DisplayChild {
  const {
    color = 0xE879F9,
    size = 100,
    radius = 15,
    alpha = 1,
    stroke = {},
  } = opts || {}

  stroke.alpha = stroke.alpha ?? 1
  stroke.width = stroke.width ?? 6
  stroke.color = stroke.color ?? 0xE879F9

  const g = new PGraphics()
  return Object.assign(g, {
    ...g,
    onInit: () => {
      g.label = 'animBgElement'
      return g
    },
    onResize: ({ sw, sh }) => {
      const x = sw / 2 - size / 2
      const y = sh / 2 - size / 2
      g.roundRect(x, y, size, size, radius)
      g.fill({ color, alpha })
      g.stroke({ color: stroke.color, width: stroke.width, alpha: stroke.alpha })
    },
  } satisfies DisplayChildMethods)
}
