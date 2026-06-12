import { blue, blueBright, logger } from '@thalys/logger'
import { rollFloat } from '∆/lib/random'

const log = logger.custom` [${blue('SCRATCH')}]`
const logEvent = logger.custom` [${blueBright('EVENT')}]`
const space = (count: number = 2) => logger.log('\n'.repeat(count))

space(1)

/**
 * Initializes the random number rolling simulation.
 * It performs a specified number of iterations, rolling a float between 0 and 1,
 * and then buckets the results by their first decimal place (e.g., 0.0, 0.1, ..., 0.9).
 * Finally, it logs the distribution of these buckets, showing the count and percentage
 * of hits for each bucket.
 */
async function rollFloatTest(iterations = 1000000) {
  const counts: Record<string, number> = {}
  for (let i = 0; i < iterations; i++) {
    const float = rollFloat()
    // Bucket by first decimal: 0.0, 0.1, ... 0.9
    const bucket = (Math.floor(float * 10) / 10).toFixed(1)
    counts[bucket] = (counts[bucket] || 0) + 1
  }
  const sortedKeys = Object.keys(counts).sort()
  log(`Results for ${iterations} iterations:`)
  for (const key of sortedKeys) {
    const count = counts[key]
    const percentage = ((count / iterations) * 100).toFixed(1)
    log(`${key}: ${count} hits (${percentage}%)`)
  }
}
rollFloatTest()
