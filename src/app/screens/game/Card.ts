import gsap from 'gsap'
import { Assets, Container, Sprite } from 'pixi.js'
import { CARD_BACK_TEXTURE, GAME_CONFIG } from './config'

/**
 * Represents a single card in the game. It's a container for the front and back sprites
 * and handles the flip animation.
 */
export class Card extends Container {
  public cardName: string
  public isFlipped: boolean
  private _frontSprite: Sprite
  private _backSprite: Sprite

  /**
   * @param {string} cardName - The identifier for the card's face.
   * @param {PIXI.Texture} frontTexture - The texture for the card's face.
   */
  constructor (cardName: string, frontTexture: string) {
    super()

    this.cardName = cardName
    this.isFlipped = false

    // Create front and back sprites
    this._frontSprite = Sprite.from(frontTexture)
    this._backSprite = Sprite.from(Assets.get(CARD_BACK_TEXTURE))

    this.pivot.set(0.5)

    // Center sprites
    this._frontSprite.pivot.set(0.5)
    this._frontSprite.anchor.set(0.5)
    this._backSprite.pivot.set(0.5)
    this._backSprite.anchor.set(0.5)

    // Add sprites to the container
    this.addChild(this._backSprite, this._frontSprite)

    // Start with the front face hidden
    this._frontSprite.scale.x = 0

    // Enable interaction
    this.eventMode = 'static'
    this.cursor = 'pointer'
  }

  /**
   * Flips the card with an animation.
   * @param {() => void} [onCompleteAnim] - Optional callback to run after the flip animation completes.
   */
  flip (onCompleteAnim?: () => void) {
    const targetScale = this.isFlipped ? 0 : 1
    this.isFlipped = !this.isFlipped

    // Use GSAP for the flip animation
    gsap.to(this._backSprite.scale, {
      x: 1 - targetScale,
      duration: GAME_CONFIG.animationDurations.cardFlip,
      ease: 'power2.inOut',
    })
    gsap.to(this._frontSprite.scale, {
      x: targetScale,
      duration: GAME_CONFIG.animationDurations.cardFlip,
      ease: 'power2.inOut',
      delay: GAME_CONFIG.animationDurations.cardFlip,
      onComplete: onCompleteAnim,
    })
  }
}
