import type { AssetPipe } from '@assetpack/core'
import { audio } from '@assetpack/core/ffmpeg'
import { compress, mipmap } from '@assetpack/core/image'
import { json } from '@assetpack/core/json'
import { spineAtlasCompress, spineAtlasManifestMod, spineAtlasMipmap } from '@assetpack/core/spine'
import { texturePacker, texturePackerCompress } from '@assetpack/core/texture-packer'
import { webfont } from '@assetpack/core/webfont'
import { generatePixiManifest } from './manifest/manifest'
import { generateManifestTypes } from './manifest/manifest-typescript'

/**
 * Returns an array of plugins that can be used by AssetPack to process assets
 * for a PixiJS project.
 */
export function customAssetpackPipes() {
  const pipes = [
    webfont(),

    audio(),

    texturePacker({
      addFrameNames: true,
      resolutionOptions: {
        resolutions: { default: 1 },
        fixedResolution: 'default',
        maximumTextureSize: 4096,
      },
      texturePacker: {
        padding: 2,
        powerOfTwo: true,
        nameStyle: 'short',
        removeFileExtension: true,
      },
    }),

    mipmap({
      resolutions: { default: 1 },
    }),

    spineAtlasMipmap({
      resolutions: { default: 1 },
    }),
  ] as AssetPipe[]

  pipes.push(
    compress({
      png: true,
      jpg: true,
      webp: true,
    }),

    spineAtlasCompress({
      png: true,
      webp: true,
    }),

    texturePackerCompress({
      png: true,
      webp: true,
    }),
  )

  pipes.push(json())

  // Commented when I removed the ability to
  // pass configs to the pipes,
  // but it will be turned on again
  // if (apConfig.cacheBust) {
  //   pipes.push(
  //     cacheBuster(),
  //     spineAtlasCacheBuster(),
  //     texturePackerCacheBuster(),
  //   )
  // }

  pipes.push(
    generatePixiManifest({
      output: './src/gen/manifest.json',
      createShortcuts: true,
      trimExtensions: true,
      includeMetaData: false,
      legacyMetaDataOutput: false,
      nameStyle: 'short',
    }),
    spineAtlasManifestMod({
      output: './src/gen/manifest.json',
    }),
    generateManifestTypes({
      manifestPath: './src/gen/manifest.json',
      output: './src/gen/manifest-types.ts',
    }),
  )

  return pipes
}
