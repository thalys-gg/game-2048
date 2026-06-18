import type { RulerOptions } from '∆/scene/stage-ruler.types'
import type { TAnchorByPosition } from '∆/utils/pixijs.types'
import type { Ticker } from 'pixi.js'
import { ZINC } from '∆/lib/colors'
import { anchorBy } from '∆/utils/pixijs'
import { Container, Graphics, Text, TextStyle } from 'pixi.js'

const _options: RulerOptions = {
  majorTick: 100,
  minorTick: 50,
  microTick: 10,
  showLabels: { normal: true, major: true, minor: false },
  showCrosshair: true,
  showHorizontal: true,
  showVertical: true,
  rulerColor: ZINC[200],
  labelColor: ZINC[200],
  backgroundColor: ZINC[900],
}

export class Ruler extends Container {
  public static options = Object.assign({}, _options)

  private textStyle = new TextStyle({
    fontFamily: 'monospace',
    fontSize: 10,
    fill: Ruler.options.labelColor,
    stroke: {
      color: Ruler.options.backgroundColor,
      width: 1,
    },
  })

  public override label = 'Measure'
  public definition = 'Measure' as const

  private rulers: Graphics = new Graphics()
  private labels: Container = new Container()
  private crosshair: Graphics = new Graphics()

  constructor(options?: Partial<RulerOptions>) {
    super()

    if (options) {
      Ruler.options = { ...Ruler.options, ...options }
    }

    this.addChild(this.rulers)
    this.addChild(this.labels)
    this.addChild(this.crosshair)

    this.x = 0
    this.y = 0
    this.alpha = 0.6
    this.visible = false
  }

  /**
   * Creates ruler-style measurement guides with ticks and labels
   */
  buildRulers(width: number, height: number) {
    const { showCrosshair, backgroundColor, showHorizontal, showVertical } = Ruler.options

    // Clear existing graphics
    this.rulers.clear()
    this.crosshair.clear()
    this.labels.removeChildren()

    // Ruler background strips
    showHorizontal && this.rulers.rect(0, 0, width, 30).fill({ color: backgroundColor, alpha: 0.7 })
    showVertical && this.rulers.rect(0, 0, 30, height).fill({ color: backgroundColor, alpha: 0.7 })

    // Horizontal ruler (top)
    showHorizontal && this.buildHorizontalRuler(width)

    // Vertical ruler (left)
    showVertical && this.buildVerticalRuler(height)

    // Optional crosshair at center
    if (showCrosshair) {
      this.buildCrosshair(width, height)
    }
  }

  private buildHorizontalRuler(width: number) {
    const { majorTick, minorTick, microTick, showLabels, rulerColor } = Ruler.options

    for (let x = 0; x <= width; x += microTick) {
      let tickHeight = 5
      let strokeWidth = 1

      if (x % majorTick === 0) {
        // Major tick
        tickHeight = 20
        strokeWidth = 2

        if (showLabels.major && x > 0) {
          this.addLabel(x.toString(), x, 46, 'top')
        }
      } else if (x % minorTick === 0) {
        // Minor tick
        tickHeight = 12
        strokeWidth = 1
      }

      this.rulers
        .moveTo(x, 30 - tickHeight)
        .lineTo(x, 30)
        .stroke({ color: rulerColor, width: strokeWidth })
    }

    // Ruler border
    this.rulers.moveTo(0, 30).lineTo(width, 30).stroke({ color: rulerColor, width: 2 })
  }

  private buildVerticalRuler(height: number) {
    const { majorTick, minorTick, microTick, showLabels, rulerColor } = Ruler.options

    for (let y = 0; y <= height; y += microTick) {
      let tickWidth = 5
      let strokeWidth = 1

      if (y % majorTick === 0) {
        // Major tick
        tickWidth = 20
        strokeWidth = 2

        if (showLabels && y > 0) {
          this.addLabel(y.toString(), 34, y, 'left')
        }
      } else if (y % minorTick === 0) {
        // Minor tick
        tickWidth = 12
        strokeWidth = 1
      }

      this.rulers
        .moveTo(30 - tickWidth, y)
        .lineTo(30, y)
        .stroke({ color: rulerColor, width: strokeWidth })
    }

    // Ruler border
    this.rulers.moveTo(30, 0).lineTo(30, height).stroke({ color: rulerColor, width: 2 })
  }

  private buildCrosshair(width: number, height: number) {
    const { rulerColor } = Ruler.options

    const centerX = width / 2
    const centerY = height / 2

    // Horizontal crosshair line
    this.crosshair
      .moveTo(30, centerY)
      .lineTo(width, centerY)
      .stroke({ color: rulerColor, width: 1, alpha: 0.5 })

    // Vertical crosshair line
    this.crosshair
      .moveTo(centerX, 30)
      .lineTo(centerX, height)
      .stroke({ color: rulerColor, width: 1, alpha: 0.5 })

    // Center point marker
    this.crosshair.circle(centerX, centerY, 3).fill({ color: rulerColor, alpha: 0.7 })
  }

  private addLabel(text: string, x: number, y: number, anchorPosition: TAnchorByPosition = 'left') {
    const style = this.textStyle
    const label = new Text({ text, style })
    anchorBy(label, anchorPosition)

    label.x = x
    label.y = y

    this.labels.addChild(label)
  }

  // AppScreen interface methods
  async show(): Promise<void> {
    this.visible = true
  }

  async hide(): Promise<void> {
    this.visible = false
  }

  prepare(): void {
    // Setup initial state
  }

  reset(): void {
    // Clean up state
    this.rulers.clear()
    this.crosshair.clear()
    this.labels.removeChildren()
  }

  update(ticker: Ticker): void {
    // Update logic if needed
  }

  resize({
    screen,
    parent,
  }: {
    screen: { width: number; height: number }
    parent: { width: number; height: number }
  }): void {
    this.buildRulers(screen.width, screen.height)
  }

  blur(): void {
    this.alpha = 0.5
  }

  focus(): void {
    this.alpha = 0.8
  }

  /**
   * Toggle visibility of the measurement overlay
   */
  toggle(): void {
    this.visible = !this.visible
  }
}
