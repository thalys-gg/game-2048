import type { GameState } from './types'
import { GAME_CONFIG } from './config'

class SimpleEventEmitter {
  private events: Record<string, ((...args: any[]) => void)[]> = {}

  on (event: string, callback: (...args: any[]) => void): void {
    if (!this.events[event]) {
      this.events[event] = []
    }
    this.events[event].push(callback)
  }

  emit (event: string, ...args: any[]): void {
    if (this.events[event]) {
      this.events[event].forEach(callback => callback(...args))
    }
  }

  removeAllListeners (): void {
    this.events = {}
  }
}

export class GameStateManager extends SimpleEventEmitter {
  private _state: GameState

  constructor () {
    super()
    this._state = this.createInitialState()
  }

  private createInitialState (): GameState {
    return {
      lives: GAME_CONFIG.defaultLives,
      isGameActive: false,
      flippedCards: [],
      matchedPairs: 0,
      totalPairs: GAME_CONFIG.cardNames.length,
    }
  }

  get state (): Readonly<GameState> {
    return { ...this._state }
  }

  get lives (): number {
    return this._state.lives
  }

  get isGameActive (): boolean {
    return this._state.isGameActive
  }

  get flippedCards () {
    return [...this._state.flippedCards]
  }

  get matchedPairs (): number {
    return this._state.matchedPairs
  }

  get totalPairs (): number {
    return this._state.totalPairs
  }

  reset (): void {
    this._state = this.createInitialState()
    this.emit('stateChanged', this._state)
  }

  startGame (): void {
    this._state.isGameActive = true
    this.emit('gameStarted')
    this.emit('stateChanged', this._state)
  }

  endGame (result: 'win' | 'lose'): void {
    this._state.isGameActive = false
    this.emit(result === 'win' ? 'gameWon' : 'gameOver')
    this.emit('stateChanged', this._state)
  }

  decrementLives (): void {
    if (this._state.lives > 0) {
      this._state.lives--
      this.emit('livesChanged', this._state.lives)
      this.emit('stateChanged', this._state)

      if (this._state.lives === 0) {
        this.endGame('lose')
      }
    }
  }

  setLives (lives: number): void {
    this._state.lives = Math.max(0, lives)
    this.emit('livesChanged', this._state.lives)
    this.emit('stateChanged', this._state)
  }

  addFlippedCard (card: any): void {
    this._state.flippedCards.push(card)
    this.emit('cardFlipped', card)
    this.emit('stateChanged', this._state)
  }

  clearFlippedCards (): void {
    this._state.flippedCards = []
    this.emit('stateChanged', this._state)
  }

  incrementMatchedPairs (): void {
    this._state.matchedPairs++
    this.emit('pairMatched', this._state.matchedPairs)
    this.emit('stateChanged', this._state)

    if (this._state.matchedPairs === this._state.totalPairs) {
      this.endGame('win')
    }
  }

  // Event listener helpers for type safety
  onStateChanged (callback: (state: GameState) => void): void {
    this.on('stateChanged', callback)
  }

  onGameStarted (callback: () => void): void {
    this.on('gameStarted', callback)
  }

  onGameWon (callback: () => void): void {
    this.on('gameWon', callback)
  }

  onGameOver (callback: () => void): void {
    this.on('gameOver', callback)
  }

  onLivesChanged (callback: (lives: number) => void): void {
    this.on('livesChanged', callback)
  }

  onCardFlipped (callback: (card: any) => void): void {
    this.on('cardFlipped', callback)
  }

  onPairMatched (callback: (matchedPairs: number) => void): void {
    this.on('pairMatched', callback)
  }
}
