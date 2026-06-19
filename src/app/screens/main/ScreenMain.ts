import type { ResizeSignature } from '@thalys/pixi-shared/types'
import type { AppScreens, TAssetBundleId } from '@/screens/screens.types'
import type { DestroyOptions } from 'pixi.js'
import type { Direction } from '@/lib/types'
import { InputHandler } from '@/lib/input'
import { UIBoard } from '@/screens/main/UIBoard'
import { UIGame } from '@/screens/main/UIGame'
import { UIScore } from '@/screens/main/UIScore'
import { ScreenBase } from '@/screens/ScreenBase'

/** The screen that holds the app */
export class ScreenMain extends ScreenBase {
  public definition: AppScreens = 'ScreenMain'
  public override label: string = 'ScreenMain'
  /** Assets bundles required by this screen */
  public static assetBundles: TAssetBundleId[] = ['preload', 'main', 'loops']
  private board: UIBoard
  private game: UIGame
  private input: InputHandler
  private score: UIScore

  constructor() {
    super()

    this.board = new UIBoard()
    this.addChild(this.board)

    this.game = new UIGame(this.board.positions.clone())
    this.addChild(this.game)

    this.input = new InputHandler()
    this.input.onMove.connect(this.handleMove)

    this.score = new UIScore()
    this.addChild(this.score)
  }

  public override destroy(opts?: DestroyOptions): void {
    this.input.destroy()
    super.destroy(opts)
  }

  public resize({ screen }: ResizeSignature) {
    const parent = { width: this.width, height: this.height }
    super.resize({ screen, parent })
  }

  private handleMove = (direction: Direction) => {
    if (this.paused) return
    this.game.move(direction)
  }

  public async pause() {
    super.pause()
    this.input.enabled = false
  }

  public async resume() {
    super.resume()
    this.input.enabled = true
  }
}
