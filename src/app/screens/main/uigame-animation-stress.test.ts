import type { Direction } from '@/lib/types'
import { FlatGrid } from '@thalys/pixi-shared/lib/flat-grid'
import { describe, expect, it } from 'vitest'
import { CONFIG } from '@/config'
import { GameFlatGrid } from '@/lib/game-flat-grid'
import type { MovePlan } from '@/lib/game-move-plan'

const DIRECTIONS: Direction[] = ['up', 'down', 'left', 'right']

/** Simulates Pixi: destroyed display objects reject property writes. */
class MockPawn {
  private _x = 0
  private _y = 0
  private alive = true

  public destroyed = false
  public value: number
  public coords: { x: number; y: number }

  constructor(value: number, coords: { x: number; y: number }) {
    this.value = value
    this.coords = coords
    this._x = coords.x
    this._y = coords.y
  }

  public get x() {
    return this._x
  }

  public set x(value: number) {
    if (!this.alive) {
      throw new TypeError("Cannot set properties of null (setting 'x')")
    }
    this._x = value
  }

  public get y() {
    return this._y
  }

  public set y(value: number) {
    if (!this.alive) {
      throw new TypeError("Cannot set properties of null (setting 'y')")
    }
    this._y = value
  }

  public async slideTo(x: number, y: number) {
    this.x = x
    this.y = y
  }

  public async mergeSlam(newValue: number) {
    this.value = newValue
  }

  public async fadeOutAndShrink() {}

  public async shakeFromImpact() {}

  public resize(coords?: { x: number; y: number }) {
    if (coords) {
      this.coords = coords
    }
    this.x = this.coords.x
    this.y = this.coords.y
  }

  public destroy() {
    this.destroyed = true
    this.alive = false
  }
}

function createPositions() {
  const positions = new FlatGrid<{ x: number; y: number }>(CONFIG.cols, CONFIG.rows)
  const stride = CONFIG.piece.size + CONFIG.piece.padding

  for (let y = 0; y < CONFIG.rows; y++) {
    for (let x = 0; x < CONFIG.cols; x++) {
      positions.set(x, y, {
        x: x * stride + CONFIG.piece.size / 2,
        y: y * stride + CONFIG.piece.size / 2,
      })
    }
  }

  return positions
}

function resizeLikeUIGame(
  grid: GameFlatGrid<MockPawn>,
  positions: FlatGrid<{ x: number; y: number }>,
  options: { skipDestroyed?: boolean } = {},
) {
  grid.forEach((pawn, x, y) => {
    if (!pawn) return
    if (options.skipDestroyed && pawn.destroyed) return

    const pos = positions.get(x, y)
    if (!pos) {
      throw new Error(`Invalid position x:${x} y:${y}`)
    }

    pawn.x = pos.x
    pawn.y = pos.y
    pawn.resize(pos)
  })
}

function purgePawnFromGrid(grid: GameFlatGrid<MockPawn>, pawn: MockPawn) {
  grid.forEach((cell, x, y) => {
    if (cell === pawn) {
      grid.set(x, y, null)
    }
  })
}

async function playMerge(
  grid: GameFlatGrid<MockPawn>,
  plan: MovePlan<MockPawn>,
  merge: MovePlan<MockPawn>['merges'][number],
  options: { purgeMerged: boolean; resizeAfterDestroy: boolean },
) {
  await merge.merged.fadeOutAndShrink()
  await merge.survivor.mergeSlam(merge.newValue)

  if (options.purgeMerged) {
    purgePawnFromGrid(grid, merge.merged)
  }

  merge.merged.destroy()

  if (options.resizeAfterDestroy) {
    resizeLikeUIGame(grid, createPositions(), { skipDestroyed: options.purgeMerged })
  }
}

async function playMove(
  grid: GameFlatGrid<MockPawn>,
  positions: FlatGrid<{ x: number; y: number }>,
  direction: Direction,
  options: { purgeMerged: boolean; resizeAfterDestroy: boolean },
) {
  const plan = grid.planMove(direction)
  if (!plan.moved) return false

  await Promise.all(
    plan.slides.map(async slide => {
      const pos = positions.get(slide.toX, slide.toY)
      if (!pos) throw new Error('missing slide target')
      await slide.pawn.slideTo(pos.x, pos.y)
    }),
  )

  for (const merge of plan.merges) {
    await playMerge(grid, plan, merge, options)
  }

  grid.applyPlan(plan)

  for (const { x, y, pawn } of plan.placements) {
    const pos = positions.get(x, y)
    if (!pos) throw new Error('missing placement target')
    pawn.resize(pos)
  }

  return true
}

function place(grid: GameFlatGrid<MockPawn>, positions: FlatGrid<{ x: number; y: number }>, cells: [number, number, number][]) {
  for (const [x, y, value] of cells) {
    const pos = positions.get(x, y)
    if (!pos) throw new Error('missing cell position')
    const pawn = new MockPawn(value, pos)
    grid.set(x, y, pawn)
  }
}

function mulberry32(seed: number) {
  let state = seed

  return () => {
    state |= 0
    state = (state + 0x6d2b79f5) | 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

describe('uigame animation stress', () => {
  it('reproduces the resize crash when merged tiles are destroyed but left in the grid', async () => {
    const grid = new GameFlatGrid<MockPawn>(CONFIG.cols, CONFIG.rows)
    const positions = createPositions()

    place(grid, positions, [
      [0, 0, 2],
      [1, 0, 2],
    ])

    await expect(
      playMove(grid, positions, 'left', { purgeMerged: false, resizeAfterDestroy: true }),
    ).rejects.toThrow("Cannot set properties of null (setting 'x')")
  })

  it('survives resize after merge when destroyed tiles are purged from the grid', async () => {
    const grid = new GameFlatGrid<MockPawn>(CONFIG.cols, CONFIG.rows)
    const positions = createPositions()

    place(grid, positions, [
      [0, 0, 2],
      [1, 0, 2],
    ])

    await expect(
      playMove(grid, positions, 'left', { purgeMerged: true, resizeAfterDestroy: true }),
    ).resolves.toBe(true)
  })

  it('survives many random moves with resize fired after each merge destroy', async () => {
    const rand = mulberry32(0x2048)
    const positions = createPositions()

    for (let run = 0; run < 25; run++) {
      const grid = new GameFlatGrid<MockPawn>(CONFIG.cols, CONFIG.rows)
      place(grid, positions, [
        [0, 0, 2],
        [3, 3, 2],
      ])

      for (let step = 0; step < 40; step++) {
        const direction = DIRECTIONS[Math.floor(rand() * DIRECTIONS.length)] ?? 'left'

        await expect(
          playMove(grid, positions, direction, {
            purgeMerged: true,
            resizeAfterDestroy: true,
          }),
        ).resolves.not.toThrow()

        resizeLikeUIGame(grid, positions, { skipDestroyed: true })
      }
    }
  })

  it('finds merge+resize failures across seeded board layouts', async () => {
    const rand = mulberry32(0xbeef)
    const positions = createPositions()
    const layouts: [number, number, number][][] = [
      [
        [0, 0, 2],
        [1, 0, 2],
      ],
      [
        [0, 0, 2],
        [0, 1, 2],
      ],
      [
        [2, 0, 2],
        [3, 0, 2],
        [0, 3, 2],
        [1, 3, 2],
      ],
      [
        [0, 0, 2],
        [1, 0, 2],
        [2, 0, 2],
        [3, 0, 2],
      ],
    ]

    for (const cells of layouts) {
      const grid = new GameFlatGrid<MockPawn>(CONFIG.cols, CONFIG.rows)
      place(grid, positions, cells)

      for (let step = 0; step < 12; step++) {
        const direction = DIRECTIONS[Math.floor(rand() * DIRECTIONS.length)] ?? 'left'

        await expect(
          playMove(grid, positions, direction, {
            purgeMerged: true,
            resizeAfterDestroy: true,
          }),
        ).resolves.not.toThrow()
      }
    }
  })
})