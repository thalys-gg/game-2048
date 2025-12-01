import type { Board } from '@/screens/main/board'
import { logger } from '@thalys/logger'
import { Container, Sprite, Texture } from 'pixi.js'
import { CONFIG } from '@/config'
import { Cell } from '@/screens/main/cell'
import { GameFlatGrid } from '@/screens/main/flat-grid'

export class Game extends Container {
  private grid: GameFlatGrid<Cell>
  private board: Board
  constructor (board: Board) {
    super()
    this.board = board
    this.grid = new GameFlatGrid(CONFIG.cols, CONFIG.rows)
  }

  public resize (width: number, height: number) {
    this.grid.forEach((cell, x, y) => {
      if (!cell) return
      // const piece = this.board.pieces.get(x, y)
      // if (!piece) return

      // cell.x = piece.x
      // cell.y = piece.y
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
    logger.info('spawnPiece', coord)
    if (!coord) return

    const cell = new Cell()
    this.addChild(cell)

    const piece = this.board.pieces.get(coord.x, coord.y)
    logger.info('spawnPiece', piece)
    if (!piece) return

    cell.x = piece.x
    cell.y = piece.y
    this.grid.set(coord.x, coord.y, cell)
    logger.info('spawnPiece', cell, coord)
  }
}
