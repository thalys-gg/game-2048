import type { Sprite } from 'pixi.js'
import type { Direction } from '@/lib/types'
import type { UIPawn } from '@/screens/main/UIPawn'
import { FlatGrid } from '@thalys/pixi-shared/lib/flat-grid'

export class GameFlatGrid<T extends UIPawn> extends FlatGrid<T> {
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

  public move(direction: Direction, positions: FlatGrid<Sprite>): boolean {
    let moved = false
    const isHorizontal = direction === 'left' || direction === 'right'
    const isReverse = direction === 'right' || direction === 'down'

    const primarySize = isHorizontal ? this.height : this.width
    const secondarySize = isHorizontal ? this.width : this.height

    for (let i = 0; i < primarySize; i++) {
      const line: T[] = []

      // Collect non-null values
      for (let j = 0; j < secondarySize; j++) {
        const idx = isReverse ? secondarySize - 1 - j : j
        const [x, y] = isHorizontal ? [idx, i] : [i, idx]
        const cell = this.get(x, y)
        if (cell) line.push(cell)
      }

      const merged = this.mergeLine(line)

      // Place back and update positions
      for (let j = 0; j < secondarySize; j++) {
        const idx = isReverse ? secondarySize - 1 - j : j
        const [x, y] = isHorizontal ? [idx, i] : [i, idx]
        const newCell = merged[j] ?? null
        const oldCell = this.get(x, y)

        if (newCell !== oldCell) moved = true
        this.set(x, y, newCell)

        if (newCell) {
          const pos = positions.get(x, y)!
          newCell.x = pos.x
          newCell.y = pos.y
        }
      }
    }

    return moved
  }

  public mergeLine(line: T[]): (T | null)[] {
    const result: (T | null)[] = []
    let i = 0

    while (i < line.length) {
      if (i + 1 < line.length && line[i].value === line[i + 1].value) {
        const pawn = line[i]

        // Merge: double the value, remove the second
        pawn.value *= 2
        this.onMerge?.(pawn.value)
        result.push(pawn)
        line[i + 1].destroy()
        i += 2
      } else {
        result.push(line[i])
        i++
      }
    }

    // Pad with nulls
    while (result.length < this.width) {
      result.push(null)
    }

    return result
  }
}
