import type { TAnchorByPosition } from '∆/utils/pixijs.types'
import type { ObservablePoint } from 'pixi.js'

export function anchorBy<T extends { anchor: ObservablePoint }>(
  self: T,
  position: TAnchorByPosition,
) {
  switch (position) {
    case 'top':
      self.anchor.set(0.5, 1.0)
      break
    case 'right':
      self.anchor.set(1.0, 0.5)
      break
    case 'left':
      self.anchor.set(0.0, 0.5)
      break
    case 'bottom':
      self.anchor.set(0.5, 0.0)
      break
    case 'center':
      self.anchor.set(0.5, 0.5)
      break
  }
}
