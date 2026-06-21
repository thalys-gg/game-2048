import type { Coordinate } from '@thalys/pixi-shared/lib/flat-grid'
import type { ObjectTarget } from 'motion'
import { animate } from 'motion'
import { Container, Sprite } from 'pixi.js'
import { getTheme } from '@/config'
import textures from '@/lib/textures'
import { Label } from '@/ui/Label'

const theme = getTheme()

function createSquare(value: number, parent: Container, label?: string) {
  const pawn = Sprite.from(textures.getPawn(value))
  pawn.label = label || 'PawnBackground'
  pawn.alpha = 1
  pawn.anchor.set(0.5)
  parent.addChild(pawn)
  return pawn
}

function createLabel(value: number, parent: Container, label?: string) {
  const text = new Label({
    text: `${value}`,
    style: {
      fontSize: 48,
      fill: theme.tiles[value].text,
    },
  })
  text.label = label || 'PawnValue'
  text.alpha = 1
  parent.addChild(text)
  return text
}

/** Represents a pawn (tile) in the game grid. It visualizes the numeric value and the corresponding background texture. */
export class UIPawn extends Container {
  private bg: Sprite
  private text: Label
  private _value: number
  private coords: Coordinate

  /**
   * Sets the value of the pawn. Updates the internal value, the text label, and the sprite texture.
   *
   * @param value - The new numeric value for the pawn.
   */
  public set value(value: number) {
    this._value = value
    this.text.style.fill = theme.tiles[value].text
    this.text.text = `${value}`
    this.bg.texture = textures.getPawn(value)
  }

  /**
   * Gets the current value of the pawn.
   *
   * @returns The numeric value of the pawn.
   */
  public get value() {
    return this._value
  }

  /**
   * Creates a new UIPawn instance. Initializes the sprite with the correct texture and places the text label in the
   * center.
   *
   * @param value - The initial value of the pawn.
   */
  constructor(value: number, coords: Coordinate) {
    super()
    this.coords = coords
    this._value = value

    this.x = coords.x
    this.y = coords.y

    this.bg = createSquare(value, this)
    this.text = createLabel(value, this)
  }

  public async show() {
    animate(this.scale, { x: 1, y: 1 }, { duration: 0.5, ease: 'backOut' })
    await animate(this, { alpha: 1 } as ObjectTarget<this>, { duration: 0.5, ease: 'circOut' })
  }

  /** Updates the layout of the pawn's children. Re-centers the value label within the sprite */
  public resize(coords?: Coordinate) {
    if (coords) {
      this.coords = coords
    }

    this.x = this.coords.x
    this.y = this.coords.y
  }
}
