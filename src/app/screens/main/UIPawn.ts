import type { Coordinate } from '@thalys/pixi-shared/lib/flat-grid'
import type { ObjectTarget } from 'motion'
import { animate } from 'motion'
import { Container, Sprite } from 'pixi.js'
import { getTheme } from '@/config'
import textures from '@/lib/textures'
import { Label } from '@/ui/Label'

const theme = getTheme()

export const TILE_SLIDE_S = 0.12
export const TILE_MERGE_S = 0.1
export const TILE_SPAWN_S = 0.15

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

  public async spawnIn() {
    this.scale.set(0.6)
    this.alpha = 0

    await Promise.all([
      animate(this.scale, { x: 1, y: 1 }, { duration: TILE_SPAWN_S, ease: 'backOut' }),
      animate(this, { alpha: 1 } as ObjectTarget<this>, { duration: TILE_SPAWN_S, ease: 'circOut' }),
    ])
  }

  public async slideTo(x: number, y: number, duration = TILE_SLIDE_S) {
    await animate(this, { x, y } as ObjectTarget<this>, { duration, ease: 'easeOut' })
  }

  public async mergePop(newValue: number, duration = TILE_MERGE_S) {
    this.value = newValue
    const half = duration / 2
    await animate(this.scale, { x: 1.12, y: 1.12 }, { duration: half, ease: 'easeOut' })
    await animate(this.scale, { x: 1, y: 1 }, { duration: half, ease: 'easeIn' })
  }

  public async fadeOutAndShrink(duration = TILE_MERGE_S * 0.8) {
    await Promise.all([
      animate(this, { alpha: 0 } as ObjectTarget<this>, { duration, ease: 'easeIn' }),
      animate(this.scale, { x: 0.5, y: 0.5 }, { duration, ease: 'easeIn' }),
    ])
  }

  /** Updates the layout of the pawn's children. Re-centers the value label within the sprite */
  public resize(coords?: Coordinate) {
    if (coords) {
      this.coords = coords
    }

    this.x = this.coords.x
    this.y = this.coords.y
    this.scale.set(1)
    this.alpha = 1
  }
}