import type { PluginOptions } from '@assetpack/core'

/** Represents a bundle of assets in the manifest. */
export interface Bundle {
  /** The name of the bundle. */
  name: string
  /** An array of asset entries belonging to this bundle. */
  assets: ManifestEntry[]
  /** The relative path of the bundle, used for disambiguation if names conflict. */
  relativeName?: string
}

/** Represents the complete asset manifest structure. */
export interface Manifest {
  /** An array of asset bundles. */
  bundles: Bundle[]
}

/** Represents a single asset entry within a manifest bundle. */
export interface ManifestEntry {
  /** The alias or aliases that can be used to retrieve the asset. */
  alias: string | string[]
  /** The source path or paths of the asset files. */
  src: string | string[]
  /** Optional metadata associated with the asset. */
  data?: {
    [x: string]: any
  }
}

/** Defines the options for the manifest generation plugin. */
export interface ManifestOptions extends PluginOptions {
  /**
   * The output location for the generated typescript definitions.
   * If unset, does not generate
   * @default undefined
   */
  typesOutput?: string
  /**
   * The output location for the manifest.json file.
   * @default 'manifest.json'
   */
  output?: string
  /**
   * If true, creates short aliases for assets using just their basename.
   * @default false
   */
  createShortcuts?: boolean
  /**
   * If true, removes file extensions from the generated aliases.
   * @default false
   */
  trimExtensions?: boolean
  /**
   * If true, includes asset metadata in the 'data' field of the manifest entry.
   * @default true
   */
  includeMetaData?: boolean
  /**
   * The naming convention for asset bundles in the manifest.
   * - 'short': Uses the directory name containing the `{m}` tag.
   * - 'relative': Uses the full relative path to the directory containing the `{m}` tag.
   * @default 'short'
   */
  nameStyle?: 'short' | 'relative'
  /**
   * If true, all tags are outputted in the `data.tags` field of the manifest.
   * If false, only internal tags are outputted to `data.tags`, while other tags are outputted directly to the `data` field.
   * @example
   * ```json
   * {
   *   "bundles": [
   *     {
   *       "name": "default",
   *       "assets": [
   *         {
   *           "alias": ["test"],
   *           "src": ["test.png"],
   *           "data": {
   *             "tags": {
   *               "nc": true,
   *               "customTag": true // This tag will be in `data.tags` if legacyMetaDataOutput is true.
   *             }
   *           }
   *         }
   *       ]
   *     }
   *   ]
   * }
   * ```
   * @default true
   */
  legacyMetaDataOutput?: boolean
}
