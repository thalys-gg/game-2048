import type { FancyButton } from '@pixi/ui'
import type { AppScreens, IAppScreen, TAssetBundleId } from '∆/navigation.types'
import type { Ticker } from 'pixi.js'
import { animate } from 'motion'
import { Container } from 'pixi.js'
import { engine } from '@/getEngine'
import { PausePopup } from '@/popups/PausePopup'
import { ScreenMemoryGame } from '@/screens/game/ScreenMemoryGame.ts'
import { MenuTitleText } from '@/screens/menu/MenuTitleText'
import { create } from '@/ui/create.ts'

/** The screen that holds the app */
export class ScreenMemoryGameMenu extends Container implements IAppScreen {
  public definition: AppScreens = 'ScreenMemoryGameMenu'
  public override label: string = 'ScreenMemoryGameMenu'
  /** Assets bundles required by this screen */
  public static assetBundles: TAssetBundleId[] = ['memory-game-phaser']
  public mainContainer: Container
  private pauseButton: FancyButton
  private settingsButton: FancyButton
  private paused = false

  constructor () {
    super()

    this.mainContainer = new Container()
    this.addChild(this.mainContainer)

    this.pauseButton = create.mainUI.btnPause()
    this.addChild(this.pauseButton)

    this.settingsButton = create.mainUI.btnSettings()
    this.addChild(this.settingsButton)

    const titleText = new MenuTitleText(
      () => { this.startGame() },
    )

    this.addChild(titleText)
  }

  private startGame () {
    engine().navigation.showScreen(ScreenMemoryGame)
  }

  /** Prepare the screen just before showing */
  public prepare () {

  }

  /** Update the screen */
  public update (_time: Ticker) {
    // eslint-disable-next-line no-useless-return
    if (this.paused) { return }
  }

  /** Pause gameplay - automatically fired when a popup is presented */
  public async pause () {
    this.mainContainer.interactiveChildren = false
    this.paused = true
  }

  /** Resume gameplay */
  public async resume () {
    this.mainContainer.interactiveChildren = true
    this.paused = false
  }

  /** Fully reset */
  public reset () {}

  /** Resize the screen, fired whenever window size changes */
  public resize (width: number, height: number) {
    const centerX = width * 0.5
    const centerY = height * 0.5

    this.mainContainer.x = centerX
    this.mainContainer.y = centerY
    this.pauseButton.x = 30
    this.pauseButton.y = 30
    this.settingsButton.x = width - 30
    this.settingsButton.y = 30
  }

  /** Show screen with animations */
  public async show (): Promise<void> {
    engine().audio.bgm.play('main/sounds/bgm-main.mp3', { volume: 0.5 })

    const elementsToAnimate = [
      this.pauseButton,
      this.settingsButton,
    ]

    let finalPromise!: ReturnType<typeof animate>
    for (const element of elementsToAnimate) {
      element.alpha = 0
      finalPromise = animate(
        element,
        { alpha: 1 },
        { duration: 0.3, delay: 0.75, ease: 'backOut' },
      )
    }

    await finalPromise
  }

  /** Hide screen with animations */
  public async hide () {}

  /** Auto pause the app when window go out of focus */
  public blur () {
    if (!engine().navigation.currentPopup) {
      engine().navigation.presentPopup(PausePopup)
    }
  }
}
