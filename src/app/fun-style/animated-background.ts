import { PContainer } from '∆/rosetta-stone/PixiJS'
import { container, squareRounded } from '@/fun-style/core'
import { display } from '@/fun-style/display'
import { gridGeometryShapes } from '@/fun-style/fx-geometric-patterns'
import { gradWaves } from '@/fun-style/fx-wave'
import { gradBase1, gradBase2, gradBase3, linGrad } from '@/fun-style/gradient'
import { fxFloatingParticles } from '@/fun-style/particle'

export function animBg () {
  const c = container()

  return display()
    .add(c)
    .add(linGrad(), c)
    .add(squareRounded({
      alpha: 0,
    }), c)
    .container()
}

export function animBgFloatingParticles () {
  const c = container()

  return display()
    .add(c)
    .add(gradBase1(), c)
    .add(fxFloatingParticles(), c)
    .container()
}

export function animBgGradientWaves () {
  const c = container()

  return display()
    .add(c)
    .add(gradBase2(), c)
    .add(gradWaves(), c)
    .container()
}

export function animBgGeometricPatterns () {
  const c = new PContainer()

  return display()
    .add(c)
    .add(gradBase3(), c)
    .add(gridGeometryShapes(), c)
    .container()
}
