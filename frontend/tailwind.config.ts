import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Base — Notion warm-white palette
        canvas:   "#FAFAF9",
        page:     "#FFFFFF",
        subtle:   "#F4F4F2",
        ui:       "#EBEBEA",
        line:     "#E4E4E2",
        "line-strong": "#CDCDC9",

        // Text
        ink:      "#1A1A1A",
        "ink-2":  "#6B6B6B",
        "ink-3":  "#ABABAB",
        "ink-4":  "#D0D0CD",

        // Brand — warm indigo
        gnomo:        "#6B5CE7",
        "gnomo-soft": "#F3F1FF",
        "gnomo-dim":  "#5548C8",

        // Model tiers — muted, clean
        haiku: {
          DEFAULT: "#059669",
          soft:    "#F0FDF4",
          text:    "#047857",
        },
        sonnet: {
          DEFAULT: "#2563EB",
          soft:    "#EFF6FF",
          text:    "#1D4ED8",
        },
        opus: {
          DEFAULT: "#7C3AED",
          soft:    "#F5F3FF",
          text:    "#6D28D9",
        },

        // Status
        ok:   "#16A34A",
        warn: "#D97706",
        bad:  "#DC2626",
      },

      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', '"Fira Code"', "monospace"],
      },

      fontSize: {
        "2xs": ["0.6875rem", { lineHeight: "1rem" }],
      },

      boxShadow: {
        card:       "0 1px 3px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)",
        "card-md":  "0 4px 12px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)",
        "card-lg":  "0 8px 24px rgba(0,0,0,0.10), 0 0 0 1px rgba(0,0,0,0.04)",
        popover:    "0 8px 30px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.06)",
      },

      borderRadius: {
        "4xl": "2rem",
      },

      animation: {
        "fade-in":   "fadeIn 0.2s ease",
        "slide-up":  "slideUp 0.25s cubic-bezier(0.16,1,0.3,1)",
        "badge-pop": "badgePop 0.3s cubic-bezier(0.16,1,0.3,1)",
        "spin-slow": "spin 2s linear infinite",
        "pulse-dot": "pulseDot 2s ease-in-out infinite",
      },
      keyframes: {
        fadeIn:   { from: { opacity: "0" }, to: { opacity: "1" } },
        slideUp:  {
          from: { opacity: "0", transform: "translateY(8px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        badgePop: {
          "0%":   { opacity: "0", transform: "scale(0.7)" },
          "70%":  { transform: "scale(1.06)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        pulseDot: {
          "0%,100%": { opacity: "1" },
          "50%":     { opacity: "0.35" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
