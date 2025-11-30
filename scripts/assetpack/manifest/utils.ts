/**
 * Extracts a manifest name from a given asset path.
 * The manifest name is derived from the path of the last directory containing a `{m}` marker.
 * This function constructs a path up to and including that marked directory,
 * then removes any `{...}` style tags and leading/trailing slashes.
 *
 * @param path - The full path of the asset.
 * @param entry - The base entry path to be removed from the asset path.
 * @returns The calculated manifest name, or null if no directory with a `{m}` marker is found.
 */
export function getManifestName (path: string, entry: string): string | null {
  // Get the asset's path relative to the entry directory.
  const val = path.replace(entry, '')

  // Find the last directory segment in the path that is marked as a manifest root with `{m}`.
  const res = val.split('/').filter((v: string) => v.match(/\{m\}/) !== null).at(-1) as string

  // If no manifest-marked directory is found, there's nothing to do.
  if (!res) { return null }

  // Reconstruct the path up to the manifest-marked directory.
  const split = val.split(res)
  // Remove all tags (e.g., {m}, {tps}) from the path to get a clean name.
  let targetPath = (split[0] + res).replace(/\{(.*?)\}/g, '')

  // Clean up any leading or trailing slashes from the resulting path.
  if (targetPath.startsWith('/')) { targetPath = targetPath.slice(1) }
  if (targetPath.endsWith('/')) { targetPath = targetPath.slice(0, -1) }

  return targetPath
}
