export function shuffle<T> (array: T[], rand: () => number = Math.random): T[] {

  const result = array.slice()

  let length = array.length
  while (length > 0) {
    const i = Math.floor(rand() * length--)
    const temp = result[length]
    result[length] = result[i]
    result[i] = temp
  }

  return result
}

export function uniques<T> (arr: T[]) {
  return Array.from(new Set(arr))
}

/**
 * Returns a random item
 * @param arr - The array to choose from
 * @returns The randomly selected item
 */
export function choose<T> (arr: T[], rand: () => number = Math.random): T {
  return arr[Math.floor(rand() * arr.length)]
}

export function randomPick<T> (arr: T[], count: number) {
  return shuffle(arr.slice()).slice(0, count)
}

/**
 * Returns a random element from the given array within the specified range.
 *
 * @param {Array} array - The array to select a random element from.
 * @param {number} min - The minimum index (default: 0).
 * @param {number} max - The maximum index (default: array.length - 1).
 * @returns {*} - The randomly selected element.
 */
export function pick<T> (array: T[], min: number = 0, max: number = array.length - 1): T {
  const randomIndex = Math.floor(Math.random() * (max - min + 1)) + min
  return array[randomIndex]
}

// Generic toMap function that converts an array to a Map
// Uses a key selector function to determine the map keys
export function toMap<T, K> (
  array: readonly T[],
  keySelector: (item: T) => K,
): Map<K, T> {
  return new Map(array.map(item => [keySelector(item), item] as const))
}

/**
 *  Shuffles an array in-place using the Fisher-Yates (aka Knuth) algorithm
 *
 *  **Warning:** This function mutates the original array. It is memory-efficient,
 *  using constant additional space, but it will modify the array you pass in
 *
 *  The algorithm guarantees that every permutation of the array is equally likely,
 *  assuming a uniform random number source
 *
 *  @example
 *  const numbers = [1, 2, 3, 4, 5]
 *  const shuffled = shuffle1(numbers)
 *  console.log(shuffled === numbers) // true - same reference
 *  console.log(numbers) // [3, 1, 5, 2, 4] - original array is modified
 *
 *  @example
 *  const cards = ['A', 'K', 'Q', 'J']
 *  shuffle1(cards)
 *  console.log(cards) // ['Q', 'A', 'J', 'K'] - shuffled in-place
 *
 *  @template T - The type of elements in the array
 *  @param {T[]} array - The array to shuffle (will be modified in-place)
 *  @param {() => number} [rand] - Optional random number generator returning number between 0 (inclusive) and 1 (exclusive)
 *  @returns {T[]} The same array reference that was passed in, now shuffled
 *  @see {@link https://en.wikipedia.org/wiki/Fisher-Yates_shuffle} for more details on the algorithm.
 *  @complexity Time: O(n), Space: O(1)
 */
export function shuffleInPlace<T> (
  array: T[],
  rand: () => number = Math.random,
): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

/**
 *  Creates a new, shuffled copy of an array using the Fisher-Yates algorithm.
 *
 *  Pure function, leaving parameter passed unchanged.
 *  It returns a new array containing the same elements in a random order.
 *  It is a safer default choice for most use cases but uses
 *  linear additional space for the copy.
 *
 *  @example
 *  const original = [1, 2, 3, 4, 5]
 *  const shuffled = shuffle2(original)
 *  console.log(shuffled === original) // false - different references
 *  console.log(original) // [1, 2, 3, 4, 5] - unchanged
 *  console.log(shuffled) // [3, 1, 5, 2, 4] - new shuffled array
 *
 *  @example
 *  // Using custom random function for deterministic results
 *  let seed = 0.5
 *  const customRand = () => {
 *    seed = (seed * 9301 + 49297) % 233280
 *    return seed / 233280
 *  }
 *
 *  const numbers = [1, 2, 3, 4]
 *  const shuffled = shuffle2(numbers, customRand)
 *  console.log(shuffled) // Always produces same result with same seed
 *
 *  @example
 *  // Perfect for game development with seeded randomness
 *  const deck = ['♠️', '❤️', '👾', '👻']
 *  const gameRNG = () => myGameEngine.random()
 *  const shuffledDeck = shuffle2(deck, gameRNG)
 *
 *  @template T - The type of elements in the array
 *  @param {T[]} array - The source array to create a shuffled copy of
 *  @param {() => number} [rand] - Optional random number generator returning number between 0 (inclusive) and 1 (exclusive)
 *  @returns {T[]} A new array containing the shuffled elements
 *  @complexity Time: O(n), Space: O(n).
 */
export function shuffleCopy<T> (
  array: T[],
  rand: () => number = Math.random,
): T[] {
  // copy
  const result = array.slice()
  let length = array.length

  while (length > 0) {
    // Pick a random index from the remaining elements
    const i = Math.floor(rand() * length--)// while decrementing length for the next iteration

    // Swap the random element with the current element
    const temp = result[length]
    result[length] = result[i]!
    result[i] = temp
  }

  return result
}

export function isIdentical<T> (a: T[], b: T[]) {
  if (a.length !== b.length) { return false }

  let i = a.length
  while (i--) {
    if (a[i] !== b[i]) { return false }
  }

  return true
}

export function count<T> (array: T[], value: T) {
  return array.filter(v => v === value).length
}

/**
 * Returns a random item
 * @param arr - The array to choose from
 * @returns The randomly selected item
 */
export function chooseFrom<T> (arr: T[], rand: () => number = Math.random): T {
  const index = Math.floor(rand() * arr.length)
  const result = arr[index]
  if (result === undefined) {
    throw new Error('Cannot choose from empty array')
  }
  return result
}

export function pickProps<T> (array: T[], props: (keyof T)[]): T[] {
  return array.map((item) => {
    const newItem: Partial<T> = {}
    for (const prop of props) {
      newItem[prop] = item[prop]
    }
    return newItem as T
  })
}
