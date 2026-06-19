import type { Bundle, Manifest, ManifestEntry, ManifestOptions } from '#/assetpack/manifest/types'
import type { Asset, AssetPipe, PipeSystem } from '@assetpack/core'
import { BuildReporter, path, stripTags } from '@assetpack/core'
import fs from 'fs-extra'

const DEFAULT_OPTS: ManifestOptions = {
  output: 'manifest.json',
  createShortcuts: true,
  trimExtensions: true,
  includeMetaData: true,
  legacyMetaDataOutput: true,
  nameStyle: 'short',
}

const TAGS = {
  manifest: 'm',
  mIgnore: 'mIgnore',
}

/**
 * Generates a Pixi-compatible asset manifest file.
 * This pipe collects asset information and organizes it into bundles,
 * then writes the output to a JSON file.
 *
 * @param options - Overrides for the default manifest options.
 * @returns An asset pipe object for AssetPack.
 */
export function generatePixiManifest(
  options: ManifestOptions = {},
): AssetPipe<ManifestOptions, 'manifest' | 'mIgnore'> {
  const name = 'pixi-manifest'

  // log('generatePixiManifest()')

  return {
    name,
    defaultOptions: {
      ...DEFAULT_OPTS,
      ...options,
    },
    tags: TAGS,

    /**
     * The finish hook is called after all assets have been processed.
     * It orchestrates the creation of the manifest.
     */
    async finish(asset: Asset, options, pipeSystem: PipeSystem) {
      const outDir = path.dirname(options.output)
      // Determine the final output path for the manifest file.
      const newFileName =
        outDir === '.' ? path.joinSafe(pipeSystem.outputPath, options.output) : options.output

      // Create a default bundle for assets that don't belong to a specific bundle.
      const defaultBundle: Bundle = {
        name: 'default',
        assets: [],
      }

      // Initialize the manifest structure.
      const manifest: Manifest = {
        bundles: [defaultBundle],
      }

      // Recursively collect all asset data.
      collectAssets(
        asset,
        options,
        pipeSystem.outputPath,
        pipeSystem.entryPath,
        manifest.bundles,
        defaultBundle,
        this.tags,
        pipeSystem.internalMetaData,
      )

      // Ensure all asset aliases are unique across the entire manifest.
      filterUniqueNames(manifest, options)

      // Write the final manifest to a JSON file (outputJSON creates parent dirs if missing).
      await fs.outputJSON(newFileName, manifest, { spaces: 2 })
    },
  }
}

/**
 * Filters asset aliases to ensure they are unique across all bundles in the manifest.
 * If duplicate bundle names are found when using 'short' nameStyle, it warns the user
 * and renames the conflicting bundles to their full relative path to avoid ambiguity.
 * It also ensures that each asset's alias list is unique.
 *
 * @param manifest - The manifest object to process.
 * @param options - The manifest options.
 */
function filterUniqueNames(manifest: Manifest, options: ManifestOptions) {
  // log('filterUniqueNames')
  const nameMap = new Map<ManifestEntry, string[]>()
  const isNameStyleShort = options.nameStyle !== 'relative'
  const bundleNames = new Set<string>()
  const duplicateBundleNames = new Set<string>()

  // First pass: collect all asset aliases and identify duplicate bundle names.
  manifest.bundles.forEach((bundle) => {
    // Check for duplicate bundle names if using the 'short' naming style.
    if (isNameStyleShort) {
      if (bundleNames.has(bundle.name)) {
        duplicateBundleNames.add(bundle.name)
        BuildReporter.warn(
          `[AssetPack][manifest] Duplicate bundle name '${bundle.name}'. All bundles with that name will be renamed to their relative name instead.`,
        )
      } else {
        bundleNames.add(bundle.name)
      }
    }

    // Map each asset to its list of aliases.
    bundle.assets.forEach((asset) => nameMap.set(asset, asset.alias as string[]))
  })

  // This logic is to ensure that the alias arrays themselves are unique, not just their contents.
  // It's a bit complex, but it prevents different assets from having the exact same set of aliases.
  const arrays = Array.from(nameMap.values())
  const sets = arrays.map((arr) => new Set(arr))
  const uniqueArrays = arrays.map((arr, i) =>
    arr.filter((x) => sets.every((set, j) => j === i || !set.has(x))),
  )

  // Second pass: apply the unique names and rename duplicate bundles.
  manifest.bundles.forEach((bundle) => {
    if (isNameStyleShort) {
      // If a bundle name was found to be a duplicate, switch to its relative name.
      if (duplicateBundleNames.has(bundle.name)) {
        bundle.name = bundle.relativeName ?? bundle.name
      }
    }

    // Assign the filtered, unique alias list back to each asset.
    bundle.assets.forEach((asset) => {
      const names = nameMap.get(asset) as string[]

      asset.alias = uniqueArrays.find((arr) => arr.every((x) => names.includes(x))) as string[]
    })
  })
}

/**
 * Constructs a relative path for an asset, which can be used as a bundle name.
 * It traverses up the asset's parent chain until it reaches the entry path,
 * building the relative path along the way.
 *
 * @param asset - The asset for which to generate a relative name.
 * @param entryPath - The root entry path of the asset processing.
 * @returns A relative path string for the asset.
 */
function getRelativeBundleName(asset: Asset, entryPath: string): string {
  // log('getRelativeBundleName')
  let name = asset.filename
  let parent = asset.parent

  // Traverse up the asset tree, prepending parent folder names.
  // Stop when the entry path is reached.
  while (parent && parent.path !== entryPath) {
    name = `${parent.filename}/${name}`
    parent = parent.parent
  }

  // Clean up any tags from the generated name.
  return stripTags(name)
}

/**
 * Recursively traverses the asset tree, collecting assets and organizing them into bundles.
 *
 * @param asset - The current asset being processed.
 * @param options - The manifest options.
 * @param outputPath - The root output path for all processed assets.
 * @param entryPath - The root entry path for raw assets.
 * @param bundles - The list of all bundles in the manifest.
 * @param bundle - The current bundle to which assets should be added.
 * @param tags - The tags used to identify manifest-related assets.
 * @param internalTags - The internal metadata tags used by AssetPack.
 */
function collectAssets(
  asset: Asset,
  options: ManifestOptions,
  outputPath = '',
  entryPath = '',
  bundles: Bundle[],
  bundle: Bundle,
  tags: AssetPipe<null, 'manifest' | 'mIgnore'>['tags'],
  internalTags: Record<string, any>,
) {
  // log('collectAssets')
  // Ignore assets that are marked to be skipped.
  if (asset.skip) {
    return
  }
  // Ignore assets that have been deleted during a watch process.
  if (asset.state === 'deleted') {
    return
  }

  let localBundle = bundle

  // Check if the current asset is marked as a new bundle root (`{m}` tag).
  if (asset.metaData[tags!.manifest]) {
    localBundle = {
      name:
        options.nameStyle === 'relative'
          ? getRelativeBundleName(asset, entryPath)
          : stripTags(asset.filename),
      assets: [],
    }

    // If using 'short' naming, store the relative name separately.
    // This allows for renaming if a short name conflict occurs.
    // The property is non-enumerable to keep it out of the final JSON output.
    if (options.nameStyle !== 'relative') {
      Object.defineProperty(localBundle, 'relativeName', {
        enumerable: false,
        get() {
          return getRelativeBundleName(asset, entryPath)
        },
      })
    }

    bundles.push(localBundle)
  }

  const bundleAssets = localBundle.assets
  const finalAssets = asset.getFinalTransformedChildren()

  // Process only if the asset has transformed children (i.e., it's a folder with content).
  if (asset.transformChildren.length > 0) {
    // Filter out any final assets that are marked to be ignored by the manifest.
    const finalManifestAssets = finalAssets.filter(
      (finalAsset) => !finalAsset.inheritedMetaData[tags!.mIgnore],
    )

    if (finalManifestAssets.length === 0) {
      return
    }

    // Collect all public and internal metadata for the asset.
    const metadata = {
      tags: { ...asset.getInternalMetaData(internalTags) },
      ...asset.getPublicMetaData(internalTags),
    } as Record<string, any>

    // For legacy compatibility, dump all metadata into the 'tags' property.
    if (options.legacyMetaDataOutput) {
      metadata.tags = asset.allMetaData
    }

    // Create the manifest entry for the current asset.
    bundleAssets.push({
      alias: getShortNames(stripTags(path.relative(entryPath, asset.path)), options),
      src: finalManifestAssets
        .map((finalAsset) => path.relative(outputPath, finalAsset.path))
        .sort((a, b) => b.localeCompare(a)), // Sort to ensure consistent output
      data: options.includeMetaData ? metadata : undefined,
    })
  }

  // Recursively process all child assets.
  asset.children.forEach((child) => {
    collectAssets(child, options, outputPath, entryPath, bundles, localBundle, tags, internalTags)
  })
}

/**
 * Generates a list of potential alias names for an asset based on the manifest options.
 *
 * @param name - The base name of the asset.
 * @param options - The manifest options.
 * @returns An array of unique alias strings.
 */
function getShortNames(name: string, options: ManifestOptions): string[] {
  const { createShortcuts, trimExtensions } = options

  const allNames = []

  // 1. The full relative path.
  allNames.push(name)
  // 2. The full relative path without extension.
  if (trimExtensions) {
    allNames.push(path.trimExt(name))
  }
  // 3. The basename only.
  if (createShortcuts) {
    allNames.push(path.basename(name))
  }
  // 4. The basename without extension.
  if (createShortcuts && trimExtensions) {
    allNames.push(path.trimExt(path.basename(name)))
  }

  // Use a Set to remove any duplicate names that may have been generated.
  return [...new Set(allNames)]
}
