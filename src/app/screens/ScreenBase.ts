import type { AppScreens, IAppScreen, IChild, ResizeSignature, TAssetBundleId } from '∆/navigation.types'
import type { DestroyOptions, Ticker } from 'pixi.js'
import { engine } from '∆/engine.singleton'
import { Container } from 'pixi.js'
import { PopupPause } from '@/popups/popup.pause'


export class ScreenBase extends Container<IChild> implements IAppScreen {

  public static assetBundles: TAssetBundleId[] = []
  public definition: AppScreens = 'ScreenBase'
  public override label: string = 'ScreenBase'
  protected paused = false

  constructor () {
    super()
  }

  public prepare () {

  }

  public destroy (opts?: DestroyOptions) {
    this.destroy(opts)
  }

  public reset () {

  }

  public onLoad (progress: number) {

  }

  public resize ({ screen, parent }: ResizeSignature) {
    this.resizeChildren({ screen, parent: { width: this.width, height: this.height } })
  }

  public resizeChildren ({ screen, parent }: ResizeSignature) {
    this.children.forEach((child) => {
      if (child.resize) {
        child.resize({ screen, parent })
      }
    })
  }

  public async show (): Promise<void> {

  }

  public async hide () {

  }

  public async pause () {
    this.interactiveChildren = false
    this.paused = true
  }

  public async resume () {
    this.interactiveChildren = true
    this.paused = false
  }

  public blur () {
    if (!engine().navigation.currentPopup) {
      engine().navigation.presentPopup(PopupPause)
    }
  }

  public focus () {

  }

  public update (ticker: Ticker) {
    // eslint-disable-next-line no-useless-return
    if (this.paused) { return }
  }
}
