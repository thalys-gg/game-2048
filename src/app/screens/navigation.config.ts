import type { IAppScreenConstructor, NavigationConfig } from '@thalys/pixi-shared/types'
import type { AppScreens } from '@/screens/screens.types'
import { storage } from '@thalys/pixi-shared/storage'
import { ScreenInput } from '@/screens/debug/ScreenInput'
import { ScreenPawn } from '@/screens/debug/ScreenPawn'
import { ScreenMain } from '@/screens/main/ScreenMain'

const KEY_LAST_SCREEN = 'last-screen'

/**
 * Screens that should never be persisted or restored as the "last session"
 * screen (e.g. the loading screen, overlays, and measurement ruler).
 */
const NON_RESTORABLE_SCREENS = new Set<string>([
  'Measure',
  'ScreenAssetLoader',
  'OverlayUI',
  'Background',
  'ScreenBase',
])

/**
 * Map a visited screen id to the id that should be persisted as the
 * "last screen", or `null` when the visit should not be persisted.
 */
function resolvePersistId(screen: string): AppScreens | null {
  if (NON_RESTORABLE_SCREENS.has(screen)) return null
  return 'ScreenMain'
}

/** Map a persisted screen id back to its concrete screen constructor */
function resolveScreen(screen: string): IAppScreenConstructor | null {
  if (NON_RESTORABLE_SCREENS.has(screen)) return null

  switch (screen) {
    case 'ScreenPawn':
      return ScreenPawn
    case 'ScreenInput':
      return ScreenInput
    default:
      // Unknown or missing persisted screen -> fall back to the main screen
      return ScreenMain
  }
}

/**
 * Game routing/persistence behavior injected into the engine's screen-agnostic
 * navigation via `engine().navigation.configure(navigationConfig)`.
 */
export const navigationConfig: NavigationConfig = {
  getBackScreen: () => ScreenMain,
  resolveScreen,
  resolvePersistId,
  persistScreen: (id) => storage.setString(KEY_LAST_SCREEN, id),
  getPersistedScreen: () => storage.getString(KEY_LAST_SCREEN) ?? undefined,
}
