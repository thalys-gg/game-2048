import type { BundleName } from '../../gen/manifest-types'

/**
 * All screen identifiers used by this game.
 *
 * The engine's `IAppScreen.definition` is a plain `string`; this union keeps
 * compile-time safety on the game side (screens set their `definition` to one
 * of these literals, and the navigation router maps them back to constructors).
 */
export const appScreens = [
  'ScreenBase',
  'ScreenMain',
  'ScreenAssetLoader',

  'OverlayUI',

  'PopupSimpleMessage',
  'PopupSettings',
  'PopupPause',
  'GameOver',
  'GameWon',

  'Measure',
  'ScreenInput',
  'ScreenPawn',
  'Background',
] as const

export type AppScreens = (typeof appScreens)[number]

/**
 * Asset bundle ids, derived from the generated asset manifest. Assignable to
 * the engine's `string[]` `assetBundles`, while keeping bundle-name safety in
 * game code.
 */
export type TAssetBundleId = BundleName
