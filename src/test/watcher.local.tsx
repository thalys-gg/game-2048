/* eslint-disable antfu/no-top-level-await */
import type { WatchedProp } from '∆/utils/watch.types'
import { blue, blueBright, logger } from '@thalys/logger'
import { waitFor } from '∆/lib/promise'
import { watchObject } from '∆/utils/watch'

const log = logger.custom` [${blue('SCRATCH')}]`
const logEvent = logger.custom` [${blueBright('EVENT')}]`
const space = (count: number = 2) => logger.log('\n'.repeat(count))

space(1)

// ==========================================
// Types
// ==========================================

type Path = (string | symbol)[]

type ChangeType = 'SET' | 'DELETE' | 'ADD'

export interface ChangeEvent<T, K extends WatchedProp<T>> {
  type: ChangeType // What kind of change happened
  value: T[K] // The new value (undefined for DELETE)
  previousValue: T[K] // The old value
  target: T // The object that was modified
}

export type WatcherCallback<T, K extends WatchedProp<T>> = (event: ChangeEvent<T, K>) => void

// ==========================================
// Implementation
// ==========================================

const person = {
  firstName: 'Thalys',
  lastName: 'Moisyn',
  age: 35,
}

const watched = watchObject(person)

watched.on('firstNameChanged', (firstName) => {
  logEvent(`firstName was changed to ${firstName}!`)
  setTimeout(() => {
    log(person)
    log(watched)
  }, 0)
})

watched.firstName = 'Amanda'

await waitFor(1)
watched.firstName = 'Joaquim'

await waitFor(1)
person.firstName = 'Person'
