import type { BGM, SFX } from '@thalys/pixi-shared/audio'
import type { Navigation } from '@thalys/pixi-shared/navigation'
import type { ResizePluginOptions } from 'pixi.js'

export type DeepRequired<T> = Required<{
  [K in keyof T]: DeepRequired<T[K]>
}>

export interface CreationResizePluginOptions extends ResizePluginOptions {
  resizeOptions?: {
    minWidth?: number
    minHeight?: number
    letterbox?: boolean
  }
}

declare global {
  namespace PixiMixins {
    interface Application extends DeepRequired<CreationResizePluginOptions> {
      audio: {
        bgm: BGM
        sfx: SFX
        getMasterVolume: () => number
        setMasterVolume: (volume: number) => void
      }
      navigation: Navigation
    }
    interface ApplicationOptions extends CreationResizePluginOptions {}
  }
}
