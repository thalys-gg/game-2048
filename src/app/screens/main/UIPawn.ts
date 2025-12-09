import { Sprite } from 'pixi.js'
import textures from '@/textures'
import { Label } from '@/ui/Label'

/**
 * Represents a pawn (tile) in the game grid.
 * It visualizes the numeric value and the corresponding background texture.
 */
export class UIPawn extends Sprite {

  private _text: Label
  private _value: number

  /**
   * Sets the value of the pawn.
   * Updates the internal value, the text label, and the sprite texture.
   *
   * @param value - The new numeric value for the pawn.
   */
  public set value (value: number) {
    this._value = value
    this._text.text = `${value}`
    this.texture = textures.getPawn(value)
  }

  /**
   * Gets the current value of the pawn.
   *
   * @returns The numeric value of the pawn.
   */
  public get value () {
    return this._value
  }

  /**
   * Creates a new UIPawn instance.
   * Initializes the sprite with the correct texture and places the text label in the center.
   *
   * @param value - The initial value of the pawn.
   */
  constructor (value: number) {
    super(textures.getPawn(value))

    this._value = value
    this._text = new Label({
      text: `${value}`,
      style: {
        fontSize: 48,
      },
    })
    this._text.anchor.set(0.5)
    this.addChild(this._text)
    this._text.x = this.width * 0.5
    this._text.y = this.height * 0.5
  }

  /**
   * Updates the layout of the pawn's children.
   * Re-centers the value label within the sprite.
   *
   * @param width - The width of the container (unused, but kept for consistency).
   * @param height - The height of the container (unused, but kept for consistency).
   */
  public resize (width: number, height: number) {
    this._text.x = this.width * 0.5
    this._text.y = this.height * 0.5
  }
}
