export const toZero = (): 0 => 0
export const toN = (n: number): { length: number } => ({ length: n })

type MapFunction<T> = (value: unknown, index: number) => T

export const arrFrom = <T>(
  n: number,
  to: MapFunction<T> = (toZero as unknown as MapFunction<T>),
): T[] => Array.from(toN(n), to)

export const arrSelfFrom = <T>(
  n: number,
  to: MapFunction<T> = (toZero as unknown as MapFunction<T>),
  target: T[],
): T[] => {
  for (let i = 0; i < n; i++) {
    target[i] = to(undefined, i)
  }
  return target
}

// Context injector HOF
export function withContext<T, A extends any[], R> (
  fn: (...args: [...A, T]) => R,
  context: T,
): (...args: A) => R {
  return (...args: A) => fn(...args, context)
}


export function allowContinueAt (target: number) {
  let sum = 0
  return (value: number): boolean => {
    sum += value
    if (sum >= target) {
      sum = 0
      return true
    }
    return false
  }
}

export function throttle<T extends (...args: any[]) => any> (
  fn: T,
  delay = 100,
): (...args: Parameters<T>) => void {
  let lastTime = 0

  return (...args: Parameters<T>) => {
    const now = performance.now()
    if (now - lastTime >= delay) {
      fn(...args)
      lastTime = now
    }
  }
}

// export function withTicker =

// const p = new Proxy(myObj, {
//   get: (target, key) => {
//     return hasKey(target, key) ? `${target[key]} World!` : 'nope'
//   },
// })
