import { blue, blueBright, logger } from '@thalys/logger'

const log = logger.custom` [${blue('SCRATCH')}]`
const logEvent = logger.custom` [${blueBright('EVENT')}]`
const space = (count: number = 2) => logger.log('\n'.repeat(count))

space(1)

// type PropEventSource<T> = {
//   on: (eventName: `${string & keyof T}Changed`, callback: (newValue: any) => void) => void
// }

type Prop<T> = keyof T & string
type Callback<T> = <K extends Prop<T>>(newValue: T[K]) => void
type PropEventSource<T> = {
  on: <K extends Prop<T>>(eventName: `${K}Changed`, cb: Callback<T>) => void
}

function makeWatchedObject<T extends object>(obj: T): T & PropEventSource<T> {
  const callbacks: Map<string, Callback<T>[]> = new Map()

  const newObj = {
    ...obj,
    on<K extends Prop<T>>(eventName: `${K}Changed`, cb: Callback<T>) {
      const key = eventName.replace('Changed', '')
      if (!callbacks.has(key)) {
        callbacks.set(key, [])
      }
      callbacks.get(key)!.push(cb)
    },
  }

  return new Proxy(newObj, {
    set(target, prop, newValue, receiver) {
      const key = String(prop)
      const array = callbacks.get(key)
      if (array) {
        array.forEach(cb => cb(newValue))
      }
      return Reflect.set(target, prop, newValue, receiver)
    },
  })
}

const person = {
  firstName: 'Thalys',
  lastName: 'Moisyn',
  age: 35,
}

const watched = makeWatchedObject(person)

watched.on('firstNameChanged', firstName => {
  logEvent(`firstName was changed to ${firstName}!`)
  setTimeout(() => {
    log(person)
    log(watched)
  }, 0)
})

watched.firstName = 'Amanda'

setTimeout(() => {
  watched.firstName = 'Joaquim'
}, 1000)

setTimeout(() => {
  person.firstName = 'Person'
}, 2000)
