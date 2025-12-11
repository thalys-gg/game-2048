import type { FlatGrid } from '∆/lib/flat-grid'
import type { ResizeSignature } from '∆/navigation.types'
import type { Sprite } from 'pixi.js'
import type { Direction } from '@/input'
import { waitFor } from '∆/lib/promise'
import { Container } from 'pixi.js'
import { CONFIG } from '@/config'
import { GameFlatGrid } from '@/game-flat-grid'
import { rollNewPawnValue } from '@/math'
import { UIPawn } from '@/screens/main/UIPawn'

export class UIGame extends Container {
  private grid: GameFlatGrid<UIPawn>
  private _positions: FlatGrid<Sprite>
  constructor (positions: FlatGrid<Sprite>) {
    super()
    this._positions = positions
    this.grid = new GameFlatGrid<UIPawn>(CONFIG.cols, CONFIG.rows)
  }

  public resize ({ screen, parent }: ResizeSignature) {
    this.x = 0
    this.y = 0
    this.grid.forEach((pawn, x, y) => {
      if (!pawn) return
      pawn.resize({ screen, parent })
    })
  }

  public async show () {
    const pawns = [
      this.spawnPiece(),
      this.spawnPiece(),
    ]

    await waitFor(1)

    pawns.forEach((pawn) => {
      pawn.show()
    })
  }

  /**
   * Spawns a new piece in a random empty cells
   */
  public spawnPiece () {
    const coord = this.grid.getRandomEmpty()
    if (!coord) {
      throw new Error('[UIGame.spawnPiece] No empty cells found')
    }

    const pos = this._positions.get(coord.x, coord.y)
    if (!pos) {
      throw new Error(`[UIGame.spawnPiece] Invalid position x:${coord.x} y:${coord.y}`)
    }

    const pawn = UIPawn.from(rollNewPawnValue())
    pawn.x = pos.x
    pawn.y = pos.y

    this.grid.set(coord.x, coord.y, pawn)
    this.addChild(pawn)
    return pawn
  }

  public move (direction: Direction) {
    const moved = this._move(direction)

    if (moved) {
      this.spawnPiece()
      this.checkGameState()
    }
  }

  private _move (direction: Direction): boolean {

    switch (direction) {
      case 'up':
        return this.grid.moveUp(this._positions)
      case 'down':
        return this.grid.moveDown(this._positions)
      case 'left':
        return this.grid.moveLeft(this._positions)
      case 'right':
        return this.grid.moveRight(this._positions)
    }
  }

  private checkGameState () {

  }
}
