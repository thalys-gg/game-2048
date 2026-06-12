import type { ResizeSignature } from '∆/types.signature'
import type { ContainerChild, DestroyOptions } from 'pixi.js'

export interface IResumable {
  /** Resume container, after hidden */
  resume?: () => Promise<void>
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

export interface IChild
  extends ContainerChild, IResizable, IPresentable, IResettable, IPreparable, IResumable {}
