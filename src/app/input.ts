import { Signal } from 'typed-signals'


export type Direction = 'up' | 'down' | 'left' | 'right'

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

  constructor () {
    globalThis.window.addEventListener('keydown', this._onKeyDown)
  }

  public get enabled () { return this._enabled }
  public set enabled (value: boolean) { this._enabled = value }

  private _onKeyDown = (e: KeyboardEvent) => {
    if (!this._enabled) return

    const direction = this._keyMap[e.code]
    if (direction) {
      e.preventDefault()
      this.onMove.emit(direction)
    }
  }

  public destroy () {
    globalThis.window.removeEventListener('keydown', this._onKeyDown)
    this.onMove.disconnectAll()
  }
}
