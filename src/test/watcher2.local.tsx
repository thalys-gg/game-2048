import { blue, blueBright, logger } from '@thalys/logger'

const log = logger.custom` [${blue('SCRATCH')}]`
const logEvent = logger.custom` [${blueBright('EVENT')}]`
const space = (count: number = 2) => logger.log('\n'.repeat(count))

space(1)

type WatchCallback<T> = (prop: keyof T, newValue: unknown, oldValue: unknown) => void

function watch<T extends object>(target: T, callback: WatchCallback<T>): T {
  return new Proxy(target, {
    set(obj, prop, value) {
      const oldValue = obj[prop as keyof T]
      if (oldValue !== value) {
        obj[prop as keyof T] = value
        callback(prop as keyof T, value, oldValue)
      }
      return true
    },
  })
}

// Usage
const player = watch({ x: 0, y: 0, health: 100 }, (prop, newVal: any, oldVal: any) => {
  log(`${String(prop)} changed: ${oldVal} → ${newVal}`)
})

player.x = 50 // logs: "x changed: 0 → 50"
player.health = 80 // logs: "health changed: 100 → 80"
