import type { Config } from "tailwindcss";

/**
 * Kairos design tokens.
 * Light "marble" build by default. To clone Luke's dark palette, flip the
 * `paper`/`ink` values (see PALETTE TOGGLE in docs/SETUP.md) — nothing else
 * needs to change because every component references the semantic tokens.
 */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#f4f1ea", // marble background
        ink: "#1a1815", // primary text
        gold: "#c9a24b", // luxury accent — used rarely
        deep: "#0d0c0a", // loader / 3D backdrop
        muted: "#6f6a60", // dimmed text
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', '"Spectral"', "serif"],
        mono: ['"IBM Plex Mono"', "ui-monospace", "monospace"],
      },
      letterSpacing: {
        eyebrow: "0.28em",
      },
      maxWidth: {
        readable: "62ch",
      },
      transitionTimingFunction: {
        // restrained, expensive easing — no bounce
        kairos: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
} satisfies Config;
