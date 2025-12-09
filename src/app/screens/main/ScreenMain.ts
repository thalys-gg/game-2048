import type { AppScreens, IAppScreen, TAssetBundleId } from '∆/navigation.types'
import type { Ticker } from 'pixi.js'
import type { Direction } from '@/input'
import { engine } from '∆/engine.singleton'
import { Container } from 'pixi.js'
import { InputHandler } from '@/input'
import { PopupPause } from '@/popups/popup.pause'
import { UIBoard } from '@/screens/main/UIBoard'
import { UIGame } from '@/screens/main/UIGame'

/** The screen that holds the app */
export class ScreenMain extends Container implements IAppScreen {
  public definition: AppScreens = 'ScreenMain'
  public override label: string = 'ScreenMain'
  /** Assets bundles required by this screen */
  public static assetBundles: TAssetBundleId[] = []
  private board: UIBoard
  private game: UIGame
  private paused = false
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

  /** Resize the screen, fired whenever window size changes */
  public resize (width: number, height: number) {
    const centerX = width * 0.5
    const centerY = height * 0.5

    this.board.x = centerX - this.board.width * this.board.pivot.x
    this.board.y = centerY - this.board.height * this.board.pivot.y
    this.board.resize(width, height)

    this.game.x = this.board.x
    this.game.y = this.board.y
    this.game.resize(width, height)
  }

  /** Prepare the screen just before showing */
  public prepare () {}

  /** Update the screen */
  public update (_time: Ticker) {
    // eslint-disable-next-line no-useless-return
    if (this.paused) { return }
  }

  private handleMove = (direction: Direction) => {
    if (this.paused) return
    this.game.move(direction)
  }

  /** Pause gameplay - automatically fired when a popup is presented */
  public async pause () {
    this.interactiveChildren = false
    this.paused = true
    this.input.enabled = false
  }

  /** Resume gameplay */
  public async resume () {
    this.interactiveChildren = true
    this.paused = false
    this.input.enabled = true
  }

  /** Fully reset */
  public reset () {
    this.input.destroy()
  }

  /** Show screen with animations */
  public async show (): Promise<void> {
    this.game.show()
  }

  /** Hide screen with animations */
  public async hide () {}

  /** Auto pause the app when window go out of focus */
  public blur () {
    if (!engine().navigation.currentPopup) {
      engine().navigation.presentPopup(PopupPause)
    }
  }
}
