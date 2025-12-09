import { FlatGrid } from '∆/lib/flat-grid'
import { Container, Sprite } from 'pixi.js'
import { CONFIG } from '@/config'
import textures from '@/textures'

const pieceCount = CONFIG.rows * CONFIG.cols

export class UIBoard extends Container {
  public pieces: FlatGrid<Sprite>
  private bg: Sprite
  constructor () {
    super()

    this.bg = Sprite.from(textures.board)
    this.bg.label = 'Background'
    this.pivot.set(0.5)
    this.addChild(this.bg)

    this.pieces = new FlatGrid(CONFIG.cols, CONFIG.rows)
    for (let i = 0; i < pieceCount; i++) {
      const piece = Sprite.from(textures.empty)
      piece.label = `Square-${i}`
      this.addChild(piece)
      this.pieces.setAtIndex(i, piece)
    }
  }

  public resize (width: number, height: number) {
    this.bg.x = this.bg.bounds.minX
    this.bg.y = this.bg.bounds.minY

    const padding = CONFIG.board.padding

    this.pieces.forEach((piece, x, y) => {
      piece.x = padding + x * piece.width
      piece.y = padding + y * piece.height
    })
  }
}
