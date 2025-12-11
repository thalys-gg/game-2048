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

export interface IPreparable {
  /** Prepare container, before showing */
  prepare?: () => void
}

export interface IResettable {
  /** Reset container, after hidden */
  reset?: () => void
}

export interface IPresentable {
  /** Show the container */
  show?: () => Promise<void>

  /** Hide the container */
  hide?: () => Promise<void>
}

export interface IDestroyable {
  /** Destroy the container */
  destroy?: (opts?: DestroyOptions) => void
}

export interface IResizable {

  /** Resize the container */
  resize?: ({ screen, parent }: ResizeSignature) => void
}

export interface IChild extends ContainerChild, IResizable, IPresentable, IResettable, IPreparable {

}

/** Interface for app screens */
export interface IAppScreen extends Container, IResizable, IPresentable, IResettable, IPreparable {

  /** Screen name */
  definition: AppScreens

  /** Assets bundles required by this screen */
  assetBundles?: TAssetBundleId[]

  /** Method to react on assets loading progress */
  onLoad?: (progress: number) => void

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
