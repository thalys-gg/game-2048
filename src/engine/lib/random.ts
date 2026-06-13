/**
 * Random number generation utilities
 *
 * This module provides utility functions for generating random numbers
 * within specified ranges, including both floating-point and integer values.
 */

// Destructure Math methods for cleaner usage
const { random, floor } = Math

/**
 * Generates a random floating-point number within a specified range.
 *
 * @param min - The minimum value (inclusive)
 * @param max - The maximum value (exclusive)
 * @returns A random float where min <= result < max
 *
 * @example
 * ```ts
 * rollFloat(1.0, 5.0) // Returns a float like 3.847291...
 * rollFloat(0, 1)     // Returns a float between 0 and 1 (like Math.random but with explicit bounds)
 * ```
 */
export function rollFloat(min: number = 0, max: number = 1): number {
  return min + random() * (max - min)
}

/**
 * Generates a random integer within a specified range.
 *
 * @param min - The minimum value (inclusive)
 * @param max - The maximum value (inclusive)
 * @returns A random integer where min <= result <= max
 *
 * @example
 * ```ts
 * rollInt(1, 6)    // Returns 1, 2, 3, 4, 5, or 6 (like a dice roll)
 * rollInt(0, 10)   // Returns any integer from 0 to 10
 * rollInt(-5, 5)   // Returns any integer from -5 to 5
 * ```
 *
 * @note The key difference from rollFloat is that max is inclusive for integers,
 *       and we add 1 to the range calculation to ensure max can be selected.
 */
export function rollInt(min: number, max: number): number {
  return floor(min + random() * (1 + max - min))
}

// From a very good answer about pseudo random numbers on stack overflow
// https://stackoverflow.com/a/47593316
function xmur3(str: string): () => number {
  let h = 1779033703 ^ str.length

  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353)
    h = (h << 13) | (h >>> 19)
  }

  return (): number => {
    h = Math.imul(h ^ (h >>> 16), 2246822507)
    h = Math.imul(h ^ (h >>> 13), 3266489909)

    return (h ^= h >>> 16) >>> 0
  }
}

function mulberry32(a: number): () => number {
  return (): number => {
    let t = (a += 0x6d2b79f5)

    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)

    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const HASH_CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

/**
 * Creates a seeded random function similar to Math.random() based on given seed hash
 * @param seed - The hash string, can be anything
 * @returns Function that can be used instead Math.random
 */
export function randomSeeded(seed: string): () => number {
  return mulberry32(xmur3(seed)())
}

/**
 * Returns a random color
 * @param random - The random function to be used (defaults to Math.random)
 */
export function randomColor(random = Math.random): number {
  const r = Math.floor(0xff * random())
  const g = Math.floor(0xff * random())
  const b = Math.floor(0xff * random())
  return (r << 16) | (g << 8) | b
}

/**
 * Returns a random number within a range
 * @param min - lowest number (inclusive)
 * @param max - highest number (exclusive)
 * @param random - The random function to be used (defaults to Math.random)
 */
export function randomRange(min: number, max: number, random = Math.random): number {
  const a = Math.min(min, max)
  const b = Math.max(min, max)

  const v = a + (b - a) * random()

  return v
}

/**
 * Returns a random item from an object or array
 * @param obj - array to be selected
 * @param random - The random function to be used (defaults to Math.random)
 */
export function randomItem<T>(obj: T, random = Math.random): T[keyof T] {
  if (Array.isArray(obj)) {
    return obj[Math.floor(random() * obj.length)]
  }

  const keys = Object.keys(obj as Record<string, unknown>)
  const key = keys[Math.floor(random() * keys.length)]
  return obj[key as keyof T]
}

/**
 * Returns a random boolean.
 * @param weight - The chance of true value, between 0 and 1
 * @param random - The random function to be used (defaults to Math.random)
 * @returns A random boolean
 */
export function randomBool(weight = 0.5, random = Math.random): boolean {
  return random() < weight
}

/**
 * Random shuffle an array in place, without cloning it
 * @param array - The array that will be shuffled
 * @param random - The random function to be used (defaults to Math.random)
 * @returns The passed array
 */
export function randomShuffle<T>(array: T[], random = Math.random): T[] {
  let currentIndex = array.length
  let temporaryValue
  let randomIndex

  while (currentIndex !== 0) {
    randomIndex = Math.floor(random() * currentIndex)
    currentIndex -= 1
    temporaryValue = array[currentIndex]
    array[currentIndex] = array[randomIndex]
    array[randomIndex] = temporaryValue
  }

  return array
}

/**
 * Return a random string hash - not guaranteed to be unique
 * @param length - The length of the hash
 * @param random - The random function to be used (defaults to Math.random)
 * @returns A random string hash
 */
export function randomHash(length: number, random = Math.random, charset = HASH_CHARSET): string {
  const charsetLength = charset.length
  let result = ''

  for (let i = 0; i < length; i++) {
    result += charset.charAt(Math.floor(random() * charsetLength))
  }

  return result
}

/**
 * Returns a random number within a range.
 *
 * @param min - The minimum value (inclusive).
 * @param max - The maximum value (exclusive).
 */
export function randomFloat(min: number, max: number, random = Math.random) {
  return random() * (max - min) + min
}

/**
 * Returns a random integer within a range.
 *
 * @param min - The minimum value (inclusive).
 * @param max - The minimum value (inclusive).
 * @param random - The random function to be used (defaults to Math.random)
 */
export function randomInt(min: number, max: number, random = Math.random) {
  // This function will return 4 if float result is 3.5 because of +1. Should return 3 instead?
  return Math.floor(random() * (max - min + 1)) + min
}
