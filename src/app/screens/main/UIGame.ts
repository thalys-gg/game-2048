import type { UIBoard } from '@/screens/main/UIBoard'
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
  private board: UIBoard
  constructor (board: UIBoard) {
    super()
    this.board = board
    this.grid = new GameFlatGrid(CONFIG.cols, CONFIG.rows)
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

    const piece = this.board.pieces.get(coord.x, coord.y)
    if (!piece) return

    cell.x = piece.x
    cell.y = piece.y
    this.grid.set(coord.x, coord.y, cell)
  }
}
