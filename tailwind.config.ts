import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Deep space canvas — total departure from the old warm/light look.
        ink: "#f4f5fb",
        canvas: "#0a0b16",
        surface: "#12142600",
        muted: "#a6acc4",
        subtle: "#6b7290",
        line: "rgba(255,255,255,0.12)",
        "line-soft": "rgba(255,255,255,0.08)",
        wash: "rgba(255,255,255,0.06)",

        // Brand accent — electric violet, the signature colour of this theme.
        brand: {
          50: "#f2edff",
          100: "#e4d9ff",
          200: "#c8b3ff",
          300: "#a980ff",
          400: "#8f5cff",
          500: "#7c3aed",
          600: "#6d28d9",
          700: "#5b21b6",
          800: "#4c1d95",
          900: "#3b1877",
        },
        // secondary accent — warm amber-gold, used sparingly for highlights
        clay: {
          50: "#fdf6e8",
          100: "#f7e6b8",
          200: "#f0d281",
          300: "#e6b94a",
          500: "#d99a1f",
          600: "#b17e17",
        },
        accentBlue: {
          50: "#e8f6ff",
          100: "#c9ecff",
          500: "#22b8f2",
          600: "#0e93cc",
        },
        accentEmerald: {
          50: "#e8fbf3",
          100: "#c3f3de",
          500: "#1fcf8e",
          600: "#14a874",
        },
        accentAmber: {
          50: "#fdf6e6",
          100: "#f8e6b8",
          500: "#f0a71f",
          600: "#c98614",
        },
        accentRose: {
          50: "#feecf3",
          100: "#fbd0e2",
          500: "#f2478e",
          600: "#d92e72",
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
        xs: "0 1px 2px 0 rgb(0 0 0 / 0.2)",
        card: "0 1px 1px 0 rgb(0 0 0 / 0.2), 0 10px 30px -12px rgb(0 0 0 / 0.55)",
        raised: "0 20px 45px -16px rgb(0 0 0 / 0.6), 0 4px 14px -4px rgb(0 0 0 / 0.35)",
        popover: "0 26px 65px -14px rgb(0 0 0 / 0.65), 0 6px 20px -6px rgb(0 0 0 / 0.4)",
        glow: "0 0 0 1px rgb(124 58 237 / 0.35), 0 0 40px -6px rgb(124 58 237 / 0.55)",
        "glow-cyan": "0 0 0 1px rgb(34 184 242 / 0.35), 0 0 40px -6px rgb(34 184 242 / 0.55)",
        "inner-glass": "inset 0 1px 0 0 rgb(255 255 255 / 0.14), inset 0 0 0 1px rgb(255 255 255 / 0.06)",
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
        "brand-gradient": "linear-gradient(135deg, #7c3aed 0%, #22b8f2 100%)",
        "brand-gradient-soft": "linear-gradient(135deg, rgba(124,58,237,0.18) 0%, rgba(34,184,242,0.14) 100%)",
        "clay-gradient": "linear-gradient(135deg, #d99a1f 0%, #f2478e 100%)",
        shimmer: "linear-gradient(90deg, transparent 0%, rgb(255 255 255 / 0.15) 50%, transparent 100%)",
      },
      backdropBlur: {
        xs: "3px",
      },
    },
  },
  plugins: [],
};

export default config;
