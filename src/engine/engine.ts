import type { ApplicationOptions, DestroyOptions, RendererDestroyOptions } from 'pixi.js'
import { sound } from '@pixi/sound'
import { CreationAudioPlugin } from '∆/audio.plugin'
import { CreationNavigationPlugin } from '∆/navigation.plugin'
import { CreationResizePlugin } from '∆/resize.plugin'
import { getResolution } from '∆/utils/getResolution'
import { Application, extensions, ResizePlugin } from 'pixi.js'
import 'pixi.js/app'

extensions.remove(ResizePlugin)
extensions.add(CreationResizePlugin)
extensions.add(CreationAudioPlugin)
extensions.add(CreationNavigationPlugin)

/**
 * The main creation engine class.
 *
 * This is a lightweight wrapper around the PixiJS Application class.
 * It provides a few additional features such as:
 * - Navigation manager
 * - Audio manager
 * - Resize handling
 * - Visibility change handling (pause/resume sounds)
 *
 * Asset bootstrapping (manifest init + bundle loading) is intentionally left to
 * the consuming game, keeping the engine free of any generated asset manifest.
 */
export class CreationEngine extends Application {
  /** Initialize the application */
  public override async init(opts: Partial<ApplicationOptions>) {
    opts.resizeTo ??= globalThis.window
    opts.resolution ??= getResolution()

    await super.init(opts)

    // Append the application canvas to the document body
    document.getElementById('pixi-container')!.appendChild(this.canvas)
    // Add a visibility listener, so the app can pause sounds and screens
    document.addEventListener('visibilitychange', this.visibilityChange)
  }

  public override destroy(
    rendererDestroyOptions: RendererDestroyOptions = false,
    options: DestroyOptions = false,
  ): void {
    document.removeEventListener('visibilitychange', this.visibilityChange)
    super.destroy(rendererDestroyOptions, options)
  }

  /** Fire when document visibility changes - lose or regain focus */
  protected visibilityChange = () => {
    if (document.hidden) {
      sound.pauseAll()
      this.navigation.blur()
    } else {
      sound.resumeAll()
      this.navigation.focus()
    }
  }
}
