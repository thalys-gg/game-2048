import type { AppScreens, IAppScreen, TAssetBundleId } from '∆/navigation.types'
import { engine } from '∆/engine.singleton'
import { animate } from 'motion'
import { BlurFilter, Container, Sprite, Texture } from 'pixi.js'
import { CONFIG } from '@/config'
import { Label } from '@/ui/Label'

/** Popup that shows up when gameplay is paused */
export class GameOver extends Container implements IAppScreen {
  public static assetBundles: TAssetBundleId[] = ['preload', 'ui']
  public definition: AppScreens = 'GameOver'
  /** The dark semi-transparent background covering current screen */
  private bg: Sprite
  private message: Label

  constructor () {
    super()

    this.bg = new Sprite(Texture.WHITE)
    this.bg.tint = 0x0
    this.bg.interactive = true
    this.bg.alpha = 0.7
    this.addChild(this.bg)

    this.message = new Label({
      text: 'GAME OVER',
      style: { fill: CONFIG.theme.textLight, fontSize: 42 },
    })
    this.addChild(this.message)
  }

  public resize ({ screen, parent }: {
    screen: { width: number, height: number }
    parent: { width: number, height: number }
  }) {
    this.bg.position.set(0)
    this.bg.width = screen.width
    this.bg.height = screen.height

    this.message.position.set(screen.width * 0.5, screen.height * 0.5)
  }

  public async show () {
    const currentEngine = engine()
    if (currentEngine.navigation.currentScreen) {
      currentEngine.navigation.currentScreen.filters = [
        new BlurFilter({ strength: 5 }),
      ]
    }
  }

  public async hide () {
    const currentEngine = engine()
    if (currentEngine.navigation.currentScreen) {
      currentEngine.navigation.currentScreen.filters = []
    }
    animate(this.bg, { alpha: 0 }, { duration: 0.2, ease: 'linear' })
    await animate(
      this.message.pivot,
      { y: -500 },
      { duration: 0.3, ease: 'backIn' },
    )
  }
}
