import type { FlatGrid } from '∆/lib/flat-grid'
import type { Sprite } from 'pixi.js'
import type { Direction } from '@/input'
import { Container } from 'pixi.js'
import { CONFIG } from '@/config'
import { GameFlatGrid } from '@/flat-grid'
import { rollNewPawnValue } from '@/math'
import { UIPawn } from '@/screens/main/UIPawn'

export class UIGame extends Container {
  private grid: GameFlatGrid<UIPawn>
  private _positions: FlatGrid<Sprite>
  constructor (positions: FlatGrid<Sprite>) {
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

    const cell = new UIPawn(rollNewPawnValue())
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
        return this.grid.moveLeft(this._positions)
      case 'right':
        return false
        // return this.moveRight()
    }
  }

  // Similar implementations for moveRight, moveUp, moveDown
  // moveRight: reverse row, mergeLine, reverse back
  // moveUp/moveDown: transpose, merge columns, transpose back

  private checkGameState () {
    // Check for win (2048 tile) or game over (no moves possible)
  }
}
