import process from 'node:process'
import { logger } from '@thalys/logger'

const ERROR = {
  MISSING_GIT_LFS: {
    PRIMARY: 'This repository is configured for Git LFS but `git-lfs` was not found on your path.',
    SECONDARY:
      'If you no longer wish to use Git LFS, remove the hook from the `simple-git-hooks` section in your package.json.',
  },
}

export async function hasGitLFS() {
  try {
    await Bun.$`command -v git-lfs`.quiet()
  } catch (e) {
    logger.error(ERROR.MISSING_GIT_LFS.PRIMARY)
    logger.error(ERROR.MISSING_GIT_LFS.SECONDARY)
    // logger.error(e)
    process.exit(2)
  }
}
