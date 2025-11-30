import type { Container } from 'pixi.js'
import type { ResultGetMaxDimensions } from '∆/layout.types'

export function getMaxDimensions (children: Container[]): ResultGetMaxDimensions {

  return children
    .filter(child => child.visible)
    .reduce((acc, child) => {

      acc.children.push(child)
      const { width, height } = child.getSize()
      acc.childrenSize.width += width
      acc.childrenSize.height += height
      return acc
    }, { children: [], childrenSize: { width: 0, height: 0 } } as ResultGetMaxDimensions)
}
