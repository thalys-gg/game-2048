import type { AppScreens, IAppScreen, TAssetBundleId } from '∆/navigation.types'
import type { Ticker } from 'pixi.js'
import type { Direction } from '@/lib/types'
import { Container, Graphics } from 'pixi.js'
import { InputHandler } from '@/lib/input'
import { Label } from '@/ui/Label'

export class ScreenInput extends Container implements IAppScreen {
  public definition: AppScreens = 'ScreenInput'
  public override label: string = 'ScreenInput'
  public static assetBundles: TAssetBundleId[] = ['main']

  private _input: InputHandler
  private _indicators: Record<Direction, { bg: Graphics, label: Label }>
  private _activeTimers: Record<Direction, number> = {
    up: 0,
    down: 0,
    left: 0,
    right: 0,
  }

  private readonly ACTIVE_COLOR = 0x00FF00
  private readonly INACTIVE_COLOR = 0x333333
  private readonly TEXT_COLOR = 0xFFFFFF
  private readonly FLASH_DURATION = 10 // frames

  constructor () {
    super()
    this._input = new InputHandler()
    this._input.enabled = false // Enable only when shown

    this._indicators = {
      up: this._createIndicator('UP'),
      down: this._createIndicator('DOWN'),
      left: this._createIndicator('LEFT'),
      right: this._createIndicator('RIGHT'),
    }

    this.addChild(this._indicators.up.bg)
    this.addChild(this._indicators.down.bg)
    this.addChild(this._indicators.left.bg)
    this.addChild(this._indicators.right.bg)

    // Wire up signals
    this._input.onMove.connect(this._onInputMove)
  }

  private _createIndicator (text: string): { bg: Graphics, label: Label } {
    const bg = new Graphics()
    // Initial draw
    this._drawIndicatorBg(bg, this.INACTIVE_COLOR)

    const label = new Label({
      text,
      style: {
        fontSize: 24,
        fill: this.TEXT_COLOR,
      },
    })
    bg.addChild(label)

    return { bg, label }
  }

  private _drawIndicatorBg (g: Graphics, color: number) {
    g.clear()
    g.roundRect(-50, -50, 100, 100, 10).fill(color)
  }

  private _onInputMove = (direction: Direction) => {
    this._activeTimers[direction] = this.FLASH_DURATION
    this._drawIndicatorBg(this._indicators[direction].bg, this.ACTIVE_COLOR)
  }

  public resize ({ screen, parent }: {
    screen: { width: number, height: number }
    parent: { width: number, height: number }
  }) {
    const cx = screen.width * 0.5
    const cy = screen.height * 0.5
    const spacing = 110

    this._indicators.up.bg.position.set(cx, cy - spacing)
    this._indicators.down.bg.position.set(cx, cy + spacing)
    this._indicators.left.bg.position.set(cx - spacing, cy)
    this._indicators.right.bg.position.set(cx + spacing, cy)
  }

  public update (ticker: Ticker) {
    for (const d of ['up', 'down', 'left', 'right'] as Direction[]) {
      if (this._activeTimers[d] > 0) {
        this._activeTimers[d] -= ticker.deltaTime
        if (this._activeTimers[d] <= 0) {
          this._drawIndicatorBg(this._indicators[d].bg, this.INACTIVE_COLOR)
        }
      }
    }
  }

  public async show (): Promise<void> {
    this._input.enabled = true
  }

  public async hide (): Promise<void> {
    this._input.enabled = false
  }
}
