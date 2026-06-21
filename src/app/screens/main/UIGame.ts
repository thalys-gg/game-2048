import type { FlatGrid } from '@thalys/pixi-shared/lib/flat-grid'
import type { IChild, ResizeSignature } from '@thalys/pixi-shared/types'
import type { Sprite } from 'pixi.js'
import type { Direction } from '@/lib/types'
import { anime } from '@thalys/anime-pixi'
import { logger } from '@thalys/logger'
import { waitFor } from '@thalys/pixi-shared/lib/promise'
import { Container } from 'pixi.js'
import { CONFIG } from '@/config'
import actions from '@/lib/actions'
import { GameFlatGrid } from '@/lib/game-flat-grid'
import { rollNewPawnValue } from '@/lib/math'
import { STATE } from '@/screens/main/state'
import { UIPawn } from '@/screens/main/UIPawn'

const log = logger.custom`[ ${'UIGame'} ]`

export class UIGame extends Container implements IChild {
  private grid: GameFlatGrid<UIPawn>
  private positions: FlatGrid<Sprite>
  constructor(positions: FlatGrid<Sprite>) {
    super()
    this.positions = positions
    this.grid = new GameFlatGrid<UIPawn>(CONFIG.cols, CONFIG.rows)
    this.grid.onMerge = (value: number) => {
      STATE.score += value
    }
  }

  public resize({ screen, parent }: ResizeSignature) {
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

  public async show() {
    const pawns = [this.spawnPiece(), this.spawnPiece()]

    // STATE.score = 1238
    // this.debugFillBoard(
    // [1024, 64, 8, 128, 256, 32, 256, 16, 2, 4, 8, 512, null, 4, 1024, 16],
    // [2048, 2048, 8, 128, 256, 32, 256, 16, 2, 4, 8, 512, null, 4, 1024, 16],
    // )
    // await waitFor(2)
    // actions.showGameOver()
  }

  public async resume() {
    if (this.hasWon()) {
      this.reset()
    } else if (this.hasLost()) {
      this.reset()
    }
  }

  public reset() {
    STATE.score = 0
    this.grid.forEach((pawn, x, y) => {
      if (!pawn) return
      this.positions.get(x, y)?.removeChild(pawn)
      pawn.destroy()
    })
    this.grid = new GameFlatGrid<UIPawn>(CONFIG.cols, CONFIG.rows)
    this.grid.onMerge = (value: number) => {
      STATE.score += value
    }
  }

  public move(direction: Direction) {
    const moved = this.grid.move(direction, this.positions)

    if (moved) {
      this.spawnPiece()
      this.checkGameState()
    }
  }

  private hasWon() {
    return this.grid.some(pawn => (pawn?.value || 0) >= CONFIG.winningValue)
  }

  private hasLost() {
    return !this.grid.hasPossibleMoves()
  }

  private async checkGameState() {
    if (this.hasWon()) {
      await waitFor(0.3)
      actions.showGameWon()
    } else if (this.hasLost()) {
      await waitFor(0.3)
      actions.showGameOver()
    }
  }

  /**
   * Fills the board for debugging end-game scenarios.
   *
   * @param pattern - Optional 2D array of values (0 = empty cell). If not provided, fills with random values leaving 1
   *   empty cell.
   */
  public debugFillBoard(pattern?: (number | null)[]) {
    // Clear existing pawns
    this.grid.forEach((pawn, x, y) => {
      if (pawn) {
        pawn.removeFromParent()
        pawn.destroy()
        this.grid.set(x, y, null)
      }
    })

    if (pattern) {
      // Use provided pattern
      for (let i = 0; i < pattern.length; i++) {
        const { x, y } = this.grid.getXY(i)
        this.createPawnAt(x, y, pattern[i])
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

  /** Spawns a new piece in a random empty cells */
  public spawnPiece() {
    const coord = this.grid.getRandomEmpty()
    if (!coord) {
      throw new Error('[UIGame.spawnPiece] No empty cells found')
    }

    const pawn = this.createPawnAt(coord.x, coord.y, rollNewPawnValue())
    pawn.alpha = 0
    anime`fade-in`(pawn).play()
    return pawn
  }

  /** Creates a pawn at the specified grid position. */
  private createPawnAt(x: number, y: number, value: null): void
  private createPawnAt(x: number, y: number, value: number): UIPawn
  private createPawnAt(x: number, y: number, value: number | null): UIPawn | void
  private createPawnAt(x: number, y: number, value: number | null): UIPawn | void {
    if (value === null) {
      this.grid.set(x, y, null)
      return
    }

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
