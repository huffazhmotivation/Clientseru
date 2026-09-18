import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Warm parchment base — not the usual cold SaaS gray.
        ink: "#1c211c",
        canvas: "#f2efe4",
        surface: "#ffffff",
        muted: "#6c6f61",
        subtle: "#9a9c8b",
        line: "#e1ddca",
        "line-soft": "#eae6d6",
        wash: "#ece7d6",

        // Brand accent — deep moss, quiet & editorial, not violet SaaS-purple.
        brand: {
          50: "#f0f4ec",
          100: "#dfe9d5",
          200: "#c2d4ae",
          300: "#a0bd84",
          400: "#7fa163",
          500: "#5f8247",
          600: "#4a6837",
          700: "#3c552d",
          800: "#314425",
          900: "#28381f",
        },
        // secondary accent — warm clay, used sparingly for highlights
        clay: {
          50: "#faf1e8",
          100: "#f2ddc4",
          200: "#e6bd8c",
          300: "#d69a5e",
          500: "#bd7038",
          600: "#9c5a2b",
        },
        accentBlue: {
          50: "#edf3f2",
          100: "#d7e4e2",
          500: "#4c7c80",
          600: "#3c646a",
        },
        accentEmerald: {
          50: "#edf5ee",
          100: "#d6e9d8",
          500: "#3f8f66",
          600: "#317252",
        },
        accentAmber: {
          50: "#faf1e2",
          100: "#f2ddb0",
          500: "#bf8a2e",
          600: "#9c6f22",
        },
        accentRose: {
          50: "#f7eeea",
          100: "#eed7cd",
          500: "#b05a45",
          600: "#914736",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "ui-serif", "Georgia", "serif"],
      },
      borderRadius: {
        DEFAULT: "12px",
        sm: "9px",
        md: "14px",
        lg: "18px",
        xl: "22px",
        "2xl": "28px",
        "3xl": "34px",
      },
      fontSize: {
        xs: ["12px", "17px"],
        sm: ["13px", "20px"],
        base: ["14.5px", "22px"],
        lg: ["16.5px", "25px"],
        xl: ["20px", "28px"],
        "2xl": ["25px", "32px"],
        "3xl": ["34px", "40px"],
        "4xl": ["44px", "48px"],
      },
      boxShadow: {
        xs: "0 1px 2px 0 rgb(28 33 28 / 0.05)",
        card: "0 1px 1px 0 rgb(28 33 28 / 0.04), 0 10px 28px -14px rgb(28 33 28 / 0.16)",
        raised: "0 18px 38px -14px rgb(28 33 28 / 0.20), 0 4px 12px -4px rgb(28 33 28 / 0.08)",
        popover: "0 24px 60px -12px rgb(28 33 28 / 0.28), 0 6px 18px -6px rgb(28 33 28 / 0.12)",
        glow: "0 0 0 1px rgb(95 130 71 / 0.14), 0 10px 26px -8px rgb(95 130 71 / 0.38)",
        "inner-glass": "inset 0 1px 0 0 rgb(255 255 255 / 0.65), inset 0 0 0 1px rgb(255 255 255 / 0.25)",
      },
      keyframes: {
        "fade-in": { from: { opacity: "0" }, to: { opacity: "1" } },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-right": {
          from: { opacity: "0", transform: "translateX(12px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.96)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        shimmer: { from: { backgroundPosition: "0% 0" }, to: { backgroundPosition: "-200% 0" } },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.25s ease-out",
        "slide-up": "slide-up 0.35s cubic-bezier(0.16,1,0.3,1)",
        "slide-in-right": "slide-in-right 0.3s cubic-bezier(0.16,1,0.3,1)",
        "scale-in": "scale-in 0.18s cubic-bezier(0.16,1,0.3,1)",
        shimmer: "shimmer 1.6s linear infinite",
        float: "float 6s ease-in-out infinite",
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #5f8247 0%, #3c646a 100%)",
        "brand-gradient-soft": "linear-gradient(135deg, #f0f4ec 0%, #edf3f2 100%)",
        "clay-gradient": "linear-gradient(135deg, #bd7038 0%, #b05a45 100%)",
        shimmer: "linear-gradient(90deg, transparent 0%, rgb(255 255 255 / 0.6) 50%, transparent 100%)",
      },
      backdropBlur: {
        xs: "3px",
      },
    },
  },
  plugins: [],
};

export default config;
