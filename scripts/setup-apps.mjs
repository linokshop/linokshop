#!/usr/bin/env node

/**
 * Cross-platform replacement for the Unix-only:
 *   find . -name '*.example' -exec sh -c 'cp -n "$1" "${1%.example}"' _ {} \;
 *
 * Recursively copies every `*.example` file to its non-`.example` counterpart
 * without overwriting an existing target (like `cp -n`). Works on Windows,
 * macOS and Linux. Skips node_modules / .git and other build output dirs.
 */

import { copyFileSync, existsSync, readdirSync } from "node:fs"
import path from "node:path"
import process from "node:process"
import { fileURLToPath } from "node:url"

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")

const IGNORED_DIRS = new Set([
  "node_modules",
  ".git",
  ".next",
  ".turbo",
  "dist",
  "build",
])

let copied = 0

walk(repoRoot)

if (copied === 0) {
  console.log("[setup:apps] No new .example files to copy.")
}

function walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (IGNORED_DIRS.has(entry.name)) continue
      walk(path.join(dir, entry.name))
      continue
    }

    if (!entry.name.endsWith(".example")) continue

    const source = path.join(dir, entry.name)
    const target = source.slice(0, -".example".length)

    if (existsSync(target)) continue

    copyFileSync(source, target)
    copied += 1
    console.log(`[setup:apps] ${path.relative(repoRoot, target)}`)
  }
}
