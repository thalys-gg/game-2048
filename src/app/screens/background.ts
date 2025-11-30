import type { AppScreens, IAppScreen, TAssetBundleId } from '∆/navigation.types'
import type { Ticker } from 'pixi.js'
import { Container } from 'pixi.js'
import { animBgFloatingParticles, animBgGeometricPatterns, animBgGradientWaves } from '@/fun-style/animated-background'
import { display } from '@/fun-style/display'

export class Background extends Container implements IAppScreen {
  public definition: AppScreens = 'Background'
  public override label: string = 'Background'
  public static assetBundles: TAssetBundleId[] = ['preload'] as TAssetBundleId[]
  protected paused = false

  constructor () {
    super()

    const floatingParticles = display()
      .start()
      .add(animBgFloatingParticles())
      .container()

    const gradientWaves = display()
      .start()
      .add(animBgGradientWaves())
      .container()

    const geometricPatterns = display()
      .start()
      .add(animBgGeometricPatterns())
      .container()

    floatingParticles.alpha = 0
    gradientWaves.alpha = 1
    geometricPatterns.alpha = 0

    this.addChild(floatingParticles)
    this.addChild(gradientWaves)
    this.addChild(geometricPatterns)
  }

  public prepare () {}

  public update (time: Ticker) {}

  public reset () {}

  public resize (width: number, height: number) {

  }

  public blur () {}
}
