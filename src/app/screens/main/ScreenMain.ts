import type { AppScreens, ResizeSignature, TAssetBundleId } from '∆/navigation.types'
import type { DestroyOptions } from 'pixi.js'
import type { Direction } from '@/input'
import { InputHandler } from '@/input'
import { UIBoard } from '@/screens/main/UIBoard'
import { UIGame } from '@/screens/main/UIGame'
import { ScreenBase } from '@/screens/ScreenBase'

/** The screen that holds the app */
export class ScreenMain extends ScreenBase {
  public definition: AppScreens = 'ScreenMain'
  public override label: string = 'ScreenMain'
  /** Assets bundles required by this screen */
  public static assetBundles: TAssetBundleId[] = []
  private board: UIBoard
  private game: UIGame
  private input: InputHandler

  constructor () {
    super()

    this.board = new UIBoard()
    this.addChild(this.board)

    this.game = new UIGame(this.board.positions.clone())
    this.addChild(this.game)

    this.input = new InputHandler()
    this.input.onMove.connect(this.handleMove)
  }

  public override destroy (opts?: DestroyOptions): void {
    this.input.destroy()
    super.destroy(opts)
  }

  public resize ({ screen }: ResizeSignature) {
    const parent = { width: this.width, height: this.height }
    super.resize({ screen, parent })
  }

  private handleMove = (direction: Direction) => {
    if (this.paused) return
    this.game.move(direction)
  }

  public async pause () {
    super.pause()
    this.input.enabled = false
  }

  public async resume () {
    super.resume()
    this.input.enabled = true
  }
}
