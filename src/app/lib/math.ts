import { rollFloat } from '@thalys/pixi-shared/lib/random'

/**
 * Creates a random number for a new pawn on the board
 *
 * @returns 2 or 4
 */
export function rollNewPawnValue(): 2 | 4 {
  return rollFloat() >= 0.95 ? 4 : 2
}
