import { ZINC } from '∆/utils/colors'
import { Container, Sprite } from 'pixi.js'
import { Empty } from '@/empty'
import { renderSquare } from '@/square'

export class Board extends Sprite {
  private pieces: Empty[]
  private main: Container
  constructor (boardSize: number, pieceSize: number) {
    super(renderSquare(boardSize, boardSize, 10, ZINC[700]))

    this.main = new Container()
    this.addChild(this.main)

    this.pieces = []
    for (let i = 0; i < 16; i++) {
      const piece = new Empty(pieceSize)
      this.main.addChild(piece)
      this.pieces.push(piece)
    }
  }

  public resize (width: number, height: number) {
    this.main.x = this.bounds.minX
    this.main.y = this.bounds.minY

    for (let i = 0; i < 16; i++) {
      const piece = this.pieces[i]
      const x = i % 4
      const y = Math.floor(i / 4)
      piece.x = x * piece.width
      piece.y = y * piece.height
    }
  }

}
