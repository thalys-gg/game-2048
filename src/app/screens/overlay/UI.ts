import type { FancyButton } from '@pixi/ui'
import type { AppScreens, IAppScreen, TAssetBundleId } from '∆/navigation.types'
import type { Ticker } from 'pixi.js'
import { engine } from '∆/engine.singleton'
import { Container } from 'pixi.js'
import buttons from '@/lib/buttons'
import { PopupPause } from '@/popups/popup.pause'

export class OverlayUI extends Container implements IAppScreen {
  public definition: AppScreens = 'OverlayUI'
  public override label: string = 'OverlayUI'
  public static assetBundles: TAssetBundleId[] = ['preload'] as TAssetBundleId[]
  protected btnPause: FancyButton
  protected btnHome: FancyButton
  protected btnSettings: FancyButton
  protected btnFullScreen: FancyButton
  protected paused = false

  constructor () {
    super()

    this.btnPause = buttons.createBtnPause
    this.addChild(this.btnPause)

    this.btnHome = buttons.createBtnHome
    this.addChild(this.btnHome)

    this.btnSettings = buttons.createBtnSettings
    this.addChild(this.btnSettings)

    this.btnFullScreen = buttons.createBtnFullScreen
    this.addChild(this.btnFullScreen)
  }

  public prepare () {}

  public update (time: Ticker) {}

  public async pause () { this.paused = true }

  public async resume () { this.paused = false }

  public reset () {}

  public resize ({ screen, parent }: {
    screen: { width: number, height: number }
    parent: { width: number, height: number }
  }) {
    this.btnPause.x = 30
    this.btnPause.y = 30
    this.btnHome.x = this.btnPause.getBounds().right + 20
    this.btnHome.y = 30

    this.btnSettings.x = screen.width - 30
    this.btnSettings.y = 30
    this.btnFullScreen.x = this.btnSettings.getBounds().left - 20
    this.btnFullScreen.y = 30
  }

  public blur () {
    if (!engine().navigation.currentPopup) {
      engine().navigation.presentPopup(PopupPause)
    }
  }
}
