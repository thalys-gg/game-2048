/**
 * A helper function to shuffle an array using the Fisher-Yates algorithm.
 * @template T
 * @param {T[]} array The array to shuffle.
 * @returns {T[]} The shuffled array.
 */
export function shuffle<T> (array: T[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]
  }
  return array
}
