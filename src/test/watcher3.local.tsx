/**
 * Watched Object Implementation
 * A utility to create deeply proxied objects that trigger a callback
 * whenever a property is modified, added, or deleted anywhere in the object tree.
 */

import { blue, blueBright, logger } from '@thalys/logger'

const log = logger.custom` [${blue('WATCHER-3')}]`
const clean = logger.custom` `
const logEvent = logger.custom` [${blueBright('EVENT')}]`
const space = (count: number = 2) => logger.log('\n'.repeat(count))

space(1)

// ==========================================
// Types
// ==========================================

type Path = (string | symbol)[]

type ChangeType = 'SET' | 'DELETE' | 'ADD'

export interface ChangeEvent {
  path: Path          // The path to the property that changed
  type: ChangeType    // What kind of change happened
  value: any          // The new value (undefined for DELETE)
  previousValue: any  // The old value
  target: object      // The object that was modified
}

export type WatcherCallback = (event: ChangeEvent) => void

// ==========================================
// Implementation
// ==========================================

/**
 * Creates a proxy that wraps the target object to detect deep changes.
 * @param target - The object to watch.
 * @param callback - Function called on any change.
 * @returns A proxied version of the target.
 */
export function createWatchedObject<T extends object> (
  target: T,
  callback: WatcherCallback,
): T {
  // Map to store proxies for nested objects to ensure object identity stability
  const proxyCache = new WeakMap<object, object>()

  /**
   * Internal handler to create the proxy recursively.
   * @param obj - The current object being proxied.
   * @param path - The path to reach this object from the root.
   */
  function createHandler (obj: any, path: Path): any {
    return {
      get (target: any, property: string | symbol, receiver: any) {
        const value = Reflect.get(target, property, receiver)

        // If the value is an object (and not null), we need to proxy it too
        // to enable deep watching.
        if (typeof value === 'object' && value !== null) {
          // Check if we already have a proxy for this object to avoid infinite loops
          // or creating duplicate proxies.
          if (proxyCache.has(value)) {
            return proxyCache.get(value)
          }

          // Create a new proxy for the nested object
          const nestedProxy = new Proxy(
            value,
            createHandler(value, [...path, property]),
          )

          proxyCache.set(value, nestedProxy)
          return nestedProxy
        }

        return value
      },

      set (target: any, property: string | symbol, value: any, receiver: any) {
        const previousValue = Reflect.get(target, property, receiver)
        const newPath = [...path, property]

        // Optimization: If value hasn't changed, don't trigger callback
        if (previousValue === value) {
          return true
        }

        const isAdd = !Object.prototype.hasOwnProperty.call(target, property)
        const result = Reflect.set(target, property, value, receiver)

        if (result) {
          callback({
            path: newPath,
            type: isAdd ? 'ADD' : 'SET',
            value,
            previousValue,
            target,
          })
        }

        return result
      },

      deleteProperty (target: any, property: string | symbol) {
        const previousValue = Reflect.get(target, property)
        const newPath = [...path, property]

        const result = Reflect.deleteProperty(target, property)

        if (result) {
          callback({
            path: newPath,
            type: 'DELETE',
            value: undefined,
            previousValue,
            target,
          })
        }

        return result
      },
    }
  }

  // Initialize the root proxy
  const rootProxy = new Proxy(target, createHandler(target, []))
  proxyCache.set(target, rootProxy)

  return rootProxy
}


// ==========================================
// Usage Examples
// ==========================================

// Run this function to see it in action
function runDemo () {
  log('--- Starting Watched Object Demo ---')
  space()

  interface UserProfile {
    name: string
    stats: {
      level: number
      score: number
    }
    inventory: string[]
    metadata?: {
      lastLogin?: Date
    }
  }

  const initialData: UserProfile = {
    name: 'Hero',
    stats: {
      level: 1,
      score: 0,
    },
    inventory: ['Sword', 'Shield'],
  }

  // 1. Create the watched object
  const state = createWatchedObject(initialData, (event) => {
    const pathStr = event.path.map(String).join('.')
    clean(`[CHANGE DETECTED] Path: '${pathStr}' | Type: ${event.type}`)
    clean(`   Old: ${JSON.stringify(event.previousValue)} -> New: ${JSON.stringify(event.value)}`)
  })

  // 2. Modify top-level property
  log('1. Changing name...')
  state.name = 'Super Hero'

  // 3. Modify nested property (Deep Watch)
  log('2. Changing nested stats...')
  state.stats.score = 500

  // 4. Array mutation (proxies handle arrays natively)
  log('3. Pushing to array...')
  state.inventory.push('Potion')
  // Note: Push may trigger multiple changes (index set + length update) depending on engine implementation

  // 5. Adding new nested structure
  log('4. Adding new property...')
  state.metadata = { lastLogin: new Date() }

  // 6. Modifying the newly added structure
  log('5. Modifying deep property in new structure...')
  if (state.metadata) {
    state.metadata.lastLogin = new Date('2025-01-01')
  }

  log('--- Final State ---')
  clean(state)
}

// Uncomment to run if executing this file directly:
runDemo()
