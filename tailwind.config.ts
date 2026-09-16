import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#172033",
        muted: "#667085",
        line: "#e5eaf2",
        wash: "#f5f7fb",
        primary: "#635bff",
        "primary-dark": "#5048d8",
        sky: "#2f80ed",
        success: "#149b72",
        warning: "#d98a22",
        surface: "#ffffff",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-space)", "var(--font-inter)", "sans-serif"],
      },
      borderRadius: { DEFAULT: "10px", md: "12px", lg: "16px", xl: "20px" },
      fontSize: {
        xs: ["12px", "16px"],
        sm: ["13px", "20px"],
        base: ["14px", "22px"],
        lg: ["16px", "24px"],
        xl: ["19px", "26px"],
        "2xl": ["24px", "30px"],
        "3xl": ["32px", "38px"],
      },
    },
  },
  plugins: [],
};

export default config;
