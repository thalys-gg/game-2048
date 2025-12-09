import type { Sprite } from 'pixi.js'
import { rollFloat } from '∆/utils/random'
import { Container } from 'pixi.js'
import { CONFIG } from '@/config'
import { GameFlatGrid } from '@/screens/main/flat-grid'
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

  public start () {
    this.spawnPiece()
    this.spawnPiece()
  }

  /**
   * Spawns a new piece in a random empty cell
   */
  public spawnPiece () {
    const coord = this.grid.getRandomEmpty()
    if (!coord) return

    const cell = new UIPawn()
    this.addChild(cell)

    const piece = this._positions.get(coord.x, coord.y)
    if (!piece) return

    cell.x = piece.x
    cell.y = piece.y
    this.grid.set(coord.x, coord.y, cell)
  }
}
