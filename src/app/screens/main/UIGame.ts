import type { FlatGrid } from '@thalys/pixi-shared/lib/flat-grid'
import type { IChild, ResizeSignature } from '@thalys/pixi-shared/types'
import type { Sprite } from 'pixi.js'
import type { Direction } from '@/lib/types'
import { logger } from '@thalys/logger'
import { waitFor } from '@thalys/pixi-shared/lib/promise'
import { Container } from 'pixi.js'
import { CONFIG } from '@/config'
import actions from '@/lib/actions'
import { GameFlatGrid } from '@/lib/game-flat-grid'
import type { MovePlan, PawnMerge } from '@/lib/game-move-plan'
import { rollNewPawnValue } from '@/lib/math'
import { STATE } from '@/screens/main/state'
import { UIPawn } from '@/screens/main/UIPawn'

const log = logger.custom`[ ${'UIGame'} ]`

export class UIGame extends Container implements IChild {
  private grid: GameFlatGrid<UIPawn>
  private positions: FlatGrid<Sprite>
  private _isAnimating = false

  constructor(positions: FlatGrid<Sprite>) {
    super()
    this.positions = positions
    this.grid = new GameFlatGrid<UIPawn>(CONFIG.cols, CONFIG.rows)
    this.grid.onMerge = (value: number) => {
      STATE.score += value
    }
  }

  public get isAnimating() {
    return this._isAnimating
  }

  public resize({ screen, parent }: ResizeSignature) {
    this.grid.forEach((pawn, x, y) => {
      if (!pawn || pawn.destroyed) return

      const pos = this.positions.get(x, y)
      if (!pos) {
        throw new Error(`[UIGame.resize] Invalid position x:${x} y:${y}`)
      }
      pawn.x = pos.x
      pawn.y = pos.y
      pawn.resize()
    })
  }

  public async show() {
    await Promise.all([this.spawnPiece(), this.spawnPiece()])

    // STATE.score = 1238
    // this.debugFillBoard(
    // [1024, 64, 8, 128, 256, 32, 256, 16, 2, 4, 8, 512, null, 4, 1024, 16],
    // [2048, 2048, 8, 128, 256, 32, 256, 16, 2, 4, 8, 512, null, 4, 1024, 16],
    // )
    // await waitFor(2)
    // actions.showGameOver()
  }

  public async resume() {
    if (this.hasWon()) {
      this.reset()
    } else if (this.hasLost()) {
      this.reset()
    }
  }

  public reset() {
    STATE.score = 0
    this.grid.forEach((pawn, x, y) => {
      if (!pawn) return
      this.positions.get(x, y)?.removeChild(pawn)
      pawn.destroy()
    })
    this.grid = new GameFlatGrid<UIPawn>(CONFIG.cols, CONFIG.rows)
    this.grid.onMerge = (value: number) => {
      STATE.score += value
    }
  }

  public async move(direction: Direction) {
    if (this._isAnimating) return

    const plan = this.grid.planMove(direction)
    if (!plan.moved) return

    this._isAnimating = true
    try {
      await this.playMoveAnimations(plan)
      this.grid.applyPlan(plan)
      this.syncPlacements(plan)

      if (!this.grid.getRandomEmpty()) {
        await this.checkGameState()
        return
      }

      await this.spawnPiece()
      await this.checkGameState()
    } finally {
      this._isAnimating = false
    }
  }

  private syncPlacements(plan: MovePlan<UIPawn>) {
    for (const { x, y, pawn } of plan.placements) {
      const pos = this.positions.get(x, y)
      if (!pos) {
        throw new Error(`[UIGame.syncPlacements] Invalid position x:${x} y:${y}`)
      }
      pawn.resize(pos)
    }
  }

  private async playMoveAnimations(plan: MovePlan<UIPawn>) {
    await Promise.all(
      plan.slides.map(async slide => {
        const pos = this.positions.get(slide.toX, slide.toY)
        if (!pos) {
          throw new Error(
            `[UIGame.playMoveAnimations] Invalid position x:${slide.toX} y:${slide.toY}`,
          )
        }
        await slide.pawn.slideTo(pos.x, pos.y)
      }),
    )

    const neighborShakes = this.collectMergeNeighborShakes(plan)

    await Promise.all([
      ...plan.merges.map(async merge => this.playMergeAnimation(merge)),
      ...neighborShakes.map(async ({ pawn, impactX, impactY }) =>
        pawn.shakeFromImpact(impactX, impactY),
      ),
    ])
  }

  private collectMergeNeighborShakes(plan: MovePlan<UIPawn>) {
    const shaken = new Set<UIPawn>()
    const shakes: { pawn: UIPawn; impactX: number; impactY: number }[] = []

    for (const merge of plan.merges) {
      const impact = this.positions.get(merge.toX, merge.toY)
      if (!impact) {
        throw new Error(
          `[UIGame.collectMergeNeighborShakes] Invalid position x:${merge.toX} y:${merge.toY}`,
        )
      }

      for (const neighbor of this.getMergeNeighbors(merge, plan)) {
        if (shaken.has(neighbor)) continue
        shaken.add(neighbor)
        shakes.push({ pawn: neighbor, impactX: impact.x, impactY: impact.y })
      }
    }

    return shakes
  }

  private getMergeNeighbors(merge: PawnMerge<UIPawn>, plan: MovePlan<UIPawn>) {
    const byCell = new Map<string, UIPawn>()
    for (const { x, y, pawn } of plan.placements) {
      byCell.set(`${x},${y}`, pawn)
    }

    const neighbors: UIPawn[] = []
    for (const [dx, dy] of [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ]) {
      const x = merge.toX + dx
      const y = merge.toY + dy
      if (x < 0 || y < 0 || x >= CONFIG.cols || y >= CONFIG.rows) continue

      const pawn = byCell.get(`${x},${y}`)
      if (pawn && pawn !== merge.survivor && pawn !== merge.merged) {
        neighbors.push(pawn)
      }
    }

    return neighbors
  }

  private async playMergeAnimation(merge: PawnMerge<UIPawn>) {
    await Promise.all([
      merge.merged.fadeOutAndShrink(),
      merge.survivor.mergeSlam(merge.newValue),
    ])
    this.purgePawnFromGrid(merge.merged)
    merge.merged.destroy()
    this.grid.onMerge?.(merge.newValue)
  }

  private purgePawnFromGrid(pawn: UIPawn) {
    this.grid.forEach((cell, x, y) => {
      if (cell === pawn) {
        this.grid.set(x, y, null)
      }
    })
  }

  private hasWon() {
    return this.grid.some(pawn => (pawn?.value || 0) >= CONFIG.winningValue)
  }

  private hasLost() {
    return !this.grid.hasPossibleMoves()
  }

  private async checkGameState() {
    if (this.hasWon()) {
      await waitFor(0.3)
      actions.showGameWon()
    } else if (this.hasLost()) {
      await waitFor(0.3)
      actions.showGameOver()
    }
  }

  /**
   * Fills the board for debugging end-game scenarios.
   *
   * @param pattern - Optional 2D array of values (0 = empty cell). If not provided, fills with random values leaving 1
   *   empty cell.
   */
  public debugFillBoard(pattern?: (number | null)[]) {
    // Clear existing pawns
    this.grid.forEach((pawn, x, y) => {
      if (pawn) {
        pawn.removeFromParent()
        pawn.destroy()
        this.grid.set(x, y, null)
      }
    })

    if (pattern) {
      // Use provided pattern
      for (let i = 0; i < pattern.length; i++) {
        const { x, y } = this.grid.getXY(i)
        this.createPawnAt(x, y, pattern[i])
      }
    } else {
      // Fill with random values, leaving 1 empty cell
      const emptyIndex = Math.floor(Math.random() * (CONFIG.cols * CONFIG.rows))
      let index = 0

      for (let y = 0; y < CONFIG.rows; y++) {
        for (let x = 0; x < CONFIG.cols; x++) {
          if (index !== emptyIndex) {
            const value = 2 ** Math.floor(Math.random() * 10 + 1) // 2 to 2048
            this.createPawnAt(x, y, value)
          }
          index++
        }
      }
    }
  }

  /** Spawns a new piece in a random empty cells */
  public async spawnPiece() {
    const coord = this.grid.getRandomEmpty()
    if (!coord) {
      throw new Error('[UIGame.spawnPiece] No empty cells found')
    }

    const pawn = this.createPawnAt(coord.x, coord.y, rollNewPawnValue())
    await pawn.spawnIn()
    return pawn
  }

  /** Creates a pawn at the specified grid position. */
  private createPawnAt(x: number, y: number, value: null): void
  private createPawnAt(x: number, y: number, value: number): UIPawn
  private createPawnAt(x: number, y: number, value: number | null): UIPawn | void
  private createPawnAt(x: number, y: number, value: number | null): UIPawn | void {
    if (value === null) {
      this.grid.set(x, y, null)
      return
    }

    const pos = this.positions.get(x, y)
    if (!pos) {
      throw new Error(`[UIGame.createPawnAt] Invalid position x:${x} y:${y}`)
    }
    const pawn = new UIPawn(value, pos)
    this.grid.set(x, y, pawn)
    this.addChild(pawn)
    return pawn
  }
}