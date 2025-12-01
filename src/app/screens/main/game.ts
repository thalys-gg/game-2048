import type { Board } from '@/screens/main/board'
import { Sprite, Texture } from 'pixi.js'
import { CONFIG } from '@/config'
import { Cell } from '@/screens/main/cell'

export class Game extends Sprite {
  private grid: (Cell | null)[]
  private board: Board
  constructor (board: Board) {
    super(Texture.EMPTY)
    this.board = board
    this.width = board.width
    this.height = board.height
    this.x = this.board.x
    this.y = this.board.y

    this.grid = Array.from({ length: CONFIG.cols * CONFIG.rows }, () => null)
  }

  public resize (width: number, height: number) {


  }

  public start () {

  }

  /**
   * Spawns a new piece in a random empty cell
   */
  public spawnPiece () {
    const cell = new Cell()
    this.addChild(cell)

    const emptyCells = this.grid.filter(cell => cell === null)
    const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)]

  }
}
