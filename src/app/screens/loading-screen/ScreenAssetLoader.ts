import type { AppScreens, IAppScreen, TAssetBundleId } from '∆/types'
import type { ObjectTarget } from 'motion/react'
import { animate } from 'motion'
import { Container } from 'pixi.js'
import { Background } from '@/screens/loading-screen/Background'
import { ProgressBar } from '@/screens/loading-screen/ProgressBar'

/** Screen shown while loading assets */
export class ScreenAssetLoader extends Container implements IAppScreen {
  public definition: AppScreens = 'ScreenAssetLoader'
  public override label: string = 'ScreenAssetLoader'
  /** Assets bundles required by this screen */
  public static assetBundles: TAssetBundleId[] = ['preload', 'main']
  /** Progress Bar */
  private progressBar: ProgressBar
  private background: Background

  constructor () {
    super()

    this.background = new Background()
    this.addChild(this.background)

    this.progressBar = new ProgressBar()
    this.addChild(this.progressBar)
  }

  public onLoad (progress: number) {
    this.progressBar.set(progress)
  }

  public resize ({ screen, parent }: {
    screen: { width: number, height: number }
    parent: { width: number, height: number }
  }) {
    this.progressBar.resize(screen.width, screen.height)
    this.background.resize(screen.width, screen.height)
  }

  public async show () {
    this.alpha = 1
  }

  public async hide () {
    await animate(
      this,
      { alpha: 0 } as ObjectTarget<this>,
      {
        duration: 0.3,
        ease: 'linear',
        delay: 1,
      },
    )
  }
}
