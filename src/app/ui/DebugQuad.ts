import { Graphics } from 'pixi.js'

/** A debug visualization component that draws a colored rectangle to help visualize container bounds and positioning. */
export class DebugQuad extends Graphics {
  private _width: number
  private _height: number
  private _fillColor: number
  private _fillAlpha: number
  private _strokeColor: number
  private _strokeWidth: number

  constructor(
    options: {
      width?: number
      height?: number
      fillColor?: number
      fillAlpha?: number
      strokeColor?: number
      strokeWidth?: number
    } = {},
  ) {
    super()
    this.label = 'DebugQuad'

    this._width = options.width ?? 100
    this._height = options.height ?? 100
    this._fillColor = options.fillColor ?? 0xde3249
    this._fillAlpha = options.fillAlpha ?? 0.2
    this._strokeColor = options.strokeColor ?? 0xff0000
    this._strokeWidth = options.strokeWidth ?? 2

    this.draw()
  }

  /** Updates the debug quad dimensions and redraws it */
  public updateSize(width: number, height: number): void {
    this._width = width
    this._height = height
    this.draw()
  }

  /** Updates the debug quad to match its parent container dimensions */
  public updateToParentSize(): void {
    if (this.parent) {
      // Temporarily remove self to get parent bounds without the debug quad
      const parent = this.parent
      parent.removeChild(this)

      // Get the actual content bounds
      const bounds = parent.getFastGlobalBounds()

      // Add self back
      parent.addChildAt(this, 0)

      this.updateSize(bounds.width, bounds.height)
    }
  }

  /** Updates the debug quad colors and redraws it */
  public updateColors(fillColor?: number, fillAlpha?: number, strokeColor?: number, strokeWidth?: number): void {
    if (fillColor !== undefined) {
      this._fillColor = fillColor
    }
    if (fillAlpha !== undefined) {
      this._fillAlpha = fillAlpha
    }
    if (strokeColor !== undefined) {
      this._strokeColor = strokeColor
    }
    if (strokeWidth !== undefined) {
      this._strokeWidth = strokeWidth
    }
    this.draw()
  }

  /** Redraws the debug quad with current settings */
  private draw(): void {
    this.clear()
    this.rect(0, 0, this._width, this._height)
    this.fill({ color: this._fillColor, alpha: this._fillAlpha })
    this.stroke({ color: this._strokeColor, width: this._strokeWidth })
  }
}
