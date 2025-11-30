import type { PropsFnBase } from '@/fun-style/core'
import type { DisplayChild, DisplayChildMethods } from '@/fun-style/types'
import { PContainer, PGraphics } from '∆/rosetta-stone/PixiJS'
import { engine } from '@/getEngine'

interface Particle {
  x: number
  y: number
  radius: number
  vx: number
  vy: number
  alpha: number
  graphics: PGraphics
}

const map = new Map<string, Particle>()

export const newParticle = (screenWidth: number, screenHeight: number): Particle => {
  const graphics = new PGraphics()
  const radius = Math.random() * 3 + 1

  return {
    x: Math.random() * screenWidth,
    y: Math.random() * screenHeight,
    radius,
    vx: (Math.random() - 0.5) * 0.5,
    vy: (Math.random() - 0.5) * 0.5,
    alpha: Math.random() * 0.3 + 0.1,
    graphics,
  }
}

export const updateParticle = (particle: Particle, screenWidth: number, screenHeight: number): void => {
  particle.x += particle.vx
  particle.y += particle.vy

  // Wrap around screen
  if (particle.x < -particle.radius) { particle.x = screenWidth + particle.radius }
  if (particle.x > screenWidth + particle.radius) { particle.x = -particle.radius }
  if (particle.y < -particle.radius) { particle.y = screenHeight + particle.radius }
  if (particle.y > screenHeight + particle.radius) { particle.y = -particle.radius }

  // Update graphics
  particle.graphics.clear()
  particle.graphics.circle(0, 0, particle.radius)
  particle.graphics.fill({ color: 0xFFFFFF, alpha: particle.alpha })
  particle.graphics.position.set(particle.x, particle.y)
}

export const createParticles = () => {
  const { screen } = engine()

  const particleCount = 50
  const particles: Particle[] = Array.from(
    { length: particleCount },
    () => newParticle(screen.width, screen.height),
  )

  return particles
}

export function fxFloatingParticles (opts?: PropsFnBase): DisplayChild {
  const {
    label = 'fxFloatingParticles',
  } = opts || {}

  const container = new PContainer()
  const particles = createParticles()

  return Object.assign(container, {
    ...container,
    onInit: () => {
      container.label = label

      particles.forEach((p) => {
        container.addChild(p.graphics)
      })

      return container
    },
    onResize: ({ sw, sh }) => {
      container.position.set(0)
    },
    onUpdate: () => {
      particles.forEach((p) => {
        updateParticle(p, screen.width, screen.height)
      })
    },
  } satisfies DisplayChildMethods)
}
