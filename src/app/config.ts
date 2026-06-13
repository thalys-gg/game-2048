import { getColor } from '∆/lib/colors'

export type TConfig = {
  winningValue: number
  board: { size: number; padding: number }
  score: {
    width: number
    height: number
    /** The aspect ratio of the score to be maintained e.g. w: 144 / 1.8 == h: 80 */
    aspect: number
  }
  rows: number
  cols: number
  piece: { size: number; radius: number; padding: number }
  themes: {
    boardBg: string
    score: {
      bg: string
      text: string
    }
    tileText: {
      light: string
      dark: string
    }
    tiles: { [key: number]: { bg: string; text: string } }
  }[]
}

export const CONFIG: TConfig = {
  winningValue: 4096,
  /** The size of the board */
  board: {
    size: 620,
    padding: 10,
  },

  score: {
    width: 144,
    height: 80,
    aspect: 1.8,
  },

  /** The number of pieces per row */
  rows: 4,

  /** The number of pieces per column */
  cols: 4,

  piece: {
    /** The size of a piece */
    size: 130,
    /** The radius of the pieces */
    radius: 10,
    /** The padding of the pieces */
    padding: 10,
  },

  themes: [
    {
      boardBg: getColor('stone-800'),
      score: {
        bg: getColor('stone-800'),
        text: getColor('stone-100'),
      },
      tileText: {
        light: getColor('stone-100'),
        dark: getColor('stone-800'),
      },
      tiles: {
        0: { bg: getColor('stone-700'), text: getColor('stone-100') },
        2: { bg: getColor('stone-200'), text: getColor('stone-800') },
        4: { bg: getColor('stone-300'), text: getColor('stone-800') },
        8: { bg: getColor('orange-200'), text: getColor('stone-800') },
        16: { bg: getColor('orange-400'), text: getColor('stone-100') },
        32: { bg: getColor('orange-500'), text: getColor('stone-100') },
        64: { bg: getColor('orange-600'), text: getColor('stone-100') },
        128: { bg: getColor('amber-300'), text: getColor('stone-800') },
        256: { bg: getColor('amber-400'), text: getColor('stone-800') },
        512: { bg: getColor('amber-500'), text: getColor('stone-100') },
        1024: { bg: getColor('yellow-400'), text: getColor('stone-800') },
        2048: { bg: getColor('yellow-500'), text: getColor('stone-100') },
        4096: { bg: getColor('slate-900'), text: getColor('stone-100') },
        8192: { bg: getColor('slate-900'), text: getColor('stone-100') },
        16384: { bg: getColor('slate-900'), text: getColor('stone-100') },
        32768: { bg: getColor('slate-900'), text: getColor('stone-100') },
      },
    },
  ],
}

export function getTheme(index: number = 0) {
  return CONFIG.themes[index]
}
