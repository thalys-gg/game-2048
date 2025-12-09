import path from 'node:path'
import process from 'node:process'

const SYS_ROOT = path.parse(process.cwd()).root

/**
 * Creates a utility to search upwards from a starting directory for a specific file.
 *
 * @param filename - The name of the file to search for (e.g., 'package.json').
 * @returns An object with a `from` method to start the search.
 */
export function searchUpFor (filename: string) {
  return {
    /**
     * Asynchronously searches for the specified file starting from `startDir`.
     *
     * @param leafDir - The absolute path of the directory to start the search from.
     * @returns A promise that resolves with the absolute path of the directory containing the file, or null if not found.
     */
    async from (leafDir: string = import.meta.dir): Promise<string | null> {
      let currentDir = leafDir

      while (true) {
        const filePath = path.join(currentDir, filename)

        // Check if the file exists in the current directory.
        if (await Bun.file(filePath).exists()) {
          return currentDir
        }

        // Move up to the parent directory.
        const parentDir = path.dirname(currentDir)

        // If the parent directory is the same as the current one, we've reached the root.
        if (parentDir === SYS_ROOT) {
          return null
        }

        currentDir = parentDir
      }
    },
  }
}

/**
 * Finds the project's root directory by searching upwards for a `package.json` file.
 * It starts the search from the directory of the current module.
 *
 * @returns {Promise<string>} A promise that resolves with the absolute path to the project root.
 * @throws {Error} If the `package.json` file cannot be found.
 */
export async function findProjectRoot (): Promise<string> {
  const startDir = import.meta.dir
  const root = await searchUpFor('package.json').from(startDir)

  if (!root) {
    throw new Error('Could not find `package.json` to verify the project root.')
  }

  return root
}
