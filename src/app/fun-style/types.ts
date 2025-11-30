import type { PContainerChild, PTicker } from '∆/rosetta-stone/PixiJS'

export interface DisplayChildMethods {
  onInit?: () => DisplayChild
  onResize?: (params: {
    /** The width of the screen */
    sw: number
    /** The height of the screen */
    sh: number
  }) => void
  onUpdate?: (ticker: PTicker) => void
  onDestroy?: () => void
}

export type DisplayChild = PContainerChild & DisplayChildMethods
