import type { ConfigEnv, UserConfig } from 'vite'
import path from 'node:path'
import { assetpackPlugin } from '#/vite/plugin/assetpack'
import { fullReloadWhen } from '#/vite/plugin/full-reload-by-ext'
import { defineConfig } from 'vite'
import devtoolsJson from 'vite-plugin-devtools-json'
import glsl from 'vite-plugin-glsl'

export const remove = (str: string, toRemove: string) => {
  return str.replace(toRemove, '')
}

const server: UserConfig['server'] = {
  port: 3212,
  open: false,

  sourcemapIgnoreList (_sourcePath: string, _sourcemapPath: string): boolean {
    // console.log(` ${sourcePath}\n  ${sourcemapPath}`)
    // return sourcePath.includes('.idea')
    return false
  },
}

const resolve: UserConfig['resolve'] = {
  alias: {
    '∆': path.resolve(__dirname, './src/engine'),
    '@': path.resolve(__dirname, './src/app'),
    '#': path.resolve(__dirname, './scripts'),
  },
}

const define: UserConfig['define'] = {
  APP_VERSION: JSON.stringify(process.env.npm_package_version),
}

const build: UserConfig['build'] = {

}

export default defineConfig(async (_configEnv: ConfigEnv) => {
  return {
    /**
     * General Options
     */
    // general caches directory where possible for disk space control
    cacheDir: path.resolve(__dirname, '.cache/vite'),
    clearScreen: false,
    build,
    server,
    resolve,
    plugins: [
      devtoolsJson(),
      glsl(),
      fullReloadWhen(['ts', 'tsx', 'frag', 'vert']).change(),
      assetpackPlugin(),
    ],
    define,
  } satisfies UserConfig
})
