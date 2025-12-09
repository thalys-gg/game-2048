import { AMBER, ORANGE, SLATE, STONE, YELLOW } from '∆/utils/colors'

export type TConfig = {
  board: {
    size: number
    padding: number
  }
  rows: number
  cols: number
  piece: {
    size: number
    radius: number
    padding: number
  }
  theme: {
    boardBg: string
    textLight: string
    textDark: string
    tiles: {
      [key: number]: {
        bg: string
        text: string
      }
    }
  }
}

export const CONFIG: TConfig = {
  /** The size of the board */
  board: {
    size: 620,
    padding: 10,
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

  theme: {
    /** The background color of the board */
    boardBg: STONE[800],
    /** The text color for light tiles */
    textLight: STONE[100],
    /** The text color for dark tiles */
    textDark: STONE[800],
    /** The tiles configuration */
    tiles: {
      0: { bg: STONE[700], text: STONE[800] },
      2: { bg: STONE[200], text: STONE[800] },
      4: { bg: STONE[300], text: STONE[800] },
      8: { bg: ORANGE[200], text: STONE[800] },
      16: { bg: ORANGE[400], text: STONE[100] },
      32: { bg: ORANGE[500], text: STONE[100] },
      64: { bg: ORANGE[600], text: STONE[100] },
      128: { bg: AMBER[300], text: STONE[800] },
      256: { bg: AMBER[400], text: STONE[800] },
      512: { bg: AMBER[500], text: STONE[100] },
      1024: { bg: YELLOW[400], text: STONE[800] },
      2048: { bg: YELLOW[500], text: STONE[100] },
      4096: { bg: SLATE[900], text: STONE[100] },
    },
  },
}
