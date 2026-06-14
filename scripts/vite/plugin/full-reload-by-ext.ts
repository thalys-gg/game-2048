import type { Plugin } from 'vite'

/**
 * Triggers a full-reload when are detected changes in
 * the passed file types
 *
 * @param filetypes - extensions that will be matched
 * @returns a vite plugin
 */
export function fullReloadWhen(filetypes: string[]) {
  return {
    change: (): Plugin => {
      return {
        name: 'trigger--full-reload',
        handleHotUpdate(ctx) {
          const { file, server } = ctx

          for (const ext of filetypes) {
            if (file.endsWith(`.${ext}`)) {
              // const relPath = path.relative(__dirname, file)
              // const fWithOutExt = relPath.replace('.ts', '')
              // console.info(`   file changed [ ${fWithOutExt} ]. Reloading...`)
              server.ws.send({ type: 'full-reload' })
              return []
            } else {
              // console.info(`File ${file} changed`)
            }
          }
        },
      }
    },
  }
}
