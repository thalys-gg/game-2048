#!/usr/bin/env bun

import { hasGitLFS } from '#/bun/git/hooks'

const gitArgs = Bun.argv.slice(2).join(' ')
// logger.debug(import.meta.file, '\n', gitArgs)
await hasGitLFS()
await Bun.$`git lfs pre-push ${gitArgs}`
