import type { AssetPackConfig } from '@assetpack/core'
import type { Plugin, ResolvedConfig } from 'vite'
import process from 'node:process'
import { AssetPack } from '@assetpack/core'
import { customAssetpackPipes } from '../../assetpack/pipe'

/**
 * A Vite plugin that integrates AssetPack for asset bundling and processing.
 * This plugin configures and runs AssetPack based on the Vite command (serve or build).
 * In 'serve' mode, it watches for asset changes.
 * In 'build' mode, it performs a one-time asset build.
 *
 * @returns {Plugin} The Vite plugin object.
 */
export function assetpackPlugin () {
  // Configuration for the AssetPack instance.
  const apConfig = {
    entry: './raw-assets',
    logLevel: 'info',
    pipes: [
      ...customAssetpackPipes(),
    ],
  } as AssetPackConfig

  // The Vite command mode ('serve' or 'build').
  let mode: ResolvedConfig['command']
  // The AssetPack instance, used in watch mode.
  let ap: AssetPack | undefined

  return {
    name: 'vite-plugin-assetpack',

    /**
     * Resolves the final configuration.
     * This hook is used to set the output path for AssetPack based on Vite's public directory.
     * @param {ResolvedConfig} resolvedConfig - The resolved Vite configuration.
     */
    configResolved (resolvedConfig) {
      mode = resolvedConfig.command

      // If publicDir is not set, we can't determine the output path.
      if (!resolvedConfig.publicDir) { return }

      // If output path is already configured, do nothing.
      if (apConfig.output) { return }

      // remove the root from the public dir
      const publicDir = resolvedConfig.publicDir.replace(process.cwd(), '')

      // Set the output path for AssetPack to be inside the public directory.
      // This ensures that the processed assets are served by Vite's dev server.
      if (process.platform === 'win32') {
        apConfig.output = `${publicDir}/assets/`
      } else {
        apConfig.output = `.${publicDir}/assets/`
      }

      console.info(`AssetPack - Output set to \`${apConfig.output}\``)
    },

    /**
     * The buildStart hook is called at the beginning of a build.
     * It initializes AssetPack either in watch mode (for 'serve') or run mode (for 'build').
     */
    buildStart: async () => {
      if (mode === 'serve') {
        // In serve mode, we want to watch for changes.
        if (ap) { return } // Already watching
        ap = new AssetPack(apConfig)
        await ap.watch()
      } else {
        // In build mode, we just run assetpack once.
        await new AssetPack(apConfig).run()
      }
    },

    /**
     * The buildEnd hook is called at the end of a build.
     * It stops the AssetPack watcher if it's running.
     */
    buildEnd: async () => {
      if (ap) {
        await ap.stop()
        ap = undefined
      }
    },
  } as Plugin
}
