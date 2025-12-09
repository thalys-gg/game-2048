import { Container, Sprite } from 'pixi.js'
import { CONFIG } from '@/config'
import { GameFlatGrid } from '@/flat-grid'
import textures from '@/textures'

const pieceCount = CONFIG.rows * CONFIG.cols

export class UIBoard extends Container {
  public positions: GameFlatGrid<Sprite>
  private bg: Sprite
  constructor () {
    super()

    this.bg = Sprite.from(textures.board)
    this.bg.label = 'Background'
    this.pivot.set(0.5)
    this.addChild(this.bg)

    this.positions = new GameFlatGrid(CONFIG.cols, CONFIG.rows)
    for (let i = 0; i < pieceCount; i++) {
      const piece = Sprite.from(textures.empty)
      piece.label = `Square-${i}`
      this.addChild(piece)
      this.positions.setAtIndex(i, piece)
    }
  }

  public resize (width: number, height: number) {
    this.bg.x = this.bg.bounds.minX
    this.bg.y = this.bg.bounds.minY

    const padding = CONFIG.board.padding

    this.positions.forEach((piece, x, y) => {
      piece.x = padding + x * piece.width
      piece.y = padding + y * piece.height
    })
  }
}
