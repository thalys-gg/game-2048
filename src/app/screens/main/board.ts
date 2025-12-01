import { Container, Sprite } from 'pixi.js'
import { CONFIG } from '@/config'
import textures from '@/textures'

const pieceCount = CONFIG.rows * CONFIG.cols

export class Board extends Sprite {
  private pieces: Sprite[]
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
  }

  public resize (width: number, height: number) {
    this.main.x = this.bounds.minX
    this.main.y = this.bounds.minY

    const padding = CONFIG.board.padding

    for (let i = 0; i < this.pieces.length; i++) {
      const piece = this.pieces[i]
      const x = i % 4
      const y = Math.floor(i / 4)
      piece.x = padding + x * piece.width
      piece.y = padding + y * piece.height
    }
  }

}
