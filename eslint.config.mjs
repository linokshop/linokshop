import baseConfig from "@repo/eslint-config"

/** @type {import("eslint").Linter.Config[]} */
export default [
  // Design handoff mockups — reference material, not app code. Don't lint.
  { ignores: ["design_handoff_linok/**"] },
  ...baseConfig,
]
