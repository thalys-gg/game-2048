import type { AssetPackConfig } from '@assetpack/core'
import type { Plugin, ResolvedConfig } from 'vite-plus'
import process from 'node:process'
import { generateManifestTypes } from '#/assetpack/manifest/manifest-typescript'
import { AssetPack } from '@assetpack/core'
import { pixiPipes } from '@assetpack/core/pixi'

export function pluginAssetpack () {
  const apConfig = {
    entry: './raw-assets',
    cache: true,
    cacheLocation: '.cache/.assetpack',
    pipes: [
      ...pixiPipes({
        cacheBust: false,
        manifest: {
          output: './src/gen/manifest.json',
          createShortcuts: true,
          nameStyle: 'short',
          trimExtensions: true,
        },
        texturePacker: {
          addFrameNames: true,
          texturePacker: {
            nameStyle: 'short',
            removeFileExtension: true,
          },
        },
      }),
      generateManifestTypes({
        manifestPath: './src/gen/manifest.json',
        output: './src/gen/manifest-types.ts',
      }),
    ],
  } as AssetPackConfig
  let mode: ResolvedConfig['command']
  let assetPack: AssetPack | undefined

  return {
    name: 'vite-plugin-assetpack',
    configResolved (resolvedConfig) {
      mode = resolvedConfig.command
      if (!resolvedConfig.publicDir)
        return
      if (apConfig.output)
        return
      // remove the root from the public dir
      const publicDir = resolvedConfig.publicDir.replace(process.cwd(), '')

      if (process.platform === 'win32') {
        apConfig.output = `${publicDir}/assets/`
      } else {
        apConfig.output = `.${publicDir}/assets/`
      }
    },
    buildStart: async () => {
      if (mode === 'serve') {

        if (assetPack)
          return

        assetPack = new AssetPack(apConfig)
        await assetPack.watch()
      } else {
        await new AssetPack(apConfig).run()
      }
    },
    buildEnd: async () => {
      if (assetPack) {
        await assetPack.stop()
        assetPack = undefined
      }
    },
  } as Plugin
}
