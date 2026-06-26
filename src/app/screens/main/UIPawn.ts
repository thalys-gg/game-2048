import type { Coordinate } from '@thalys/pixi-shared/lib/flat-grid'
import type { ObjectTarget } from 'motion'
import { animate } from 'motion'
import { Container, Sprite } from 'pixi.js'
import { getTileTheme } from '@/config'
import textures from '@/lib/textures'
import { Label } from '@/ui/Label'

export const TILE_SLIDE_S = 0.108
export const TILE_MERGE_S = 0.09
export const TILE_SPAWN_S = 0.135
const TILE_SHAKE_AMP = 5

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
      fill: getTileTheme(value).text,
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
    this.text.style.fill = getTileTheme(value).text
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

  public async mergeSlam(newValue: number, duration = TILE_MERGE_S) {
    this.value = newValue
    const windUp = duration * 0.12
    const slam = duration * 0.28
    const rebound = duration * 0.6

    await animate(this.scale, { x: 1.06, y: 1.06 }, { duration: windUp, ease: 'easeOut' })
    await animate(this.scale, { x: 0.86, y: 0.86 }, { duration: slam, ease: 'easeIn' })
    await animate(this.scale, { x: 1.14, y: 1.14 }, { duration: rebound * 0.45, ease: 'backOut' })
    await animate(this.scale, { x: 1, y: 1 }, { duration: rebound * 0.55, ease: 'easeOut' })
  }

  public async shakeFromImpact(
    impactX: number,
    impactY: number,
    duration = TILE_MERGE_S,
  ) {
    const ox = this.x
    const oy = this.y
    const dx = ox - impactX
    const dy = oy - impactY
    const len = Math.hypot(dx, dy) || 1
    const pushX = (dx / len) * TILE_SHAKE_AMP
    const pushY = (dy / len) * TILE_SHAKE_AMP
    const step = duration / 4

    await animate(this, { x: ox + pushX, y: oy + pushY } as ObjectTarget<this>, {
      duration: step,
      ease: 'easeOut',
    })
    await animate(this, { x: ox - pushX * 0.55, y: oy - pushY * 0.55 } as ObjectTarget<this>, {
      duration: step,
      ease: 'easeInOut',
    })
    await animate(this, { x: ox + pushX * 0.25, y: oy + pushY * 0.25 } as ObjectTarget<this>, {
      duration: step,
      ease: 'easeInOut',
    })
    await animate(this, { x: ox, y: oy } as ObjectTarget<this>, { duration: step, ease: 'easeOut' })
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