import type { Bundle, Manifest } from '#/assetpack/manifest/types'
import type {
  AssetPipe,
  PipeSystem,
} from '@assetpack/core'
import { FILE_HEADER, INTERFACE_BUNDLE, INTERFACE_MANIFEST, INTERFACE_MANIFEST_ENTRY, INTERFACE_TYPED_BUNDLE } from '#/assetpack/manifest/manifest-typescript.const'
import { path } from '@assetpack/core'
import fs from 'fs-extra'

interface TypeScriptManifestOptions {
  /**
   * The output path for the TypeScript manifest types file.
   * @default './src/gen/manifest-types.ts'
   */
  output?: string
  /**
   * The path to the manifest.json file to read from.
   * @default './src/gen/manifest.json'
   */
  manifestPath?: string
}

const DEFAULT_OPTS: TypeScriptManifestOptions = {
  output: './src/gen/manifest-types.ts',
  manifestPath: './src/gen/manifest.json',
}

/**
 * Generates TypeScript types from a manifest.json file.
 * This plugin reads the generated manifest and creates concrete TypeScript types
 * for all bundles and their asset aliases.
 *
 * @param options - Configuration options for the TypeScript generator.
 * @returns An AssetPack pipe for TypeScript type generation.
 */
export function generateManifestTypes (options: TypeScriptManifestOptions = {}): AssetPipe<TypeScriptManifestOptions> {
  const name = 'manifest-typescript'

  return {
    name,
    defaultOptions: {
      ...DEFAULT_OPTS,
      ...options,
    },

    /**
     * The finish hook is called after all assets have been processed.
     * It reads the manifest and generates TypeScript types.
     */
    async finish (_asset, options, pipeSystem: PipeSystem) {
      const outDir = path.dirname(options.output)
      const manifestPath = outDir === '.'
        ? path.joinSafe(pipeSystem.outputPath, options.manifestPath)
        : options.manifestPath

      const outputPath = outDir === '.'
        ? path.joinSafe(pipeSystem.outputPath, options.output)
        : options.output

      // Check if manifest file exists
      if (!await fs.pathExists(manifestPath)) {
        console.warn(`[${name}] Manifest file not found at: ${manifestPath}`)
        return
      }

      try {
        // Read the manifest file
        const manifest: Manifest = await fs.readJSON(manifestPath)

        // Generate TypeScript types
        const typeContent = generateTypeScriptContent(manifest)

        // Write the TypeScript file
        await fs.ensureDir(path.dirname(outputPath))
        await fs.writeFile(outputPath, typeContent, 'utf8')

        console.info(`[${name}] Generated TypeScript types at: ${outputPath}`)


        // Fix generated file formatting with eslint
        if (Bun?.version) {
          try {
            await Bun.$`bunx --bun eslint --fix ${outputPath}`
          } catch (e) {
            console.error(`[${name}] Error fixing TypeScript types:`, e)
          }
        }

      } catch (error) {
        console.error(`[${name}] Error generating TypeScript types:`, error)
      }
    },
  }
}

/**
 * Generates the TypeScript content from a manifest object.
 */
function generateTypeScriptContent (manifest: Manifest): string {
  const bundles = manifest.bundles.filter(bundle => bundle.assets.length > 0)

  // Extract bundle names
  const bundleNames = bundles.map(bundle => `'${bundle.name}'`).join('\n  | ')

  // Generate asset alias types for each bundle
  const bundleAssetTypes = bundles.map((bundle) => {
    const assetAliases = extractAssetAliases(bundle)
    if (assetAliases.length === 0) { return null }

    const typeName = getBundleAssetTypeName(bundle.name)
    const aliases = assetAliases.map(alias => `  | '${alias}'`).join('\n')

    return `/** ${bundle.name} bundle asset aliases */
export type ${typeName} =${aliases}`
  }).filter(Boolean)

  // Generate union type of all asset aliases
  const allAssetTypeNames = bundles
    .filter(bundle => extractAssetAliases(bundle).length > 0)
    .map(bundle => getBundleAssetTypeName(bundle.name))

  const allAssetAliasesUnion = allAssetTypeNames.length > 0
    ? allAssetTypeNames.map(name => `  | ${name}`).join('\n')
    : '  | never'

  // Generate concrete bundle interfaces
  const bundleInterfaces = bundles.map((bundle) => {
    const interfaceName = getBundleInterfaceName(bundle.name)
    const typeName = `'${bundle.name}'`

    return `export interface ${interfaceName} extends TypedBundle<${typeName}> {
  name: ${typeName}
}`
  })

  // Generate helper types
  const getBundleTypeMap = bundles.map((bundle) => {
    const interfaceName = getBundleInterfaceName(bundle.name)
    return `  T extends '${bundle.name}' ? ${interfaceName} :`
  }).join('\n')

  const getBundleAssetsTypeMap = bundles
    .filter(bundle => extractAssetAliases(bundle).length > 0)
    .map((bundle) => {
      const assetTypeName = getBundleAssetTypeName(bundle.name)
      return `  T extends '${bundle.name}' ? ${assetTypeName} :`
    })
    .join('\n')

  return `${FILE_HEADER}

${INTERFACE_MANIFEST}

${INTERFACE_BUNDLE}

${INTERFACE_MANIFEST_ENTRY}

/** Concrete bundle name types */
export type BundleName =
  | ${bundleNames}

${bundleAssetTypes.join('\n\n')}

/** Union of all asset aliases across all bundles */
export type AssetAlias =
${allAssetAliasesUnion}

${INTERFACE_TYPED_BUNDLE}

/** Concrete bundle types */
${bundleInterfaces.join('\n\n')}

/** Type-safe manifest with concrete bundle types */
export interface TypedManifest {
  bundles: Bundle[]
}

/** Helper type to get bundle by name */
export type GetBundle<T extends BundleName> =
${getBundleTypeMap}
  never

/** Helper type to get asset aliases for a specific bundle */
export type GetBundleAssets<T extends BundleName> =
${getBundleAssetsTypeMap}
  never`
}

/**
 * Extracts unique asset aliases from a bundle, using the shortest alias for each asset.
 */
function extractAssetAliases (bundle: Bundle): string[] {
  const aliases = new Set<string>()

  bundle.assets.forEach((asset) => {
    if (Array.isArray(asset.alias)) {
      for (const alias of asset.alias) {
        aliases.add(alias)
      }
    } else {
      aliases.add(asset.alias)
    }
  })

  return Array.from(aliases).sort()
}

/**
 * Generates a TypeScript type name for bundle asset aliases.
 */
function getBundleAssetTypeName (bundleName: string): string {
  return `${toPascalCase(bundleName)}AssetAlias`
}

/**
 * Generates a TypeScript interface name for a bundle.
 */
function getBundleInterfaceName (bundleName: string): string {
  return `${toPascalCase(bundleName)}Bundle`
}

/**
 * Converts a string to PascalCase.
 */
function toPascalCase (str: string): string {
  return str
    .split(/[-_\s]+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('')
}
