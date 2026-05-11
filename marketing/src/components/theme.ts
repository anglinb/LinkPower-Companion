// Shared design tokens. Mirrors the inline THEME constant in
// `src/app/page.tsx` so blog and homepage stay visually identical.
// If we ever pull the homepage's tokens into here too, just import
// from this module instead of redefining inline.

export const THEME = {
  blue: "#1573B2",
  blueDeep: "#0E5285",
  blueDarker: "#093A60",
  blueSoft: "#B8D4E8",
  blueWash: "#E6F0F8",
  mist: "#F2F5F8",
  cloud: "#FFFFFF",
  ink: "#0F172A",
  inkSoft: "#334155",
  muted: "#64748B",
  subtle: "#94A3B8",
  hairline: "#E5EAF1",
  charging: "#34C759",
  discharging: "#FF9500",
  amber: "#FFB020",
  near: "#0A1320",
} as const;

export const SITE_URL = "https://linkpower.app";
export const APP_STORE_URL =
  "https://apps.apple.com/us/app/linkpower-companion/id6762404390";
export const GITHUB_URL = "https://github.com/anglinb/LinkPower-Companion";
