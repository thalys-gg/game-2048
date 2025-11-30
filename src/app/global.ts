declare const globalThis: {
  __PIXI_TEST_VERSION__: string | undefined
}

export function getAppVersion (): string {
  return globalThis.__PIXI_TEST_VERSION__ ?? '?.?.?'
}

export function isDev (): boolean {
  return import.meta.env.DEV === true
}

export function isProd (): boolean {
  return import.meta.env.PROD === true
}
