import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#16161a",
        muted: "#6f6f78",
        line: "#e6e6e9",
        wash: "#fafafa",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      borderRadius: { DEFAULT: "5px", md: "5px", lg: "7px" },
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
