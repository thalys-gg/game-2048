import type { FancyButton } from '@pixi/ui'
import type { AppScreens, IAppScreen, TAssetBundleId } from '∆/navigation.types'
import type { Ticker } from 'pixi.js'
import gsap from 'gsap'
import { animate } from 'motion'
import { Container, Text, TextStyle } from 'pixi.js'
import { engine } from '@/getEngine'
import { PopupPause } from '@/popups/popup.pause'
import { Game } from '@/screens/game/Game'
import { ScreenMemoryGameMenu } from '@/screens/menu/ScreenMemoryGameMenu.ts'
import { create } from '@/ui/create.ts'
import { AUDIO_PATHS, GAME_CONFIG, UI_CONSTANTS } from './config'
import { GameStateManager } from './GameStateManager'
import { UIHeartsContainer } from './UIHeartsContainer'

/** The screen that holds the app */
export class ScreenMemoryGame extends Container implements IAppScreen {
  public definition: AppScreens = 'ScreenMemoryGame'
  public override label: string = 'ScreenMemoryGame'
  /** Assets bundles required by this screen */
  public static assetBundles: TAssetBundleId[] = ['memory-game-phaser']

  public mainContainer: Container
  public uiLayer: Container
  private heartsBar: UIHeartsContainer
  private game: Game
  private gameState: GameStateManager

  private pauseButton: FancyButton
  private settingsButton: FancyButton
  private winnerText: Text
  private gameOverText: Text
  private paused = false

  constructor () {
    super()
    this.label = 'ScreenMemoryGame'

    const { audio, screen } = engine()
    const { sfx } = audio

    this.mainContainer = new Container()
    this.mainContainer.label = 'mainContainer'
    this.addChild(this.mainContainer)

    this.uiLayer = new Container()
    this.uiLayer.label = 'uiLayer'
    this.addChild(this.uiLayer)

    this.pauseButton = create.mainUI.btnPause()
    this.uiLayer.addChild(this.pauseButton)

    this.settingsButton = create.mainUI.btnSettings()
    this.uiLayer.addChild(this.settingsButton)

    const endTextStyle = new TextStyle(UI_CONSTANTS.END_TEXT_STYLE)

    this.winnerText = new Text({ text: 'YOU WIN!', style: endTextStyle })
    this.winnerText.anchor.set(0.5)
    this.winnerText.position.set(screen.width / 2, -100)
    this.winnerText.label = 'winnerText'
    this.uiLayer.addChild(this.winnerText)

    this.gameOverText = new Text({
      text: 'GAME OVER\nClick to restart',
      style: { ...endTextStyle, fill: UI_CONSTANTS.GAME_OVER_COLOR },
    })
    this.gameOverText.anchor.set(0.5)
    this.gameOverText.position.set(screen.width / 2, -100)
    this.gameOverText.label = 'gameOverText'
    this.uiLayer.addChild(this.gameOverText)

    this.gameState = new GameStateManager()
    this.setupGameStateListeners()

    this.heartsBar = new UIHeartsContainer()
    this.mainContainer.addChild(this.heartsBar)

    this.game = new Game((didWin) => {
      const textToShow: Text = didWin ? this.winnerText : this.gameOverText

      if (didWin) {
        sfx.play(AUDIO_PATHS.victory)
      }
      sfx.play(AUDIO_PATHS.whoosh, { volume: 1.3 })

      gsap.to(textToShow, {
        y: screen.height / 2,
        duration: GAME_CONFIG.animationDurations.textBounce,
        ease: 'bounce.out',
        onComplete: () => {
          textToShow.eventMode = 'static'
          textToShow.cursor = 'pointer'
          textToShow.once('pointerdown', () => this.restartGame())
        },
      })
    }, this.heartsBar.updateHearts)
    this.mainContainer.addChild(this.game)
  }

  /** Prepare the screen just before showing */
  public prepare () {
    this.gameState.reset()
    this.heartsBar.prepare(this.gameState.lives)
    this.game.prepare()
  }

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
    this.x = 0
    this.y = 0

    this.mainContainer.x = 0
    this.mainContainer.y = 30

    this.heartsBar.pivot.set(0.5)
    this.heartsBar.x = 16
    this.heartsBar.y = 30
    this.heartsBar.resize(width, height)

    this.pauseButton.x = UI_CONSTANTS.BUTTON_PADDING
    this.pauseButton.y = UI_CONSTANTS.BUTTON_PADDING

    this.settingsButton.x = width - UI_CONSTANTS.BUTTON_PADDING
    this.settingsButton.y = UI_CONSTANTS.BUTTON_PADDING

    this.game.resize(width, height)
  }

  /** Show screen with animations */
  public async show (): Promise<void> {
    engine().audio.bgm.play('main/sounds/bgm-main.mp3', { volume: 0.5 })

    const elementsToAnimate = [
      this.pauseButton,
      this.settingsButton,
    ]

    let finalPromise!: ReturnType<typeof animate>
    for (const element of elementsToAnimate) {
      element.alpha = 0
      finalPromise = animate(
        element,
        { alpha: 1 },
        { duration: 0.3, delay: 0.75, ease: 'backOut' },
      )
    }

    await finalPromise

    this.game.show()
  }

  /** Hide screen with animations */
  public async hide () {}

  /** Auto pause the app when window go out of focus */
  public blur () {
    if (!engine().navigation.currentPopup) {
      engine().navigation.presentPopup(PopupPause)
    }
  }

  private restartGame () {
    const { screen, audio, navigation } = engine()

    audio.sfx.play(AUDIO_PATHS.whoosh)
    const endTexts = [this.winnerText, this.gameOverText]

    gsap.to(
      endTexts.filter(t => t),
      { y: -100, duration: GAME_CONFIG.animationDurations.screenTransition, ease: 'back.in' },
    )

    gsap.to(this.game, {
      y: screen.height + 100,
      duration: GAME_CONFIG.animationDurations.screenTransition,
      stagger: 0.05,
      onComplete: () => {
        navigation.showScreen(ScreenMemoryGameMenu)
      },
    })
  }

  private setupGameStateListeners () {
    this.gameState.onLivesChanged(() => {
      // Hearts are updated via the game's mismatch callback
    })
  }
}
