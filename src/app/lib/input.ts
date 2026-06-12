import type { Direction } from '@/lib/types'
import { Signal } from 'typed-signals'

export class InputHandler {
  public readonly onMove = new Signal<(direction: Direction) => void>()

  private _enabled = true
  private readonly _keyMap: Record<string, Direction> = {
    ArrowUp: 'up',
    ArrowDown: 'down',
    ArrowLeft: 'left',
    ArrowRight: 'right',
    KeyW: 'up',
    KeyS: 'down',
    KeyA: 'left',
    KeyD: 'right',
    // Vim-style bindings
    KeyK: 'up',
    KeyJ: 'down',
    KeyH: 'left',
    KeyL: 'right',
  }

  private _waitForKeyUp: Record<string, boolean> = {}

  constructor() {
    globalThis.window.addEventListener('keydown', this._onKeyDown)
    globalThis.window.addEventListener('keyup', this._onKeyUp)
  }

  public get enabled() {
    return this._enabled
  }
  public set enabled(value: boolean) {
    this._enabled = value
  }

  private _onKeyDown = (e: KeyboardEvent) => {
    if (!this._enabled) return
    if (this._waitForKeyUp[e.code]) return

    const direction = this._keyMap[e.code]
    if (direction) {
      e.preventDefault()
      this.onMove.emit(direction)
    }
    this._waitForKeyUp[e.code] = true
  }

  private _onKeyUp = (e: KeyboardEvent) => {
    this._waitForKeyUp[e.code] = false
  }

  public destroy() {
    globalThis.window.removeEventListener('keydown', this._onKeyDown)
    globalThis.window.removeEventListener('keyup', this._onKeyUp)
    this.onMove.disconnectAll()
  }
}
