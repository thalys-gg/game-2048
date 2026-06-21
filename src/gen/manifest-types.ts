/** Auto-generated TypeScript types for asset manifest Generated from manifest.json - DO NOT EDIT MANUALLY */

/** Base manifest structure */
export interface Manifest {
  bundles: Bundle[]
}

export interface Bundle {
  name: string
  assets: ManifestEntry[]
  relativeName?: string
}

export interface ManifestEntry {
  alias: string | string[]
  src: string | string[]
  data?: Record<string, any>
}

/** Concrete bundle name types */
export type BundleName = 'loops' | 'main' | 'preload'

/** Loops bundle asset aliases */
export type LoopsAssetAlias =
  | 'alpha-dance'
  | 'alpha-dance.ogg'
  | 'beat-ident'
  | 'beat-ident.ogg'
  | 'cheerful-annoyance'
  | 'cheerful-annoyance.ogg'
  | 'country-ident'
  | 'country-ident.ogg'
  | 'drumming-sticks'
  | 'drumming-sticks.ogg'
  | 'farm-frolics'
  | 'farm-frolics.ogg'
  | 'flowing-rocks'
  | 'flowing-rocks.ogg'
  | 'game-over'
  | 'game-over.ogg'
  | 'german-virtue'
  | 'german-virtue.ogg'
  | 'infinite-descent'
  | 'infinite-descent.ogg'
  | 'italian-mom'
  | 'italian-mom.ogg'
  | 'loops/idents/beat-ident'
  | 'loops/idents/beat-ident.ogg'
  | 'loops/idents/country-ident'
  | 'loops/idents/country-ident.ogg'
  | 'loops/idents/polka-ident'
  | 'loops/idents/polka-ident.ogg'
  | 'loops/idents/reggae-ident'
  | 'loops/idents/reggae-ident.ogg'
  | 'loops/idents/serious-ident'
  | 'loops/idents/serious-ident.ogg'
  | 'loops/loops/alpha-dance'
  | 'loops/loops/alpha-dance.ogg'
  | 'loops/loops/cheerful-annoyance'
  | 'loops/loops/cheerful-annoyance.ogg'
  | 'loops/loops/drumming-sticks'
  | 'loops/loops/drumming-sticks.ogg'
  | 'loops/loops/farm-frolics'
  | 'loops/loops/farm-frolics.ogg'
  | 'loops/loops/flowing-rocks'
  | 'loops/loops/flowing-rocks.ogg'
  | 'loops/loops/game-over'
  | 'loops/loops/game-over.ogg'
  | 'loops/loops/german-virtue'
  | 'loops/loops/german-virtue.ogg'
  | 'loops/loops/infinite-descent'
  | 'loops/loops/infinite-descent.ogg'
  | 'loops/loops/italian-mom'
  | 'loops/loops/italian-mom.ogg'
  | 'loops/loops/mishief-stroll'
  | 'loops/loops/mishief-stroll.ogg'
  | 'loops/loops/mission-plausible'
  | 'loops/loops/mission-plausible.ogg'
  | 'loops/loops/night-at-the-beach'
  | 'loops/loops/night-at-the-beach.ogg'
  | 'loops/loops/polka-train'
  | 'loops/loops/polka-train.ogg'
  | 'loops/loops/sad-descent'
  | 'loops/loops/sad-descent.ogg'
  | 'loops/loops/sad-town'
  | 'loops/loops/sad-town.ogg'
  | 'loops/loops/space-cadet'
  | 'loops/loops/space-cadet.ogg'
  | 'loops/loops/swinging-pants'
  | 'loops/loops/swinging-pants.ogg'
  | 'loops/loops/time-driving'
  | 'loops/loops/time-driving.ogg'
  | 'loops/loops/wacky-waiting'
  | 'loops/loops/wacky-waiting.ogg'
  | 'loops/retro/retro-beat'
  | 'loops/retro/retro-beat.ogg'
  | 'loops/retro/retro-comedy'
  | 'loops/retro/retro-comedy.ogg'
  | 'loops/retro/retro-mystic'
  | 'loops/retro/retro-mystic.ogg'
  | 'loops/retro/retro-polka'
  | 'loops/retro/retro-polka.ogg'
  | 'loops/retro/retro-reggae'
  | 'loops/retro/retro-reggae.ogg'
  | 'mishief-stroll'
  | 'mishief-stroll.ogg'
  | 'mission-plausible'
  | 'mission-plausible.ogg'
  | 'night-at-the-beach'
  | 'night-at-the-beach.ogg'
  | 'polka-ident'
  | 'polka-ident.ogg'
  | 'polka-train'
  | 'polka-train.ogg'
  | 'reggae-ident'
  | 'reggae-ident.ogg'
  | 'retro-beat'
  | 'retro-beat.ogg'
  | 'retro-comedy'
  | 'retro-comedy.ogg'
  | 'retro-mystic'
  | 'retro-mystic.ogg'
  | 'retro-polka'
  | 'retro-polka.ogg'
  | 'retro-reggae'
  | 'retro-reggae.ogg'
  | 'sad-descent'
  | 'sad-descent.ogg'
  | 'sad-town'
  | 'sad-town.ogg'
  | 'serious-ident'
  | 'serious-ident.ogg'
  | 'space-cadet'
  | 'space-cadet.ogg'
  | 'swinging-pants'
  | 'swinging-pants.ogg'
  | 'time-driving'
  | 'time-driving.ogg'
  | 'wacky-waiting'
  | 'wacky-waiting.ogg'

/** Main bundle asset aliases */
export type MainAssetAlias =
  | 'main/sounds/sfx-hover'
  | 'main/sounds/sfx-hover.wav'
  | 'main/sounds/sfx-press'
  | 'main/sounds/sfx-press.wav'
  | 'main/sounds/sfx-scrolling'
  | 'main/sounds/sfx-scrolling.wav'
  | 'sfx-hover'
  | 'sfx-hover.wav'
  | 'sfx-press'
  | 'sfx-press.wav'
  | 'sfx-scrolling'
  | 'sfx-scrolling.wav'

/** Preload bundle asset aliases */
export type PreloadAssetAlias =
  | 'Kenney-Future'
  | 'Kenney-Future-Narrow'
  | 'Kenney-Future-Narrow.ttf'
  | 'Kenney-Future.ttf'
  | 'preload/Kenney-Future'
  | 'preload/Kenney-Future-Narrow'
  | 'preload/Kenney-Future-Narrow.ttf'
  | 'preload/Kenney-Future.ttf'
  | 'preload/ui'
  | 'ui'

/** Union of all asset aliases across all bundles */
export type AssetAlias = LoopsAssetAlias | MainAssetAlias | PreloadAssetAlias

/** Type-safe bundle interface with specific asset types */
export interface TypedBundle<T extends BundleName> {
  name: T
  assets: ManifestEntry[]
  relativeName?: string
}

/** Concrete bundle types */
export interface LoopsBundle extends TypedBundle<'loops'> {
  name: 'loops'
}

export interface MainBundle extends TypedBundle<'main'> {
  name: 'main'
}

export interface PreloadBundle extends TypedBundle<'preload'> {
  name: 'preload'
}

/** Type-safe manifest with concrete bundle types */
export interface TypedManifest {
  bundles: Bundle[]
}

/** Helper type to get bundle by name */
export type GetBundle<T extends BundleName> = T extends 'loops'
  ? LoopsBundle
  : T extends 'main'
    ? MainBundle
    : T extends 'preload'
      ? PreloadBundle
      : never

/** Helper type to get asset aliases for a specific bundle */
export type GetBundleAssets<T extends BundleName> = T extends 'loops'
  ? LoopsAssetAlias
  : T extends 'main'
    ? MainAssetAlias
    : T extends 'preload'
      ? PreloadAssetAlias
      : never
