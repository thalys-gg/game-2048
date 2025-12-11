import type { Container, ContainerChild, DestroyOptions, Ticker } from 'pixi.js'

export const appScreens = [
  'ScreenBase',
  'ScreenMain',
  'ScreenAssetLoader',

  'OverlayUI',

  'PopupSettings',
  'PopupPause',

  'Measure',
  'TestInputScreen',
  'PawnDebugScreen',
  'Background',
] as const

export type AppScreens = typeof appScreens[number]

export type TAssetBundleId = 'preload' | 'main' | 'ui' | 'loops'

export type ResizeSignature = {
  screen: { width: number, height: number }
  parent: { width: number, height: number }
}

export interface IDestroyableContainer {
  destroy?: (opts?: DestroyOptions) => void
}

export interface IResizableContainer {

  /** Resize the container */
  resize?: ({ screen, parent }: ResizeSignature) => void
}

export interface IChild extends ContainerChild, IResizableContainer {

}

/** Interface for app screens */
export interface IAppScreen extends Container, IResizableContainer {

  /** Screen name */
  definition: AppScreens

  /** Assets bundles required by this screen */
  assetBundles?: TAssetBundleId[]

  /** Prepare screen, before showing */
  prepare?: () => void

  /** Reset screen, after hidden */
  reset?: () => void

  /** Method to react on assets loading progress */
  onLoad?: (progress: number) => void

  /** Show the screen */
  show?: () => Promise<void>

  /** Hide the screen */
  hide?: () => Promise<void>

  /** Pause the screen */
  pause?: () => Promise<void>

  /** Resume the screen */
  resume?: () => Promise<void>

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
