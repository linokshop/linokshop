#!/usr/bin/env node

/**
 * Cross-platform replacement for the Unix-only prepare script:
 *   if git rev-parse --is-inside-work-tree >/dev/null 2>&1;
 *     then lefthook install --reset-hooks-path;
 *     else echo 'Skipping lefthook install: not inside a Git worktree.'; fi
 *
 * Installs lefthook git hooks, but only when inside a git work tree (so it is
 * a no-op for tarball installs / Docker builds without a .git dir). Works on
 * Windows, macOS and Linux. On Windows the lefthook bin is a .cmd, which Node
 * refuses to spawn without a shell (EINVAL since CVE-2024-27980), so use one.
 */

import { spawnSync } from "node:child_process"
import process from "node:process"

const useShell = process.platform === "win32"

const inGitWorkTree =
  spawnSync("git", ["rev-parse", "--is-inside-work-tree"], {
    stdio: "ignore",
    shell: useShell,
  }).status === 0

if (!inGitWorkTree) {
  console.log("[prepare] Not inside a Git work tree; skipping lefthook install.")
  process.exit(0)
}

const result = spawnSync("lefthook", ["install", "--reset-hooks-path"], {
  stdio: "inherit",
  shell: useShell,
})

process.exit(result.status ?? 0)
