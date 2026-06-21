import type { CanvasTextOptions } from 'pixi.js'
import { Graphics, Text } from 'pixi.js'

const defaultLabelStyle: Partial<CanvasTextOptions['style']> = {
  fontFamily: 'Arial Rounded MT Bold',
  align: 'center',
}

export type LabelOptions = CanvasTextOptions

/**
 * A Text extension pre-formatted for this app, starting centred by default, because it is the most common use in the
 * app.
 */
export class Label extends Text {
  private _g: Graphics

  constructor(opts?: LabelOptions) {
    const { style = {}, ...rest } = opts || {}

    const textOptions = {
      style: {
        ...defaultLabelStyle,
        ...style,
      },
      ...rest,
    }

    super(textOptions)

    this.pivot.set(0.5)
    this.anchor.set(0.5)

    this._g = new Graphics()
    this.addChild(this._g)
  }

  // helper to sync bg with text bounds
  // drawDebugBg () {
  //   const { x, y, width, height } = this.getLocalBounds()
  //   this._g.clear()
  //   this._g.rect(x, y, width, height)
  //   // this._g.fill({ color: 0xFF0000, alpha: 0.5 })
  //   this._g.stroke({ width: 2, color: 0xFF0000, alpha: 0.5 })
  //   this._g.rotation = this.rotation
  //   this._g.scale.set(this.scale.x, this.scale.y)
  //   this._g.pivot.set(this.pivot.x, this.pivot.y)
  // }

  /**
   * Draws a debug rectangle around a PixiJS container (like Text)
   *
   * @param {PIXI.Container} target - The object to debug
   * @param {PIXI.Container} parent - The stage or container to add the graphic to
   * @param {number} color - Hex color of the rectangle (default: 0xff0000)
   */
  // drawDebugRectangle (target: Text, parent: Container, color = 0xFF0000) {
  //   // 1. Create a new Graphics object
  //   const debugGraphic = new Graphics()
  //   // 2. Get the local bounds of the target
  //   // In v8, getLocalBounds() returns a Bounds object
  //   const bounds = target.getLocalBounds()
  //   // 3. Draw the rectangle
  //   // We use the bounds x, y, width, and height
  //   debugGraphic.rect(bounds.x, bounds.y, bounds.width, bounds.height)
  //   debugGraphic.stroke({ width: 2, color, alignment: 0 })
  //   // 4. Position the graphic to match the target's world position
  //   debugGraphic.position.set(target.x, target.y)
  //   debugGraphic.rotation = target.rotation
  //   debugGraphic.scale.set(target.scale.x, target.scale.y)
  //   debugGraphic.pivot.set(target.pivot.x, target.pivot.y)
  //   // 5. Add to the scene
  //   parent.addChild(debugGraphic)
  //   return debugGraphic
  // }
}
