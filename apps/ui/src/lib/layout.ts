/**
 * Horizontal rhythm for full-bleed blocks (header, footer, page sections).
 *
 * RULE: every full-bleed block MUST use `SECTION_X_PADDING` for its left/right
 * padding. The header, the footer and every section share one vertical line —
 * a logo, a heading and a footer column all start at the same x. Blocks that
 * roll their own values make the content edge jump between sections, which is
 * exactly the drift this constant exists to prevent.
 *
 * Scale (matches the design's 900px breakpoint):
 *   < 400px   → 16px
 *   400–899px → 24px
 *   ≥ 900px   → 40px
 *
 * Vertical padding stays per-section — only the horizontal edge is shared.
 *
 * Do NOT hardcode `px-4` / `px-6` / `px-10` in a section. Import this instead:
 *
 *   import { SECTION_X_PADDING } from "@/lib/layout"
 *   <section className={cn(SECTION_X_PADDING, "py-12")}>
 */
export const SECTION_X_PADDING = "px-4 min-[400px]:px-6 min-[900px]:px-10"
