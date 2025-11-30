export const FILE_HEADER = `/**
 * Auto-generated TypeScript types for asset manifest
 * Generated from manifest.json - DO NOT EDIT MANUALLY
 */`

export const INTERFACE_MANIFEST = `
/** Base manifest structure */
export interface Manifest {
  bundles: Bundle[]
}`

export const INTERFACE_BUNDLE = `
export interface Bundle {
  name: string
  assets: ManifestEntry[]
  relativeName?: string
}`

export const INTERFACE_MANIFEST_ENTRY = `
export interface ManifestEntry {
  alias: string | string[]
  src: string | string[]
  data?: Record<string, any>
}`

export const INTERFACE_TYPED_BUNDLE = `
/** Type-safe bundle interface with specific asset types */
export interface TypedBundle<T extends BundleName> {
  name: T
  assets: ManifestEntry[]
  relativeName?: string
}`
