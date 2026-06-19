import type { IPreparable, IPresentable, IResettable, IResizable, IResumable } from '∆/types'
import type { Container, Ticker } from 'pixi.js'

/** Interface for app screens */
export interface IAppScreen
  extends Container, IResizable, IPresentable, IResettable, IPreparable, IResumable {
  /** Screen name */
  definition: string

  /** Assets bundles required by this screen */
  assetBundles?: string[]

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
  assetBundles: string[]
}

/**
 * Game-supplied routing/persistence configuration for {@link Navigation}.
 *
 * The engine's navigation is screen-agnostic: it knows nothing about concrete
 * game screens. The game injects this config (via `navigation.configure`) to
 * decide back-button behavior, last-session restoration, and which screen
 * visits get persisted.
 */
export interface NavigationConfig {
  /** Resolve the screen to show when the back button / Escape is pressed */
  getBackScreen?: () => IAppScreenConstructor | undefined

  /** Map a persisted screen id back to its constructor (last-session restore) */
  resolveScreen?: (id: string) => IAppScreenConstructor | null

  /** Map a screen id to the id that should be persisted, or `null` to skip persisting */
  resolvePersistId?: (id: string) => string | null

  /** Persist the resolved screen id */
  persistScreen?: (id: string) => void

  /** Read the last persisted screen id */
  getPersistedScreen?: () => string | undefined
}
