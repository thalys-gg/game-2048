import { FlatGrid } from '∆/lib/flat-grid'
import { Container, Sprite } from 'pixi.js'
import { CONFIG } from '@/config'
import textures from '@/textures'

const pieceCount = CONFIG.rows * CONFIG.cols

export class Board extends Sprite {
  public pieces: FlatGrid<Sprite>
  private main: Container
  constructor () {
    super(textures.board)

    this.main = new Container()
    this.addChild(this.main)

    this.pieces = new FlatGrid(CONFIG.cols, CONFIG.rows)
    for (let i = 0; i < pieceCount; i++) {
      const piece = Sprite.from(textures.empty)
      this.main.addChild(piece)
      this.pieces.setAtIndex(i, piece)
    }
  }

  public resize (width: number, height: number) {
    this.main.x = this.bounds.minX
    this.main.y = this.bounds.minY

    const padding = CONFIG.board.padding

    this.pieces.forEach((piece, x, y) => {
      piece.x = padding + x * piece.width
      piece.y = padding + y * piece.height
    })
  }
}
