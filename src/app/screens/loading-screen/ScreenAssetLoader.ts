import type { AppScreens, IAppScreen, TAssetBundleId } from '∆/navigation.types'
import type { ObjectTarget } from 'motion/react'
import { logger } from '@thalys/logger'
import { animate } from 'motion'
import { Container } from 'pixi.js'
import { Background } from '@/screens/loading-screen/Background'
import { Logo } from '@/screens/loading-screen/Logo'
import { ProgressBar } from '@/screens/loading-screen/ProgressBar'

/** Screen shown while loading assets */
export class ScreenAssetLoader extends Container implements IAppScreen {
  public definition: AppScreens = 'ScreenMemoryGame'
  public override label: string = 'ScreenMemoryGame'
  /** Assets bundles required by this screen */
  public static assetBundles: TAssetBundleId[] = ['preload', 'main', 'memory-game-phaser', 'ui']
  /** The PixiJS logo */
  private logo: Logo
  /** Progress Bar */
  private progressBar: ProgressBar
  private background: Background

  constructor () {
    super()
    this.label = 'ScreenAssetLoader'

    this.background = new Background()
    this.addChild(this.background)

    this.progressBar = new ProgressBar()
    this.addChild(this.progressBar)

    this.logo = new Logo()
    this.addChild(this.logo)
  }

  public onLoad (progress: number) {
    // logger.log('progress', progress)
    this.progressBar.set(progress)
  }

  /** Resize the screen, fired whenever window size changes  */
  public resize (width: number, height: number) {
    this.logo.resize(width, height)
    this.progressBar.resize(width, height)
    this.background.resize(width, height)
  }

  /** Show screen with animations */
  public async show () {
    this.alpha = 1
  }

  /** Hide screen with animations */
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
