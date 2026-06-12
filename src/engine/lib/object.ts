import type { TEntriesOf } from '∆/lib/types'

export function valuesOf<T extends object>(obj: T) {
  return Object.values(obj) as T[]
}

export function keysOf<T extends object>(obj: T) {
  return Object.keys(obj) as (keyof T)[]
}

export function entriesOf<T extends object>(obj: T): TEntriesOf<T> {
  return Object.entries(obj) as TEntriesOf<T>
}
