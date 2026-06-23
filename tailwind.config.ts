import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Cormorant Garamond"', "Georgia", "ui-serif", "serif"],
      },
      colors: {
        gold: {
          DEFAULT: "#d4af37",
          light: "#f6e7a8",
          bloom: "#fff7df",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
