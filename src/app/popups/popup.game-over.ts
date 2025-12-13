import type { AppScreens, IAppScreen, TAssetBundleId } from '∆/navigation.types'
import { engine } from '∆/engine.singleton'
import { animate } from 'motion'
import { BlurFilter, Container, Sprite, Texture } from 'pixi.js'
import { CONFIG } from '@/config'
import actions from '@/lib/actions'
import { Label } from '@/ui/Label'

/** Popup that shows up when gameplay is paused */
export class GameOver extends Container implements IAppScreen {
  public static assetBundles: TAssetBundleId[] = ['preload']
  public definition: AppScreens = 'GameOver'
  /** The dark semi-transparent background covering current screen */
  private bg: Sprite
  private message: Label

  private blurFilter: BlurFilter = new BlurFilter({ strength: 0 })

  constructor () {
    super()

    this.bg = new Sprite(Texture.WHITE)
    this.bg.tint = 0x0
    this.bg.interactive = true
    this.bg.alpha = 0
    this.addChild(this.bg)

    this.message = new Label({
      text: 'GAME OVER',
      style: { fill: CONFIG.theme.textLight, fontSize: 42 },
    })
    this.message.pivot.y = -500
    this.addChild(this.message)

    this.interactiveChildren = false

    this.interactive = true
    this.on('pointerup', () => {
      actions.dismissPopup()
    })
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
      currentEngine.navigation.currentScreen.filters = [this.blurFilter]
    }

    animate(this.blurFilter, { strength: 5 }, { duration: 0.2, ease: 'linear' })
    animate(this.bg, { alpha: 0.7 }, { duration: 0.2, ease: 'linear' })
    await animate(
      this.message.pivot,
      { y: 0 },
      { duration: 0.3, ease: 'backOut' },
    )
  }

  public async hide () {

    animate(this.blurFilter, { strength: 0 }, { duration: 0.2, ease: 'linear' })
    animate(this.bg, { alpha: 0 }, { duration: 0.2, ease: 'linear' })
    await animate(
      this.message.pivot,
      { y: -500 },
      { duration: 0.3, ease: 'backIn' },
    )

    const currentEngine = engine()
    if (currentEngine.navigation.currentScreen) {
      currentEngine.navigation.currentScreen.filters = []
    }
  }
}
