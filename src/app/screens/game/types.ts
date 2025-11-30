export interface GameConfig {
  gridPaddingX: number
  gridPaddingY: number
  cardNames: string[]
  defaultLives: number
  gridColumns: number
  flipDelay: number
  matchDelay: number
  animationDurations: {
    cardSlide: number
    cardFlip: number
    cardMatch: number
    textBounce: number
    screenTransition: number
  }
}

export interface GameState {
  lives: number
  isGameActive: boolean
  flippedCards: Card[]
  matchedPairs: number
  totalPairs: number
}

export interface Card {
  id: string
  name: string
  isFlipped: boolean
  isMatched: boolean
  gridPosition: { row: number, col: number }
}

export interface GameEvents {
  onCardFlip: (card: Card) => void
  onMatch: (card1: Card, card2: Card) => void
  onMismatch: (card1: Card, card2: Card) => void
  onGameWin: () => void
  onGameOver: () => void
  onLivesChanged: (lives: number) => void
}

export type GameEndResult = 'win' | 'lose'

export interface AudioConfig {
  cardSlide: string
  cardMatch: string
  cardMismatch: string
  victory: string
  whoosh: string
}
