import { Container, Sprite } from 'pixi.js'
import { CONFIG } from '@/config'
import { Cell } from '@/screens/main/cell'
import textures from '@/textures'

const pieceCount = CONFIG.rows * CONFIG.cols

export class Board extends Sprite {
  private pieces: Sprite[]
  private cells: Cell[]
  private main: Container
  constructor () {
    super(textures.board)

    this.main = new Container()
    this.addChild(this.main)

    this.pieces = []
    for (let i = 0; i < pieceCount; i++) {
      const piece = Sprite.from(textures.empty)
      this.main.addChild(piece)
      this.pieces.push(piece)
    }

    this.cells = []
  }

  public resize (width: number, height: number) {
    this.main.x = this.bounds.minX
    this.main.y = this.bounds.minY

    const padding = CONFIG.board.padding

    for (let i = 0; i < this.pieces.length; i++) {
      const piece = this.pieces[i]
      const x = i % CONFIG.cols
      const y = Math.floor(i / CONFIG.rows)
      piece.x = padding + x * piece.width
      piece.y = padding + y * piece.height
    }

    for (let i = 0; i < this.cells.length; i++) {
      const cell = this.cells[i]
      const x = i % CONFIG.cols
      const y = Math.floor(i / CONFIG.rows)
      cell.x = padding + x * cell.width
      cell.y = padding + y * cell.height
      cell.resize(width, height)
    }
  }

  public createNumber () {
    const cell = new Cell()
    this.main.addChild(cell)
    this.cells.push(cell)
  }

}
