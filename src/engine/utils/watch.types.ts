export type WatchedProp<T> = keyof T & string

export type WatcherCallback<T> = <K extends WatchedProp<T>>(
  value: T[K],
  oldValue?: T[K],
  who?: T,
  prop?: string | symbol,
) => void

export type WatchedObject<T> = {
  on: <K extends WatchedProp<T>>(eventName: `${K}Changed`, cb: WatcherCallback<T>) => void
}

export type WatcherCallbackMap<T extends object> = Map<string | symbol, WatcherCallback<T>[]>
