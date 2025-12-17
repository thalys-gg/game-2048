import type { FancyButton } from '@pixi/ui'
import type { AppScreens, IAppScreen, TAssetBundleId } from '∆/types'
import type { Text } from 'pixi.js'
import { List } from '@pixi/ui'
import { engine } from '∆/engine.singleton'
import { ZINC } from '∆/lib/colors'
import { throttle } from '∆/lib/fn'
import { userSettings } from '∆/utils/user.settings'
import { animate } from 'motion'
import { BlurFilter, Container, NineSliceSprite, Sprite, Texture } from 'pixi.js'
import buttons from '@/lib/buttons'
import { getAppVersion } from '@/lib/global'
import textures from '@/lib/textures'
import { Label } from '@/ui/Label'
import { VolumeSlider } from '@/ui/VolumeSlider'

/** Popup for volume */
export class PopupSettings extends Container implements IAppScreen {
  public static assetBundles: TAssetBundleId[] = ['preload']
  public definition: AppScreens = 'PopupSettings'
  /** The dark semi-transparent background covering current screen */
  private bg: Sprite
  /** Container for the popup UI components */
  private panel: Container
  /** The popup title label */
  private title: Text
  /** Button that closes the popup */
  private doneButton: FancyButton
  /** The build version label */
  private versionLabel: Text
  /** Layout that organizes the UI components */
  private layout: List
  /** Slider that changes the master volume */
  private masterSlider: VolumeSlider
  /** Slider that changes background music volume */
  private bgmSlider: VolumeSlider
  /** Slider that changes sound effects volume */
  private sfxSlider: VolumeSlider

  constructor () {
    super()

    this.bg = new Sprite(Texture.WHITE)
    this.bg.tint = 0x0
    this.bg.interactive = true
    this.addChild(this.bg)

    this.panel = new Container()
    this.addChild(this.panel)

    const panelBg = new NineSliceSprite({
      texture: textures.popupBg,
      leftWidth: 42,
      topHeight: 42,
      rightWidth: 42,
      bottomHeight: 42,
      width: 420,
      height: 480,
    })
    panelBg.anchor.set(0.5)
    this.panel.addChild(panelBg)

    this.title = new Label({
      text: 'SETTINGS',
      style: { fill: ZINC[800], fontSize: 42 },
    })
    this.panel.addChild(this.title)
    this.title.y = -170

    this.doneButton = buttons.createBtnPopupDone('OK', 60)
    this.doneButton.y = 170
    this.panel.addChild(this.doneButton)

    this.versionLabel = new Label({
      text: `${getAppVersion()}`,
      style: {
        fill: ZINC[700],
        fontSize: 12,
      },
    })
    this.versionLabel.alpha = 0.5
    this.versionLabel.y = 210
    this.panel.addChild(this.versionLabel)

    this.layout = new List({ type: 'vertical', elementsMargin: 4 })
    this.layout.x = -140
    this.layout.y = -80
    this.panel.addChild(this.layout)

    this.masterSlider = new VolumeSlider('Master Volume')
    this.masterSlider.onUpdate.connect((v) => {
      userSettings.setMasterVolume(v / 100)
      this.soundScrolling()
    })
    this.layout.addChild(this.masterSlider)

    this.bgmSlider = new VolumeSlider('BGM Volume')
    this.bgmSlider.onUpdate.connect((v) => {
      userSettings.setBgmVolume(v / 100)
      this.soundScrolling()
    })
    this.layout.addChild(this.bgmSlider)

    this.sfxSlider = new VolumeSlider('SFX Volume')
    this.sfxSlider.onUpdate.connect((v) => {
      userSettings.setSfxVolume(v / 100)
      this.soundScrolling()
    })
    this.layout.addChild(this.sfxSlider)
  }

  /** Resize the popup, fired whenever window size changes */
  public resize ({ screen, parent }: {
    screen: { width: number, height: number }
    parent: { width: number, height: number }
  }) {
    this.bg.position.set(0)
    this.bg.width = screen.width
    this.bg.height = screen.height
    this.panel.x = screen.width * 0.5
    this.panel.y = screen.height * 0.5
  }

  /** Set things up just before showing the popup */
  public prepare () {
    this.masterSlider.value = userSettings.getMasterVolume() * 100
    this.bgmSlider.value = userSettings.getBgmVolume() * 100
    this.sfxSlider.value = userSettings.getSfxVolume() * 100
  }

  /** Present the popup, animated */
  public async show () {
    const currentEngine = engine()
    if (currentEngine.navigation.currentScreen) {
      currentEngine.navigation.currentScreen.filters = [
        new BlurFilter({ strength: 4 }),
      ]
    }

    this.bg.alpha = 0
    this.panel.pivot.y = -400
    animate(this.bg, { alpha: 0.8 }, { duration: 0.2, ease: 'linear' })
    await animate(
      this.panel.pivot,
      { y: 0 },
      { duration: 0.3, ease: 'backOut' },
    )
  }

  /** Dismiss the popup, animated */
  public async hide () {
    const currentEngine = engine()
    if (currentEngine.navigation.currentScreen) {
      currentEngine.navigation.currentScreen.filters = []
    }
    animate(this.bg, { alpha: 0 }, { duration: 0.2, ease: 'linear' })
    await animate(
      this.panel.pivot,
      { y: -500 },
      {
        duration: 0.3,
        ease: 'backIn',
      },
    )
  }

  public soundScrolling = throttle(() => {
    engine().audio.sfx.play('main/sounds/sfx-scrolling.wav')
  }, 30)
}
