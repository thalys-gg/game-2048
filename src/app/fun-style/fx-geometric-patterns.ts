import type { PTicker } from '∆/rosetta-stone/PixiJS'
import type { PropsFnBase } from '@/fun-style/core'
import type { DisplayChildMethods } from '@/fun-style/types'
import { PContainer, PGraphics } from '∆/rosetta-stone/PixiJS'
import { engine } from '@/getEngine'

export interface GeometricShape {
  x: number
  y: number
  rotation: number
  scale: number
  rotationSpeed: number
  graphics: PGraphics
  type: 'hexagon' | 'triangle' | 'square'
}

export const drawHexagon = (graphics: PGraphics, size: number): void => {
  const points: number[] = []
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i
    points.push(Math.cos(angle) * size, Math.sin(angle) * size)
  }
  graphics.poly(points)
}

export const drawTriangle = (graphics: PGraphics, size: number): void => {
  graphics.poly([
    0,
    -size,
    -size * 0.866,
    size * 0.5,
    size * 0.866,
    size * 0.5,
  ])
}

export const drawSquare = (graphics: PGraphics, size: number): void => {
  graphics.rect(-size, -size, size * 2, size * 2)
}

export const createShape = (
  type: GeometricShape['type'],
  gridX: number,
  gridY: number,
  cellSize: number,
): GeometricShape => {
  const graphics = new PGraphics()
  const size = cellSize * 0.3

  switch (type) {
    case 'hexagon':
      drawHexagon(graphics, size)
      break
    case 'triangle':
      drawTriangle(graphics, size)
      break
    case 'square':
      drawSquare(graphics, size)
      break
  }

  graphics.stroke({ color: 0x4A5568, width: 2, alpha: 0.3 })
  graphics.fill({ color: 0x2D3748, alpha: 0.1 })

  return {
    x: gridX * cellSize + cellSize / 2,
    y: gridY * cellSize + cellSize / 2,
    rotation: Math.random() * Math.PI * 2,
    scale: 0.8 + Math.random() * 0.4,
    rotationSpeed: (Math.random() - 0.5) * 0.02,
    graphics,
    type,
  }
}

export const updateShape = (shape: GeometricShape, ticker: PTicker): void => {
  shape.rotation += shape.rotationSpeed * ticker.deltaTime
  shape.graphics.position.set(shape.x, shape.y)
  shape.graphics.rotation = shape.rotation
  shape.graphics.scale.set(shape.scale)
}

export const gridGeometryShapes = (opts?: PropsFnBase) => {
  const {
    label = 'gridGeometryShapes',
  } = opts || {}

  const c = new PContainer()
  const { screen } = engine()

  // Create grid of shapes
  const cellSize = 100
  const shapes: GeometricShape[] = []
  const shapeTypes: GeometricShape['type'][] = [
    'hexagon',
    'triangle',
    'square',
  ]

  const create = () => {
    // Clear existing shapes
    shapes.forEach(shape => shape.graphics.destroy())
    shapes.length = 0

    const cols = Math.ceil(screen.width / cellSize) + 1
    const rows = Math.ceil(screen.height / cellSize) + 1

    for (let x = -1; x < cols; x++) {
      for (let y = -1; y < rows; y++) {
        if (Math.random() > 0.5) {
          const type = shapeTypes[Math.floor(Math.random() * shapeTypes.length)]
          const shape = createShape(type, x, y, cellSize)
          shapes.push(shape)
          c.addChild(shape.graphics)
        }
      }
    }
  }

  return Object.assign(c, {
    ...c,
    onInit: () => {
      c.label = label
      create()
      return c
    },
    onResize: ({ sw, sh }) => {
      c.position.set(0)
      create()
    },
    onUpdate: (ticker: PTicker) => {
      shapes.forEach(shape => updateShape(shape, ticker))
    },
    onDestroy: () => {

    },
  } satisfies DisplayChildMethods)
}
