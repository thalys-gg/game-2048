import type { CanvasTextOptions } from 'pixi.js'
import { Graphics, Text } from 'pixi.js'

const defaultLabelStyle: Partial<CanvasTextOptions['style']> = {
  fontFamily: 'Arial Rounded MT Bold',
  align: 'center',
}

export type LabelOptions = CanvasTextOptions

/**
 * A Text extension pre-formatted for this app, starting centred by default,
 * because it is the most common use in the app.
 */
export class Label extends Text {

  private _g: Graphics

  constructor (opts?: LabelOptions) {

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
}

