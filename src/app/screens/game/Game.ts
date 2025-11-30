import { shuffle } from '∆/utils/array'
import gsap from 'gsap'
import { Assets, Container } from 'pixi.js'
import { engine } from '@/getEngine'
import { Card } from './Card'
import { AUDIO_PATHS, GAME_CONFIG, UI_CONSTANTS } from './config'
import { GameStateManager } from './GameStateManager'

export class Game extends Container {
  private cards: Card[] = []
  private cardOpened: Card | null = null
  private canMove = false
  private cardsContainer: Container
  private gameState: GameStateManager

  private _onGameEnd: (didWin: boolean) => void
  private _onMismatch: () => void

  constructor (onGameEnd: (didWin: boolean) => void, onMismatch: () => void) {
    super()
    this.label = 'Game'

    this._onGameEnd = onGameEnd
    this._onMismatch = onMismatch
    this.gameState = new GameStateManager()

    this.cardsContainer = new Container()
    this.addChild(this.cardsContainer)
  }

  public prepare () {
    this.canMove = false
    this.cardOpened = null
    this.cards = []
    this.gameState.reset()

    this.createGridCards()

    this.gameState.onLivesChanged(() => {
      this._onMismatch()
    })
  }

  public resize (width: number, height: number) {
    this.cardsContainer.pivot.set(0.5)
    this.cardsContainer.x = width * 0.5 - this.cardsContainer.width * 0.5
    this.cardsContainer.y = height * 0.5 - this.cardsContainer.height * 0.5
  }

  public show () {
    const dealDelay = 200 * (GAME_CONFIG.cardNames.length * 2)
    setTimeout(() => {
      this.canMove = true
      this.gameState.startGame()
    }, dealDelay)
  }

  createGridCards () {
    const gridCardNames = shuffle([...GAME_CONFIG.cardNames, ...GAME_CONFIG.cardNames])
    const { gridPaddingX, gridPaddingY } = GAME_CONFIG

    gridCardNames.forEach((name, index) => {
      const card = new Card(name, Assets.get(name))
      const width = card.width
      const height = card.height
      const col = index % GAME_CONFIG.gridColumns
      const row = Math.floor(index / GAME_CONFIG.gridColumns)

      const posX = col * (width + gridPaddingX) + width * 0.5
      const posY = row * (height + gridPaddingY) + height * 0.5

      card.position.set(posX, posY - height)
      card.alpha = 0

      this.cardsContainer.addChild(card)
      this.cards.push(card)

      gsap.to(card, {
        y: posY,
        alpha: 1,
        duration: GAME_CONFIG.animationDurations.cardSlide,
        delay: index * 0.1,
        ease: 'bounce.out',
        onStart: () => engine().audio.sfx.play(AUDIO_PATHS.cardSlide, { volume: 1.2 }),
      })

      card.on('pointerdown', () => this.onCardClicked(card))
    })
  }

  onCardClicked (card: Card) {
    if (!this.canMove || card.isFlipped || card === this.cardOpened) { return }

    this.canMove = false
    card.flip(() => {
      if (this.cardOpened) {
        if (this.cardOpened.cardName === card.cardName) {
          this.handleMatch(card, this.cardOpened)
        } else {
          this.handleMismatch(card, this.cardOpened)
        }
      } else {
        this.cardOpened = card
        this.canMove = true
      }
    })
  }

  handleMatch (card1: Card, card2: Card) {
    engine().audio.sfx.play(AUDIO_PATHS.cardMatch)
    gsap.to([card1, card2], {
      alpha: 0,
      y: '+=50',
      duration: GAME_CONFIG.animationDurations.cardMatch,
      delay: GAME_CONFIG.matchDelay / 1000,
    })

    this.cards = this.cards.filter(c => c !== card1 && c !== card2)
    this.cardOpened = null
    this.canMove = true
    this.gameState.incrementMatchedPairs()

    if (this.cards.length === 0) {
      this.endGame(true)
    }
  }

  handleMismatch (card1: Card, card2: Card) {
    engine().audio.sfx.play(AUDIO_PATHS.cardMismatch)
    this.gameState.decrementLives()

    gsap.to(this, {
      x: `+=${UI_CONSTANTS.SHAKE_INTENSITY}`,
      yoyo: true,
      repeat: UI_CONSTANTS.SHAKE_REPEATS,
      duration: UI_CONSTANTS.SHAKE_DURATION,
      ease: 'power1.inOut',
      overwrite: true,
    })

    setTimeout(() => {
      card1.flip()
      card2.flip(() => {
        this.cardOpened = null
        this.canMove = true
        if (this.gameState.lives === 0) {
          this.endGame(false)
        }
      })
    }, GAME_CONFIG.flipDelay)
  }

  endGame (didWin: boolean) {
    this.canMove = false
    this.gameState.endGame(didWin ? 'win' : 'lose')
    this._onGameEnd(didWin)
  }
}
