import type { Sprite } from 'pixi.js'
import type { Direction } from '@/lib/types'
import type { UIPawn } from '@/screens/main/UIPawn'
import { FlatGrid } from '∆/lib/flat-grid'
import { Signal } from 'typed-signals'

export class GameFlatGrid<T extends UIPawn> extends FlatGrid<T> {

  public onMerge: Signal<(value: number) => void> = new Signal()

  public getRandomEmpty () {
    return this.getRandomLocation(value => value === null || value === undefined)
  }

  public override clone (): GameFlatGrid<T> {
    const newGrid = new GameFlatGrid<T>(this.width, this.height)
    newGrid.setRawData([...this.data])
    return newGrid
  }

  public move (direction: Direction, positions: FlatGrid<Sprite>): boolean {
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
        this.set(x, y, newCell as T)

        if (newCell) {
          const pos = positions.get(x, y)!
          newCell.x = pos.x
          newCell.y = pos.y
        }
      }
    }

    return moved
  }

  public mergeLine (line: T[]): (T | null)[] {
    const result: (T | null)[] = []
    let i = 0

    while (i < line.length) {
      if (i + 1 < line.length && line[i].value === line[i + 1].value) {
        const pawn = line[i]

        // Merge: double the value, remove the second
        pawn.value *= 2
        this.onMerge.emit(pawn.value)
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
