import type { IChild, ResizeSignature } from '∆/navigation.types'
import { FlatGrid } from '∆/lib/flat-grid'
import { Container, Sprite } from 'pixi.js'
import { CONFIG } from '@/config'
import textures from '@/textures'

const pieceCount = CONFIG.rows * CONFIG.cols


function createBackground () {
  const bg = Sprite.from(textures.board)
  bg.label = 'Background'
  bg.alpha = 1
  bg.anchor.set(0.5)
  return bg
}

function createSquare (textureIndex: number, label: string, parent: Container) {
  const pawn = Sprite.from(textures.getPawn(textureIndex))
  pawn.label = label
  pawn.alpha = 1
  pawn.anchor.set(0.5)
  parent.addChild(pawn)
  return pawn
}

export class UIBoard extends Container implements IChild {

  public positions: FlatGrid<Sprite>
  private bg: Sprite
  constructor () {
    super()

    this.bg = createBackground()
    this.addChild(this.bg)

    this.positions = new FlatGrid(CONFIG.cols, CONFIG.rows)
    this.positions = this.positions
      .map((value, x, y, i) =>
        createSquare(0, `Square-${x}-${y}-${i}`, this))
  }

  public resize ({ screen }: ResizeSignature) {

    const center = { x: screen.width * 0.5, y: screen.height * 0.5 }

    this.bg.x = center.x
    this.bg.y = center.y

    const bgBounds = this.bg.getBounds()
    const startX = bgBounds.minX + CONFIG.board.padding
    const startY = bgBounds.minY + CONFIG.board.padding

    this.positions.forEach((pawn, x, y) => {
      if (!pawn) return
      const w = pawn.width
      const h = pawn.height
      pawn.x = startX + w * 0.5 + x * pawn.width
      pawn.y = startY + h * 0.5 + y * pawn.height
    })
  }
}
