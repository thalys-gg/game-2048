import type { WatchedObject, WatchedProp, WatcherCallback } from '∆/utils/watch.types'

export function watchObject<T extends object> (obj: T): T & WatchedObject<T> {
  const callbacks: Map<string | symbol, WatcherCallback<T>[]> = new Map()

  const newObj = {
    ...obj,
    on<K extends WatchedProp<T>> (
      eventName: `${K}Changed`,
      cb: WatcherCallback<T>,
    ) {
      const key = eventName.replace('Changed', '')
      if (!callbacks.has(key)) { callbacks.set(key, []) }
      callbacks.get(key)!.push(cb)
    },
  }

  return new Proxy(newObj, {
    set (target, property, value, receiver) {
      const key = property
      const oldValue = receiver[key]
      const result = Reflect.set(target, property, value, receiver)
      const array = callbacks.get(key)
      if (array) {
        array.forEach(cb => cb(value, oldValue, receiver, property))
      }
      return result
    },
  })
}
