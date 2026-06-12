/**
 * A Set containing common small words that are typically not capitalized in title case.
 */
export const SMALL_WORDS = new Set([
  'a',
  'an',
  'and',
  'as',
  'at',
  'but',
  'by',
  'for',
  'has',
  'if',
  'in',
  'nor',
  'of',
  'on',
  'or',
  'per',
  'the',
  'to',
  'vs',
  'via',
])

/**
 * Reverses the order of characters in a string.
 *
 * @param text - The string to be reversed.
 * @returns A new string with all characters in reverse order.
 */
export function reverse (text: string) {
  return Array.from(text)
    .reverse()
    .join('')
}

/**
 * Capitalizes the first letter of a word.
 *
 * @param word - The word to capitalize.
 * @returns The capitalized word.
 */
export function capitalize (word: string) {
  return word.replace(/\b\w/, match => match.toUpperCase())
}

/**
 * Capitalizes the first letter of each word in a string.
 *
 * @param text - The string to capitalize.
 * @returns The capitalized string.
 */
export function capitalizeAll (text: string) {
  return text.replace(/\b\w/g, match => match.toUpperCase())
}

/**
 * Converts a string to camelCase format.
 *
 * This function transforms any string into camelCase by:
 * - Making the first character lowercase
 * - Making the first character of each subsequent word uppercase
 * - Removing all whitespace
 *
 * @param str - The input string to convert to camelCase
 * @returns A camelCase formatted string
 *
 * @example
 * toCamelCase("Hello World") // Returns "helloWorld"
 *
 * @example
 * toCamelCase("This is an Example") // Returns "thisIsAnExample"
 *
 * @example
 * toCamelCase("camel case") // Returns "camelCase"
 */
export function toCamelCase (str: string): string {
  return str.replace(/^\w|[A-Z]|\b\w/g, (word, index) => {
    return index === 0 ? word.toLowerCase() : word.toUpperCase()
  }).replace(/\s+/g, '')
}

/**
 * Converts a string to a human-readable name format by capitalizing all words.
 *
 * This function takes a string input and transforms it into a presentable name format
 * by capitalizing the first letter of each word in the string.
 *
 * @param name - The string to convert to a human-readable name format
 * @returns A formatted string with the first letter of each word capitalized
 *
 * @example
 * toHumanName("john doe"); // Returns "John Doe"
 *
 * @example
 * toHumanName("product manager"); // Returns "Product Manager"
 */
export function toHumanName (name: string): string {
  return capitalizeAll(name)
}

/**
 * Converts a string to title case.
 *
 * @param text - The string to convert to title case.
 * @returns The title-cased string.
 */
export function toTitleCase (text: string) {
  const IGNORE_WORDS = new Set([
    'iPhone',
  ])

  return text
    .split(/\s+/)
    .map((word) => {
      if (SMALL_WORDS.has(word.toLowerCase())) {
        return word
      }
      if (IGNORE_WORDS.has(word)) {
        return word
      }
      return capitalize(word)
    })
    .join(' ')
}

/**
 * Function to check if a string is undefined, null, empty, or contains only whitespace characters.
 *
 * @param str - The string to check.
 * @returns `true` if the string is invalid, otherwise `false`.
 */
export function isInvalid (str: string | null | undefined): boolean {
  if (!str) { return true } // TODO: Test performance and safety
  if (typeof str !== 'string') { return true }
  if (str.length === 0) { return true }
  if (/\s+$/.test(str)) { return true }
  return str.trim().length === 0
}

export function remove (str: string, toRemove: string) {
  return str.replace(toRemove, '')
}

/**
 * Escapes characters utils.
 */
export const escape = {

  /**
   * Escapes HTML characters in a string.
   *
   * @param text - The string to escape.
   * @returns The escaped string.
   */
  html: (text: string) => {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
  },
}
