import type { FlatGrid } from '∆/lib/flat-grid'
import type { IChild, ResizeSignature } from '∆/navigation.types'
import type { Sprite } from 'pixi.js'
import type { Direction } from '@/lib/types'
import { anime } from '@thalys/anime-pixi'
import { logger } from '@thalys/logger'
import { Container } from 'pixi.js'
import { CONFIG } from '@/config'
import { GameFlatGrid } from '@/lib/game-flat-grid'
import { rollNewPawnValue } from '@/lib/math'
import { STATE } from '@/screens/main/state'
import { UIPawn } from '@/screens/main/UIPawn'

const log = logger.custom`[ ${'UIGame'} ]`

export class UIGame extends Container implements IChild {
  private grid: GameFlatGrid<UIPawn>
  private positions: FlatGrid<Sprite>
  constructor (positions: FlatGrid<Sprite>) {
    super()
    this.positions = positions
    this.grid = new GameFlatGrid<UIPawn>(CONFIG.cols, CONFIG.rows)
    this.grid.onMerge = (value: number) => {
      STATE.score += value
    }
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
    log(coord)
    if (!coord) { throw new Error('[UIGame.spawnPiece] No empty cells found') }

    const pawn = this.createPawnAt(coord.x, coord.y, rollNewPawnValue())

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

  /**
   * Fills the board for debugging end-game scenarios.
   * @param pattern - Optional 2D array of values (0 = empty cell).
   *                  If not provided, fills with random values leaving 1 empty cell.
   */
  public debugFillBoard (pattern?: number[][]) {
    // Clear existing pawns
    this.grid.forEach((pawn) => {
      if (pawn) {
        this.removeChild(pawn)
        pawn.destroy()
      }
    })
    this.grid.fill(null)

    if (pattern) {
      // Use provided pattern
      for (let y = 0; y < pattern.length; y++) {
        for (let x = 0; x < pattern[y].length; x++) {
          const value = pattern[y][x]
          if (value > 0) {
            this.createPawnAt(x, y, value)
          }
        }
      }
    } else {
      // Fill with random values, leaving 1 empty cell
      const emptyIndex = Math.floor(Math.random() * (CONFIG.cols * CONFIG.rows))
      let index = 0

      for (let y = 0; y < CONFIG.rows; y++) {
        for (let x = 0; x < CONFIG.cols; x++) {
          if (index !== emptyIndex) {
            const value = 2 ** Math.floor(Math.random() * 10 + 1) // 2 to 2048
            this.createPawnAt(x, y, value)
          }
          index++
        }
      }
    }
  }

  /**
   * Creates a pawn at the specified grid position.
   */
  private createPawnAt (x: number, y: number, value: number) {
    const pos = this.positions.get(x, y)
    if (!pos) {
      throw new Error(`[UIGame.createPawnAt] Invalid position x:${x} y:${y}`)
    }
    const pawn = new UIPawn(value, pos)
    this.grid.set(x, y, pawn)
    this.addChild(pawn)
    return pawn
  }
}
