import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Cool neutral base — modern, professional, not warm/earthy.
        ink: "#0f172a",
        canvas: "#eef1f8",
        surface: "#ffffff",
        muted: "#5b6478",
        subtle: "#94a0b8",
        line: "#dfe3ee",
        "line-soft": "#e8ebf4",
        wash: "#eef1f8",

        // Brand accent — modern indigo, the single confident accent colour.
        brand: {
          50: "#eef1ff",
          100: "#e0e5ff",
          200: "#c6cdfe",
          300: "#a3aefc",
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
          700: "#4338ca",
          800: "#372f9e",
          900: "#2d2a7d",
        },
        // secondary accent — muted slate-gold, used sparingly for highlights
        clay: {
          50: "#fbf8ef",
          100: "#f2e9cf",
          200: "#e3d29e",
          300: "#cfb46c",
          500: "#a9863a",
          600: "#8a6c2c",
        },
        accentBlue: {
          50: "#eff5ff",
          100: "#dce9fe",
          500: "#3b7cf6",
          600: "#2f63cc",
        },
        accentEmerald: {
          50: "#eefaf4",
          100: "#d7f1e3",
          500: "#16a672",
          600: "#0f855c",
        },
        accentAmber: {
          50: "#fef8ec",
          100: "#fbebc6",
          500: "#d99a1f",
          600: "#b07d17",
        },
        accentRose: {
          50: "#fdf1f3",
          100: "#f9dde3",
          500: "#e0496a",
          600: "#bc3856",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
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
        xs: "0 1px 2px 0 rgb(15 23 42 / 0.05)",
        card: "0 1px 1px 0 rgb(15 23 42 / 0.04), 0 10px 28px -14px rgb(15 23 42 / 0.16)",
        raised: "0 18px 38px -14px rgb(15 23 42 / 0.20), 0 4px 12px -4px rgb(15 23 42 / 0.08)",
        popover: "0 24px 60px -12px rgb(15 23 42 / 0.28), 0 6px 18px -6px rgb(15 23 42 / 0.12)",
        glow: "0 0 0 1px rgb(99 102 241 / 0.16), 0 10px 26px -8px rgb(99 102 241 / 0.42)",
        "inner-glass": "inset 0 1px 0 0 rgb(255 255 255 / 0.7), inset 0 0 0 1px rgb(255 255 255 / 0.3)",
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
        "brand-gradient": "linear-gradient(135deg, #6366f1 0%, #3b7cf6 100%)",
        "brand-gradient-soft": "linear-gradient(135deg, #eef1ff 0%, #eff5ff 100%)",
        "clay-gradient": "linear-gradient(135deg, #a9863a 0%, #e0496a 100%)",
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
