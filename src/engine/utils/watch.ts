import type {
  WatchedObject,
  WatchedProp,
  WatcherCallback,
  WatcherCallbackMap,
} from '∆/utils/watch.types'

type TNoOn = object & {
  on?: never
}

/**
 * Watches an object for changes and calls the provided callback when a property changes
 *
 * NOTE: This method changes the original object
 *
 * @param obj The object to watch
 * @returns The watched object
 */
export function watchObject<T extends TNoOn>(obj: T): T & WatchedObject<T> {
  const callbacks: WatcherCallbackMap<T> = new Map()

  // We need to avoid creating objects for performance reasons
  // so we change here the passed object, instead of creating a new one
  const watchedObject = Object.assign(obj, {
    on<K extends WatchedProp<T>>(event: `${K}Changed`, callback: WatcherCallback<T>) {
      const key = event.replace('Changed', '')
      if (!callbacks.has(key)) {
        callbacks.set(key, [])
      }
      callbacks.get(key)?.push(callback)
    },
  })

  return new Proxy(watchedObject, {
    set(target, property, value, receiver) {
      const key = property
      const oldValue = receiver[key]
      const result = Reflect.set(target, property, value, receiver)
      const array = callbacks.get(key)
      if (array) {
        array.forEach((callback) => callback(value, oldValue, receiver, property))
      }
      return result
    },
  })
}
