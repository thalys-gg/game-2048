import { findProjectRoot } from '#/bun/utils'

// This block runs only when the script is executed directly with `bun run`.
// It provides an example of how to use the functions above.
if (import.meta.main) {
  ;(async () => {
    try {
      console.log('Running example for findRootDir...')
      const root = await findProjectRoot()
      console.log('✅ Project root found:', root)
    } catch (error) {
      console.error(error)
    }
  })()
}
