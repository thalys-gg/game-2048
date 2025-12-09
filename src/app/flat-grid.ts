import type { Sprite } from 'pixi.js'
import type { UIPawn } from '@/screens/main/UIPawn'
import { FlatGrid } from '∆/lib/flat-grid'


export class GameFlatGrid<T extends UIPawn> extends FlatGrid<T> {


  public getRandomEmpty () {
    return this.getRandomLocation(value => value === null || value === undefined)
  }

  public override clone (): GameFlatGrid<T> {
    const newGrid = new GameFlatGrid<T>(this.width, this.height)
    newGrid.setRawData([...this.data])
    return newGrid
  }

  public moveLeft (positions: FlatGrid<Sprite>): boolean {
    let moved = false

    for (let y = 0; y < this.height; y++) {
      // Collect non-null values in this row
      const row: T[] = []
      for (let x = 0; x < this.width; x++) {
        const cell = this.get(x, y)
        if (cell) {
          row.push(cell)
        }
      }

      // Merge logic
      const merged = this.mergeLine(row)

      // Place back
      for (let x = 0; x < this.width; x++) {
        const newCell = merged[x] ?? null
        const oldCell = this.get(x, y)

        if (newCell !== oldCell) moved = true

        this.set(x, y, newCell as T)

        if (newCell) {
          const pos = positions.get(x, y)!
          // Animate to new position
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
        // Merge: double the value, remove the second
        line[i].value *= 2
        result.push(line[i])
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
