import type { AudioConfig, GameConfig } from './types'

export const GAME_CONFIG: GameConfig = {
  gridPaddingX: 10,
  gridPaddingY: 10,
  cardNames: ['card-0', 'card-1', 'card-2', 'card-3', 'card-4', 'card-5'],
  defaultLives: 10,
  gridColumns: 4,
  flipDelay: 1000,
  matchDelay: 200,
  animationDurations: {
    cardSlide: 0.8,
    cardFlip: 0.2,
    cardMatch: 0.5,
    textBounce: 1,
    screenTransition: 0.5,
  },
}

export const AUDIO_PATHS: AudioConfig = {
  cardSlide: 'memory-game-phaser/audio/card-slide.mp3',
  cardMatch: 'memory-game-phaser/audio/card-match.mp3',
  cardMismatch: 'memory-game-phaser/audio/card-mismatch.mp3',
  victory: 'memory-game-phaser/audio/victory.mp3',
  whoosh: 'memory-game-phaser/audio/whoosh.mp3',
}

export const CARD_BACK_TEXTURE = 'card-back'

export const UI_CONSTANTS = {
  HEART_SCALE: 3,
  END_TEXT_STYLE: {
    align: 'center' as const,
    fontSize: 40,
    fill: '#8c7ae6',
    stroke: { color: '#ffffff', width: 4 },
  },
  GAME_OVER_COLOR: '#ff0000',
  BUTTON_PADDING: 30,
  SHAKE_INTENSITY: 10,
  SHAKE_REPEATS: 5,
  SHAKE_DURATION: 0.08,
}
