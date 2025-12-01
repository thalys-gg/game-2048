export type FnType = (...args: any[]) => any

export type FnTypeWithParams<T extends FnType> = T & { parameters: Parameters<T> }

/**
 * This means: "I accept any parameters and return anything"
 */
export type FnAny = (...args: any[]) => any

/**
 * This means: "I accept parameters that must be type-checked before use
 * and return a value that must be type-checked before use"
 */
export type FnUnknown = (...args: unknown[]) => unknown

/**
 * Without -?: Optional properties in the original type remain optional in the mapped type
 * With -?: Optional properties become required in the mapped type
 */
export type TEntriesOf<T> = {
  [K in keyof T]-?: [K, T[K]]
}[keyof T][]

// eslint-disable-next-line ts/no-unsafe-function-type
export function isFunction (obj: unknown): obj is Function { // Depending on the project and use-case you might want to change the `any` to `unknown`
  return typeof obj === 'function'
}

export const tuple = <T extends string[]>(...args: T) => args

export type PropType<T, TProp extends keyof T> = T[TProp]

export type Enumerate<N extends number, Acc extends number[] = []> = Acc['length'] extends N
  ? Acc[number]
  : Enumerate<N, [...Acc, Acc['length']]>

/**
 * Accepted range and return of integer values
 */
export type IntRange<F extends number, T extends number> = Exclude<Enumerate<T>, Enumerate<F>>
