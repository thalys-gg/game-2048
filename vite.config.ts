import type { ConfigEnv, UserConfig } from 'vite'
import { resolve } from 'node:path'
import { env } from 'node:process'
import { pluginAssetpack as assetpack } from '#/vite/plugin/assetpack-vite-plugin'
import { fullReloadWhen } from '#/vite/plugin/full-reload-by-ext.ts'
import { defineConfig } from 'vite'
import devtoolsJson from 'vite-plugin-devtools-json'
import glsl from 'vite-plugin-glsl'
import { defaultInclude } from 'vitest/config'

export default defineConfig(async (_configEnv: ConfigEnv) => {
  return {
    clearScreen: true,
    server: {
      port: 3212,
      open: false,
      sourcemapIgnoreList(_sourcePath: string, _sourcemapPath: string): boolean {
        return false
      },
    },
    resolve: {
      alias: {
        '∆': resolve(import.meta.dir, 'src/engine'),
        '@': resolve(import.meta.dir, 'src/app'),
        '#': resolve(import.meta.dir, 'scripts'),
      },
    },
    build: {
      rolldownOptions: {
        input: {
          main: resolve(import.meta.dirname, 'index.html'),
        },
      },
      plugins: [
        devtoolsJson(),
        glsl(),
        fullReloadWhen(['ts', 'tsx', 'frag', 'vert']).change(),
        assetpack(),
      ],
      define: {
        APP_VERSION: JSON.stringify(env.npm_package_version),
      },
      test: {
        include: [resolve(import.meta.dir, 'src/test')],
      },
    },
  }
})
