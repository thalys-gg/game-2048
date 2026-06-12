import type { AppScreens, IAppScreen, IChild, ResizeSignature, TAssetBundleId } from '∆/types'
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
    this.prepareChildren()
  }

  public prepareChildren () {
    this.children.forEach((child) => {
      child.prepare?.()
    })
  }

  public destroy (opts?: DestroyOptions) {
    this.destroy(opts)
  }

  public reset () {
    this.resetChildren()
  }

  public resetChildren () {
    this.children.forEach((child) => {
      child.reset?.()
    })
  }

  public onLoad (progress: number) {

  }

  public resize ({ screen, parent }: ResizeSignature) {
    this.resizeChildren({ screen, parent: { width: this.width, height: this.height } })
  }

  public resizeChildren ({ screen, parent }: ResizeSignature) {
    this.children.forEach((child) => {
      child.resize?.({ screen, parent })
    })
  }

  public async show (): Promise<void> {
    this.showChildren()
  }

  public showChildren () {
    this.children.forEach((child) => {
      child.show?.()
    })
  }

  public async hide () {
    this.hideChildren()
  }

  public hideChildren () {
    this.children.forEach((child) => {
      child.hide?.()
    })
  }

  public async pause () {
    this.interactiveChildren = false
    this.paused = true
  }

  public async resume () {
    this.interactiveChildren = true
    this.paused = false
    this.resumeChildren()
  }

  public async resumeChildren () {
    this.children.forEach((child) => {
      child.resume?.()
    })
  }

  public blur () {
    if (!engine().navigation.currentPopup) {
      engine().navigation.presentPopup(PopupPause)
    }
  }

  public focus () {

  }

  public update (ticker: Ticker) {
    // oxlint-disable-next-line no-useless-return
    if (this.paused) { return }
  }
}
