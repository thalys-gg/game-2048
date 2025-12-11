import type { CreationEngine } from '∆/engine'
import type { AppScreens, IAppScreen, IAppScreenConstructor } from '∆/navigation.types'
import type { Ruler } from '∆/scene/stage-ruler'
import { userSettings } from '∆/utils/user.settings'
import { Assets, BigPool, Container } from 'pixi.js'
import { ScreenMain } from '@/screens/main/ScreenMain'
import { TestInputScreen } from '@/screens/TestInputScreen'

export class Navigation {
  /** Reference to the main application */
  public app!: CreationEngine

  public cLayers = new Container()
  /** Containers as layers */
  public cBackground = new Container()
  public cRuler = new Container()
  public cScreen = new Container()
  public cScreenOverlay = new Container()
  public cPopups = new Container()
  public cLoading = new Container()

  /** Application width */
  public width = 0

  /** Application height */
  public height = 0

  /** Constant background view for all screens */
  public background?: IAppScreen

  /** Constant background view for all screens */
  public overlay?: IAppScreen

  /** Measurement overlay for development */
  public measureLayer?: IAppScreen

  /** Current screen being displayed */
  public currentScreen?: IAppScreen

  /** Current popup being displayed */
  public currentPopup?: IAppScreen

  destroy () {
    globalThis.window.removeEventListener('keydown', this._onKeyDown)
    globalThis.window.removeEventListener('popstate', this._onPopState)
  }

  constructor () {
    globalThis.window.addEventListener('keydown', this._onKeyDown)
    globalThis.window.addEventListener('popstate', this._onPopState)
  }

  public init (app: CreationEngine) {
    this.app = app
    this.cLayers.label = 'cLayer'
    this.cBackground.label = 'cBackground'
    this.cRuler.label = 'cRuler'
    this.cScreen.label = 'cScreen'
    this.cScreenOverlay.label = 'cScreenOverlay'
    this.cPopups.label = 'cPopups'
    this.cLoading.label = 'cLoading'

    // define layers
    app.stage.addChild(this.cLayers)
    this.cLayers.addChild(this.cBackground)
    this.cLayers.addChild(this.cRuler)
    this.cLayers.addChild(this.cScreen)
    this.cLayers.addChild(this.cScreenOverlay)
    this.cLayers.addChild(this.cPopups)
    this.cLayers.addChild(this.cLoading)
  }

  /** Set the default background screen */
  public setBackground (ctor: IAppScreenConstructor) {
    this.background = new ctor() // eslint-disable-line new-cap
    this.addAndShowScreen(this.background, this.cBackground)
  }

  /** Set the overlay layer */
  public setOverlay (ctor: IAppScreenConstructor) {
    this.overlay = new ctor() // eslint-disable-line new-cap
    this.addAndShowScreen(this.overlay, this.cScreenOverlay)
  }

  /** Set the measurement overlay layer */
  public setRulerLayer (ctor: IAppScreenConstructor) {
    this.measureLayer = new ctor() // eslint-disable-line new-cap
    this.addAndShowScreen(this.measureLayer, this.cRuler)
  }

  /** Add screen to the stage, link update & resize functions */
  private async addAndShowScreen (screen: IAppScreen, container: Container) {
    // Add screen to stage
    container.addChild(screen)

    // Setup things and pre-organize screen before showing
    if (screen.prepare) screen.prepare()
    // Trigger a first resize, if available
    if (screen.resize) screen.resize({ screen: { width: this.width, height: this.height }, parent: { width: this.width, height: this.height } })
    // Add update function if available
    if (screen.update) this.app.ticker.add(screen.update, screen)

    // Show the new screen
    if (screen.show) {
      screen.interactiveChildren = false
      await screen.show()
      screen.interactiveChildren = true
    }
  }

  /** Remove screen from the stage, unlink update & resize functions */
  private async hideAndRemoveScreen (screen: IAppScreen) {
    // Prevent interaction in the screen
    screen.interactiveChildren = false

    // Hide screen if method is available
    if (screen.hide) await screen.hide()
    // Unlink update function if method is available
    if (screen.update) this.app.ticker.remove(screen.update, screen)
    // Remove screen from its parent (usually app.stage, if not changed)
    if (screen.parent) screen.parent.removeChild(screen)
    // Clean up the screen so that instance can be reused again later
    if (screen.reset) screen.reset()
  }

  /**
   * Hide current screen (if there is one) and present a new screen.
   * Any class that matches AppScreen interface can be used here.
   */
  public async showScreen (ctor: IAppScreenConstructor) {
    // Block interactivity in current screen
    if (this.currentScreen) this.currentScreen.interactiveChildren = false

    // Load assets for the new screen, if available
    if (ctor.assetBundles) {
      // Load all assets required by this new screen
      await Assets.loadBundle(ctor.assetBundles, (progress) => {
        if (this.currentScreen?.onLoad) {
          this.currentScreen.onLoad(progress * 100)
        }
      })
    }

    if (this.currentScreen?.onLoad) this.currentScreen.onLoad(100)
    // If there is a screen already created, hide and destroy it
    if (this.currentScreen) await this.hideAndRemoveScreen(this.currentScreen)

    // Create the new screen and add that to the stage
    this.currentScreen = BigPool.get(ctor)
    await this.addAndShowScreen(this.currentScreen, this.cScreen)

    const ref = this.crossReference(this.currentScreen.definition)
    if (ref === null) return

    userSettings.setLastScreen(ref)
    this.stackScreenState(ref)
  }

  /**
   * Resize screens
   * @param width Viewport width
   * @param height Viewport height
   */
  public resize (width: number, height: number) {
    this.width = width
    this.height = height
    this.currentScreen?.resize?.({ screen: { width, height }, parent: { width, height } })
    this.currentPopup?.resize?.({ screen: { width, height }, parent: { width, height } })
    this.background?.resize?.({ screen: { width, height }, parent: { width, height } })
    this.overlay?.resize?.({ screen: { width, height }, parent: { width, height } })
    this.measureLayer?.resize?.({ screen: { width, height }, parent: { width, height } })
  }

  /**
   * Show up a popup over current screen
   */
  public async presentPopup (ctor: IAppScreenConstructor) {
    if (this.currentScreen) {
      this.currentScreen.interactiveChildren = false
      await this.currentScreen.pause?.()
    }

    if (this.currentPopup) await this.hideAndRemoveScreen(this.currentPopup)

    this.currentPopup = new ctor() // eslint-disable-line new-cap
    await this.addAndShowScreen(this.currentPopup, this.cPopups)
  }

  /**
   * Dismiss current popup, if there is one
   */
  public async dismissPopup () {
    if (!this.currentPopup) return
    const popup = this.currentPopup
    this.currentPopup = undefined
    await this.hideAndRemoveScreen(popup)
    if (this.currentScreen) {
      this.currentScreen.interactiveChildren = true
      this.currentScreen.resume?.()
    }
  }

  /**
   * Blur screens when lose focus
   */
  public blur () {
    this.currentScreen?.blur?.()
    this.currentPopup?.blur?.()
    this.background?.blur?.()
    this.overlay?.blur?.()
    this.measureLayer?.blur?.()
  }

  /**
   * Focus screens
   */
  public focus () {
    this.currentScreen?.focus?.()
    this.currentPopup?.focus?.()
    this.background?.focus?.()
    this.overlay?.focus?.()
    this.measureLayer?.focus?.()
  }

  private stackScreenState (value: AppScreens) {
    history.pushState({ page: value }, value)
  }

  private _onKeyDown = (e: KeyboardEvent) => {
    // console.log(`key pressed: [ ${e.key} ]`)
    if (e.key === 'Escape') {
      // console.log('Emitting "goBack" signal.')
      this._onPopState()
    }
  }

  private _onPopState = (e?: PopStateEvent) => {
    e?.preventDefault()
    // This fires when the user hits the browser/Android back button.
    // logger.log('Back button pressed. Emitting "goBack" signal.')
    this.showScreen(ScreenMain)
  }

  private crossReference = (screen: AppScreens): AppScreens | null => {
    switch (screen) {
      case 'Measure':
      case 'ScreenAssetLoader':
      case 'OverlayUI':
      case 'Background':
        return null // don't save for loading screen
      case 'PopupPause':
      case 'PopupSettings':
      case 'TestInputScreen':
      case 'ScreenMain':
      default:
        return 'ScreenMain'
    }
  }

  private matchRefScreen = (screen: AppScreens): IAppScreenConstructor | null => {
    switch (screen) {
      case 'Measure':
      case 'ScreenAssetLoader':
      case 'OverlayUI':
      case 'Background':
        return null // don't save for loading screen
      case 'PopupPause':
      case 'PopupSettings':
      case 'TestInputScreen':
        return TestInputScreen
      case 'ScreenMain':
      default:
        return ScreenMain
    }
  }

  public showLastSessionScreen = async () => {
    const lastScreen: AppScreens = userSettings.getLastScreen()
    const ref = this.crossReference(lastScreen)
    if (!ref) {
      await this.showScreen(ScreenMain)
      return
    }
    await this.showScreen(this.matchRefScreen(ref) || ScreenMain)
  }

  /**
   * Toggle the measurement overlay visibility
   */
  public toggleMeasureLayer () {
    if (this.measureLayer && 'toggle' in this.measureLayer) {
      (this.measureLayer as Ruler).toggle()
    }
  }
}
