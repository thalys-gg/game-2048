import type { Container } from 'pixi.js'
import type { IBaseOptions } from '∆/layout.types'
import { getMaxDimensions } from '∆/layout.utils'

export function flexRow (
  container: Container,
  options: IBaseOptions,
): void {

  const {
    children,
    childrenSize,
  } = getMaxDimensions(container.children)

  const N = children.length
  if (N === 0) return

  const dimension = 'width'
  const position = 'x'

  const totalSpace = Math.max(options?.minSize || 0, childrenSize[dimension])
  const leftOverSpace = (totalSpace - childrenSize[dimension]) / (N + 1)
  const gap = options?.gap ?? leftOverSpace

  let posX = 0
  children.forEach((child) => {
    child[position] = posX
    posX += child[dimension] + gap
  })
}

export function flexRowReverse (
  container: Container,
  options: IBaseOptions,
): void {

  const {
    children,
    childrenSize,
  } = getMaxDimensions(container.children)

  const N = children.length
  if (N === 0) return

  const dimension = 'width'
  const position = 'x'

  const totalSpace = Math.max(options?.minSize || 0, childrenSize[dimension])
  const leftOverSpace = (totalSpace - childrenSize[dimension]) / (N + 1)
  const gap = options?.gap ?? leftOverSpace

  children.reverse()
  let posX = totalSpace
  children.forEach((child) => {
    child[position] = posX - child[dimension]
    posX -= child[dimension] + gap
  })
}

export function flexColumn (
  container: Container,
  options: IBaseOptions,
): void {

  const {
    children,
    childrenSize,
  } = getMaxDimensions(container.children)

  const N = children.length
  if (N === 0) return

  const position = 'y'
  const dimension = 'height'

  const totalSpace = Math.max(options?.minSize || 0, childrenSize[dimension])
  const leftOverSpace = (totalSpace - childrenSize[dimension]) / (N + 1)
  const gap = options?.gap ?? leftOverSpace

  let pos = 0
  children.forEach((child) => {
    child[position] = pos
    pos += child[dimension] + gap
  })
}

export function flexColumnReverse (
  container: Container,
  options: IBaseOptions,
): void {

  const {
    children,
    childrenSize,
  } = getMaxDimensions(container.children)

  const N = children.length
  if (N === 0) return

  const dimension = 'height'
  const position = 'y'

  const totalSpace = Math.max(options?.minSize || 0, childrenSize[dimension])
  const leftOverSpace = (totalSpace - childrenSize[dimension]) / (N + 1)
  const gap = options?.gap ?? leftOverSpace

  children.reverse()
  let posX = totalSpace
  children.forEach((child) => {
    child[position] = posX - child[dimension]
    posX -= child[dimension] + gap
  })
}
