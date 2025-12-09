import type { Sprite } from 'pixi.js'
import type { Direction } from '@/input'
import { rollFloat } from '∆/utils/random'
import { Container } from 'pixi.js'
import { CONFIG } from '@/config'
import { GameFlatGrid } from '@/flat-grid'
import { UIPawn } from '@/screens/main/UIPawn'

function createRandomNumber () {
  return rollFloat() >= 0.9 ? 4 : 2
}

export class UIGame extends Container {
  private grid: GameFlatGrid<UIPawn>
  private _positions: GameFlatGrid<Sprite>
  constructor (positions: GameFlatGrid<Sprite>) {
    super()
    this._positions = positions
    this.grid = new GameFlatGrid<UIPawn>(CONFIG.cols, CONFIG.rows)
  }

  public resize (width: number, height: number) {
    this.grid.forEach((cell, x, y) => {
      if (!cell) return
      cell.resize(width, height)
    })
  }

  public show () {
    this.spawnPiece()
    this.spawnPiece()
  }

  /**
   * Spawns a new piece in a random empty cell
   */
  public spawnPiece () {
    const coord = this.grid.getRandomEmpty()
    if (!coord) {
      throw new Error('[UIGame.spawnPiece] No empty cells found')
    }

    const pos = this._positions.get(coord.x, coord.y)
    if (!pos) {
      throw new Error(`[UIGame.spawnPiece] Invalid position x:${coord.x} y:${coord.y}`)
    }

    const cell = new UIPawn(createRandomNumber())
    cell.x = pos.x
    cell.y = pos.y

    this.grid.set(coord.x, coord.y, cell)
    this.addChild(cell)
  }

  public move (direction: Direction) {
    const moved = this._move(direction)

    if (moved) {
      this.spawnPiece()
      this.checkGameState()
    }
  }

  private _move (direction: Direction): boolean {

    switch (direction) {
      case 'up':
        return false
        // return this.moveUp()
      case 'down':
        return false
        // return this.moveDown()
      case 'left':
        return this.moveLeft()
      case 'right':
        return false
        // return this.moveRight()
    }
  }

  private moveLeft (): boolean {
    let moved = false

    for (let y = 0; y < CONFIG.rows; y++) {
      // Collect non-null values in this row
      const row: UIPawn[] = []
      for (let x = 0; x < CONFIG.cols; x++) {
        const cell = this.grid.get(x, y)
        if (cell) row.push(cell)
      }

      // Merge logic
      const merged = this.mergeLine(row)

      // Place back
      for (let x = 0; x < CONFIG.cols; x++) {
        const newCell = merged[x] ?? null
        const oldCell = this.grid.get(x, y)

        if (newCell !== oldCell) moved = true

        this.grid.set(x, y, newCell as UIPawn)

        if (newCell) {
          const pos = this._positions.get(x, y)!
          // Animate to new position
          newCell.x = pos.x
          newCell.y = pos.y
        }
      }
    }

    return moved
  }

  private mergeLine (line: UIPawn[]): (UIPawn | null)[] {
    const result: (UIPawn | null)[] = []
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
    while (result.length < CONFIG.cols) {
      result.push(null)
    }

    return result
  }

  // Similar implementations for moveRight, moveUp, moveDown
  // moveRight: reverse row, mergeLine, reverse back
  // moveUp/moveDown: transpose, merge columns, transpose back

  private checkGameState () {
    // Check for win (2048 tile) or game over (no moves possible)
  }
}
