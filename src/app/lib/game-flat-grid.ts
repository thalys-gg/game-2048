import type { Sprite } from 'pixi.js'
import type { Direction } from '@/lib/types'
import { FlatGrid } from '@thalys/pixi-shared/lib/flat-grid'
import type { MovePlan } from '@/lib/game-move-plan'
import { planLine } from '@/lib/game-move-plan'

export class GameFlatGrid<T extends { value: number }> extends FlatGrid<T> {
  public onMerge?: (value: number) => void

  public getRandomEmpty() {
    return this.getRandomLocation(value => value === null || value === undefined)
  }

  /**
   * Checks if there are possible moves left to be done. It checks if there are free spaces, and if not then proceeds to
   * check if any positions can be merged.
   *
   * @returns {boolean} True if there are possible moves, false otherwise.
   */
  public hasPossibleMoves(): boolean {
    // Check if there are free spaces
    if (this.data.some(cell => cell === null || cell === undefined)) {
      return true
    }

    // Check if any positions can be merged
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        const current = this.get(x, y)

        if (!current) continue

        // Check Right
        if (x + 1 < this.width) {
          const right = this.get(x + 1, y)
          if (right && current.value === right.value) {
            return true
          }
        }

        // Check Down
        if (y + 1 < this.height) {
          const down = this.get(x, y + 1)
          if (down && current.value === down.value) {
            return true
          }
        }
      }
    }

    return false
  }

  public override clone(): GameFlatGrid<T> {
    const newGrid = new GameFlatGrid<T>(this.width, this.height)
    newGrid.setRawData([...this.data])
    return newGrid
  }

  /** Computes slide/merge events and the post-move grid without mutating tile visuals. */
  public planMove(direction: Direction): MovePlan<T> {
    const slides: MovePlan<T>['slides'] = []
    const merges: MovePlan<T>['merges'] = []
    const placements: MovePlan<T>['placements'] = []
    const isHorizontal = direction === 'left' || direction === 'right'
    const isReverse = direction === 'right' || direction === 'down'

    const primarySize = isHorizontal ? this.height : this.width
    const secondarySize = isHorizontal ? this.width : this.height

    for (let lineIndex = 0; lineIndex < primarySize; lineIndex++) {
      const entries: { pawn: T; fromX: number; fromY: number }[] = []

      for (let j = 0; j < secondarySize; j++) {
        const idx = isReverse ? secondarySize - 1 - j : j
        const [x, y] = isHorizontal ? [idx, lineIndex] : [lineIndex, idx]
        const cell = this.get(x, y)
        if (cell) entries.push({ pawn: cell, fromX: x, fromY: y })
      }

      const destCells: { x: number; y: number }[] = []
      for (let j = 0; j < secondarySize; j++) {
        const idx = isReverse ? secondarySize - 1 - j : j
        const [x, y] = isHorizontal ? [idx, lineIndex] : [lineIndex, idx]
        destCells.push({ x, y })
      }

      const linePlan = planLine(entries, destCells)
      slides.push(...linePlan.slides)
      merges.push(...linePlan.merges)

      for (let j = 0; j < secondarySize; j++) {
        const pawn = linePlan.cells[j]
        if (!pawn) continue

        const dest = destCells[j]
        if (!dest) continue
        placements.push({ x: dest.x, y: dest.y, pawn })
      }
    }

    const moved = slides.length > 0 || merges.length > 0

    return { moved, slides, merges, placements }
  }

  /** Commits a planned move to the logical grid after animations finish. */
  public applyPlan(plan: MovePlan<T>) {
    for (let i = 0; i < this.data.length; i++) {
      this.data[i] = null
    }

    for (const { x, y, pawn } of plan.placements) {
      this.set(x, y, pawn)
    }
  }
}