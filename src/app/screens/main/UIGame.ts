import type { FlatGrid } from '∆/lib/flat-grid'
import type { IChild, ResizeSignature } from '∆/navigation.types'
import type { Sprite } from 'pixi.js'
import type { Direction } from '@/lib/types'
import { anime } from '@thalys/anime-pixi'
import { Container } from 'pixi.js'
import { CONFIG } from '@/config'
import { GameFlatGrid } from '@/lib/game-flat-grid'
import { rollNewPawnValue } from '@/lib/math'
import { UIPawn } from '@/screens/main/UIPawn'

export class UIGame extends Container implements IChild {
  private grid: GameFlatGrid<UIPawn>
  private positions: FlatGrid<Sprite>
  constructor (positions: FlatGrid<Sprite>) {
    super()
    this.positions = positions
    this.grid = new GameFlatGrid<UIPawn>(CONFIG.cols, CONFIG.rows)
  }

  public resize ({ screen, parent }: ResizeSignature) {
    this.grid.forEach((pawn, x, y) => {
      if (!pawn) return

      const pos = this.positions.get(x, y)
      if (!pos) {
        throw new Error(`[UIGame.resize] Invalid position x:${x} y:${y}`)
      }
      pawn.x = pos.x
      pawn.y = pos.y
      pawn.resize()
    })
  }

  public async show () {
    const pawns = [
      this.spawnPiece(),
      this.spawnPiece(),
    ]
  }

  /**
   * Spawns a new piece in a random empty cells
   */
  public spawnPiece () {
    const coord = this.grid.getRandomEmpty()
    if (!coord) {
      throw new Error('[UIGame.spawnPiece] No empty cells found')
    }

    const pos = this.positions.get(coord.x, coord.y)
    if (!pos) {
      throw new Error(`[UIGame.spawnPiece] Invalid position x:${coord.x} y:${coord.y}`)
    }
    const pawn = new UIPawn(rollNewPawnValue(), pos)
    this.grid.set(coord.x, coord.y, pawn)
    this.addChild(pawn)

    pawn.alpha = 0
    anime`fade-in`(pawn).play()
    return pawn
  }

  public move (direction: Direction) {
    const moved = this.grid.move(direction, this.positions)

    if (moved) {
      this.spawnPiece()
      this.checkGameState()
    }
  }

  private checkGameState () {


  }
}
