import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Neutral base — cool slate, not flat gray
        ink: "#0f1115",
        canvas: "#f6f7f9",
        surface: "#ffffff",
        muted: "#6b7280",
        subtle: "#9aa1ae",
        line: "#e7e9ee",
        "line-soft": "#eef0f4",
        wash: "#f3f4f7",

        // Brand accent — violet → blue, "professional creative SaaS"
        brand: {
          50: "#f2f1ff",
          100: "#e6e4ff",
          200: "#cfcbff",
          300: "#aca4ff",
          400: "#8b7ffb",
          500: "#6f5cf0",
          600: "#5b3fe0",
          700: "#4c31bf",
          800: "#3f2a99",
          900: "#35267a",
        },
        accentBlue: {
          50: "#eef6ff",
          100: "#dcedff",
          500: "#3b82f6",
          600: "#2563eb",
        },
        accentEmerald: {
          50: "#ecfdf5",
          100: "#d1fae5",
          500: "#10b981",
          600: "#059669",
        },
        accentAmber: {
          50: "#fffbeb",
          100: "#fef3c7",
          500: "#f59e0b",
          600: "#d97706",
        },
        accentRose: {
          50: "#fff1f2",
          100: "#ffe4e6",
          500: "#f43f5e",
          600: "#e11d48",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "10px",
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "20px",
        "2xl": "26px",
      },
      fontSize: {
        xs: ["12px", "17px"],
        sm: ["13px", "20px"],
        base: ["14.5px", "22px"],
        lg: ["16px", "24px"],
        xl: ["19px", "27px"],
        "2xl": ["24px", "31px"],
        "3xl": ["32px", "39px"],
        "4xl": ["40px", "46px"],
      },
      boxShadow: {
        xs: "0 1px 2px 0 rgb(15 17 21 / 0.04)",
        card: "0 1px 2px 0 rgb(15 17 21 / 0.04), 0 1px 1px 0 rgb(15 17 21 / 0.03)",
        raised: "0 4px 16px -4px rgb(15 17 21 / 0.10), 0 2px 6px -2px rgb(15 17 21 / 0.06)",
        popover: "0 12px 32px -8px rgb(15 17 21 / 0.18), 0 4px 12px -4px rgb(15 17 21 / 0.10)",
        glow: "0 0 0 1px rgb(111 92 240 / 0.12), 0 8px 24px -8px rgb(111 92 240 / 0.35)",
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
      },
      animation: {
        "fade-in": "fade-in 0.25s ease-out",
        "slide-up": "slide-up 0.35s cubic-bezier(0.16,1,0.3,1)",
        "slide-in-right": "slide-in-right 0.3s cubic-bezier(0.16,1,0.3,1)",
        "scale-in": "scale-in 0.18s cubic-bezier(0.16,1,0.3,1)",
        shimmer: "shimmer 1.6s linear infinite",
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #6f5cf0 0%, #3b82f6 100%)",
        "brand-gradient-soft": "linear-gradient(135deg, #f2f1ff 0%, #eef6ff 100%)",
        shimmer: "linear-gradient(90deg, transparent 0%, rgb(255 255 255 / 0.6) 50%, transparent 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
