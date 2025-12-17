import { AMBER, BLUE, CYAN, EMERALD, FUCHSIA, GRAY, GREEN, INDIGO, LIME, NEUTRAL, ORANGE, PINK, PURPLE, RED, ROSE, SKY, SLATE, STONE, TEAL, VIOLET, YELLOW, ZINC } from '∆/lib/colors.definitions'

type TColorName = 'red'
  | 'green'
  | 'blue'
  | 'orange'
  | 'amber'
  | 'yellow'
  | 'lime'
  | 'emerald'
  | 'teal'
  | 'cyan'
  | 'sky'
  | 'indigo'
  | 'violet'
  | 'purple'
  | 'fuchsia'
  | 'pink'
  | 'rose'
  | 'slate'
  | 'gray'
  | 'zinc'
  | 'neutral'
  | 'stone'

type TColorNumber = '50'
  | '100'
  | '200'
  | '300'
  | '400'
  | '500'
  | '600'
  | '700'
  | '800'
  | '900'
  | '950'

const COLORS = {
  red: RED,
  green: GREEN,
  blue: BLUE,
  orange: ORANGE,
  amber: AMBER,
  yellow: YELLOW,
  lime: LIME,
  emerald: EMERALD,
  teal: TEAL,
  cyan: CYAN,
  sky: SKY,
  indigo: INDIGO,
  violet: VIOLET,
  purple: PURPLE,
  fuchsia: FUCHSIA,
  pink: PINK,
  rose: ROSE,
  slate: SLATE,
  gray: GRAY,
  zinc: ZINC,
  neutral: NEUTRAL,
  stone: STONE,
} as const

export function getColor (colorWithNumber: `${TColorName}-${TColorNumber}`) {
  const [color, number] = colorWithNumber.split('-') as [TColorName, TColorNumber]
  return COLORS[color][number]
}
