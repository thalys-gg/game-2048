import { blue, blueBright, logger } from '@thalys/logger'

const log = logger.custom` [${blue('SCRATCH')}]`
const logEvent = logger.custom` [${blueBright('EVENT')}]`
const space = (count: number = 2) => logger.log('\n'.repeat(count))

space(1)

// WIP

// Shows up in the error when someone passes an object that already has `on`
type HasOnError
  = 'Invalid object: property "on" already exists. '
    & 'Use a different name or remove the existing "on" property.'

type EnsureNoOn<T extends object>
  = 'on' extends keyof T
    ? HasOnError
    : T

function addOn<T extends object> (obj: EnsureNoOn<T>) {
  return {
    ...obj,
    on: (event: string, handler: () => void) => {
      log('listening to', event)
    },
  }
}

const a = { foo: 1 }
const b = { on: () => {}, foo: 2 }

const ok = addOn(a)
// const fail = addOn(b)
