import type { IPreparable, IPresentable, IResettable, IResizable, IResumable, TAssetBundleId } from '∆/types'
import type { Container, Ticker } from 'pixi.js'

export const appScreens = [
  'ScreenBase',
  'ScreenMain',
  'ScreenAssetLoader',

  'OverlayUI',

  'PopupSettings',
  'PopupPause',
  'GameOver',

  'Measure',
  'ScreenInput',
  'ScreenPawn',
  'Background',
] as const

export type AppScreens = typeof appScreens[number]
/** Interface for app screens */
export interface IAppScreen extends Container, IResizable,
  IPresentable, IResettable, IPreparable, IResumable {

  /** Screen name */
  definition: AppScreens

  /** Assets bundles required by this screen */
  assetBundles?: TAssetBundleId[]

  /** Method to react on assets loading progress */
  onLoad?: (progress: number) => void

  /** Pause the screen */
  pause?: () => Promise<void>

  /** Blur the screen */
  blur?: () => void

  /** Focus the screen */
  focus?: () => void

  /** Update the screen, passing delta time/step */
  update?: (ticker: Ticker) => void
}

/** Interface for app screens constructors */
export interface IAppScreenConstructor {
  new (): IAppScreen
  /** List of assets bundles required by the screen */
  assetBundles: TAssetBundleId[]
}
