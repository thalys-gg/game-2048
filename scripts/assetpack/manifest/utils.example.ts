import { getManifestName } from './utils'

// The getManifestName function is designed to extract a specific manifest name
// from a file path, based on a special {m} marker in the directory structure.
// This is particularly useful in asset management systems where you need to group
// assets into different bundles or manifests based on their location in the file system.

// ANSI color codes for terminal output
const colors = {
  reset: '\x1B[0m',
  bright: '\x1B[1m',
  dim: '\x1B[2m',
  underscore: '\x1B[4m',
  fg: {
    yellow: '\x1B[33m',
    cyan: '\x1B[36m',
    green: '\x1B[32m',
    magenta: '\x1B[35m',
    red: '\x1B[31m',
  },
  bg: {
    yellow: '\x1B[43m',
  },
}

const yellow = (text: string) => `${colors.fg.yellow}${text}${colors.reset}`
const cyan = (text: string) => `${colors.fg.cyan}${text}${colors.reset}`
const green = (text: string) => `${colors.fg.green}${text}${colors.reset}`
const magenta = (text: string) => `${colors.fg.magenta}${text}${colors.reset}`
const red = (text: string) => `${colors.fg.red}${text}${colors.reset}`
const bold = (text: string) => `${colors.bright}${text}${colors.reset}`

console.log(magenta(`
/**
 * =================================================================================
 * ${bold(yellow('Example usage of getManifestName from ./utils.ts'))}
 * =================================================================================
 *
 * To run this example, execute the following command in your terminal:
 * ${cyan('bun run scripts/assetpack/manifest/utils.example.ts')}
 *
 */`))

console.log(yellow('--- Example 1: Extracting manifest name from a nested asset ---'))

const entryPath1 = '/raw-assets'
const assetPath1 = '/raw-assets/level1{m}/enemies{tps}/enemy1.png'
const manifestName1 = getManifestName(assetPath1, entryPath1)

console.log(`
  Asset Path: ${cyan(`"${assetPath1}"`)}
  Entry Path: ${cyan(`"${entryPath1}"`)}
  --------------------------------------------------
  Resulting Manifest Name: ${green(`"${manifestName1}"`)}
`)

console.log(yellow('\n--- Example 2: Extracting from a different manifest root ---'))

const entryPath2 = '/raw-assets'
const assetPath2 = '/raw-assets/common{m}/ui/button.png'
const manifestName2 = getManifestName(assetPath2, entryPath2)

console.log(`
  Asset Path: ${cyan(`"${assetPath2}"`)}
  Entry Path: ${cyan(`"${entryPath2}"`)}
  --------------------------------------------------
  Resulting Manifest Name: ${green(`"${manifestName2}"`)}
`)

console.log(yellow('\n--- Example 3: Asset not in a manifest-marked folder ---'))

const assetPath3 = '/raw-assets/unmarked-folder/some-asset.png'
const manifestName3 = getManifestName(assetPath3, entryPath1)

console.log(`
  Asset Path: ${cyan(`"${assetPath3}"`)}
  Entry Path: ${cyan(`"${entryPath1}"`)}
  --------------------------------------------------
  Resulting Manifest Name: ${red(manifestName3 === null ? 'null' : `"${manifestName3}"`)}
`)

console.log(magenta(`
/**
 * =================================================================================
 * This allows you to programmatically assign assets to different manifests,
 * which can then be loaded or unloaded by your game engine as needed.
 * For instance, you could load the "common" manifest at the start of your game
 * and then load the "level1" manifest only when the player enters that level.
 * =================================================================================
 */
`))
