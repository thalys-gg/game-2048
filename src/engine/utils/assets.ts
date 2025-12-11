import type { Sound } from '@pixi/sound'
import type { Texture } from 'pixi.js'
import { Assets } from 'pixi.js'

type CacheThing = [string, Texture | Sound]

export async function findAsset () {
  // eslint-disable-next-line ts/dot-notation
  const cacheArray = Array.from(Assets.cache['_cache']) as unknown as CacheThing[]
  const names = cacheArray.map(([name, _thing]) => name)
  const targetNames = names.filter(name => name.includes('hea'))
}
