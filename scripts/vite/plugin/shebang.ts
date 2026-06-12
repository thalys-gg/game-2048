import type { ShebangOptions } from '#/vite/plugin/shebang.types'
import type { Plugin } from 'vite-plus'
import { SHEBANG } from '#/vite/plugin/shebang.regex'

export function shebang (opts: ShebangOptions = {}): Plugin {
  // A map to store the shebang for each entry point
  const shebangs = new Map<string, string>()

  console.log('Loaded Shebang Plugin')

  return {
    name: 'vite-plugin-shebang',
    enforce: 'pre',

    transform: (code: string, id: string, options: any) => {
      console.warn(id, ':\n', code)

      const match = code.match(SHEBANG)
      if (match) {
        // Store the shebang for later
        shebangs.set(id, match[0])
        // Remove the shebang from the code to prevent parsing errors
        return {
          code: code.replace(SHEBANG, ''),
          map: null, // No source map needed for this simple transform
        }
      }

      return null // Return null for non-entry files or files without a shebang
    },

    // This hook is called after the chunk is rendered but before it's written to a file.
    // We use it to add the shebang back to the final bundle.
    // renderChunk: (code, chunk, { sourcemap }) => {
    //   // Check if this chunk corresponds to an entry point that had a shebang
    //   const shebang = shebangs.get(chunk.facadeModuleId || '')

    //   if (shebang) {
    //     const finalCode = `${options.shebang || shebang}\n${code}`
    //     return {
    //       code: finalCode,
    //       map: sourcemap
    //         ? {
    //           ...sourcemap,
    //           // We need to offset the source map by one line to account for the added shebang
    //           mappings: `;${sourcemap.mappings}`,
    //         }
    //         : null,
    //     }
    //   }

    //   return null
    // },

    // This hook is called after the bundle is written to disk.
    // We use it to make the output file executable.
    // writeBundle(options, bundle) {
    //   for (const fileName in bundle) {
    //     const chunk = bundle[fileName];
    //     if (chunk.type === 'chunk' && chunk.isEntry && shebangs.has(chunk.facadeModuleId || '')) {
    //       const filePath = `${options.dir}/${fileName}`;
    //       try {
    //         // Set the executable permission (chmod +x)
    //         chmodSync(filePath, '755');
    //       } catch (error) {
    //         this.warn(`Failed to set executable permission on ${filePath}: ${error}`);
    //       }
    //     }
    //   }
    // }
  }
}
