import type { AppScreens, IAppScreen, TAssetBundleId } from '∆/navigation.types'
import type { Ticker } from 'pixi.js'
import { engine } from '∆/engine.singleton'
import { Container } from 'pixi.js'
import { PopupPause } from '@/popups/popup.pause'

/** The screen that holds the app */
export class ScreenMain extends Container implements IAppScreen {
  public definition: AppScreens = 'ScreenMain'
  public override label: string = 'ScreenMain'
  /** Assets bundles required by this screen */
  public static assetBundles: TAssetBundleId[] = ['main']

  public mainContainer: Container
  private paused = false

  constructor () {
    super()

    this.mainContainer = new Container()
    this.addChild(this.mainContainer)
  }

  /** Prepare the screen just before showing */
  public prepare () {}

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
  }

  /** Show screen with animations */
  public async show (): Promise<void> {

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
