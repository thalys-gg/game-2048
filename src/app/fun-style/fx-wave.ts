import type { PTicker } from '∆/rosetta-stone/PixiJS'
import type { DisplayChild, DisplayChildMethods } from '@/fun-style/types'
import { PContainer, PGraphics } from '∆/rosetta-stone/PixiJS'
import { engine } from '@/getEngine'

export interface WavePoint {
  x: number
  baseY: number
  phase: number
  amplitude: number
}

export const createWavePoints = (width: number, height: number, waveIndex: number): WavePoint[] => {
  const pointCount = 20
  const points: WavePoint[] = []

  for (let i = 0; i <= pointCount; i++) {
    points.push({
      x: (width / pointCount) * i,
      baseY: height * (0.3 + waveIndex * 0.2),
      phase: (i / pointCount) * Math.PI * 2,
      amplitude: 30 + waveIndex * 10,
    })
  }

  return points
}

export const updateWave = (
  graphics: PGraphics,
  points: WavePoint[],
  time: number,
  color: number,
  alpha: number,
  screenHeight: number,
): void => {
  graphics.clear()

  graphics.moveTo(points[0].x, points[0].baseY + Math.sin(time + points[0].phase) * points[0].amplitude)

  for (let i = 1; i < points.length; i++) {
    const y = points[i].baseY + Math.sin(time + points[i].phase) * points[i].amplitude
    graphics.lineTo(points[i].x, y)
  }

  graphics.lineTo(points[points.length - 1].x, screenHeight)
  graphics.lineTo(0, screenHeight)
  graphics.closePath()
  graphics.fill({ color, alpha })
}

export function gradWaves (): DisplayChild {
  const c = new PContainer()

  const { screen } = engine()

  let time = 0

  // Create waves
  const waveColors = [0x3A1C71, 0xD76D77, 0xFFAF7B]
  const waves = waveColors.map((color, index) => {
    const graphics = new PGraphics()
    const points = createWavePoints(screen.width, screen.height, index)
    return { graphics, points, color, index }
  })

  waves.forEach(wave => c.addChild(wave.graphics))

  return Object.assign(c, {
    ...c,
    onInit: () => {
      c.label = 'gradWaves'
      return c
    },
    onResize: ({ sw, sh }) => {
      waves.forEach((wave) => {
        wave.points = createWavePoints(sw, sh, wave.index)
      })
    },
    onUpdate: (ticker: PTicker) => {
      time += 0.02 * ticker.deltaTime

      waves.forEach(({ graphics, points, color, index }) => {
        const alpha = 0.3 - index * 0.05
        const speed = 1 - index * 0.2
        updateWave(graphics, points, time * speed, color, alpha, screen.height)
      })
    },
  } satisfies DisplayChildMethods)
}
