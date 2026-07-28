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
        primary: {
          DEFAULT: "#061b0e",
          container: "#1b3022",
          fixed: "#d0e9d4",
          "fixed-dim": "#b4cdb8",
        },
        secondary: {
          DEFAULT: "#984629",
          container: "#fd9572",
          fixed: "#ffdbd0",
          "fixed-dim": "#ffb59d",
        },
        tertiary: {
          DEFAULT: "#17180a",
          container: "#2b2d1d",
          fixed: "#e4e4cc",
          "fixed-dim": "#c8c8b0",
        },
        surface: {
          DEFAULT: "#fbfbe2",
          dim: "#dbdcc4",
          bright: "#fbfbe2",
          variant: "#e4e4cc",
          container: {
            DEFAULT: "#efefd7",
            low: "#f5f5dc",
            "lowest": "#ffffff",
            high: "#eaead1",
            highest: "#e4e4cc",
          },
        },
        background: "#fbfbe2",
        foreground: "#1b1d0e",
        error: {
          DEFAULT: "#ba1a1a",
          container: "#ffdad6",
        },
        outline: {
          DEFAULT: "#737973",
          variant: "#c3c8c1",
        },
      },
      fontFamily: {
        serif: ["Noto Serif", "Georgia", "serif"],
        sans: ["Manrope", "system-ui", "sans-serif"],
      },
      borderRadius: {
        sm: "0.125rem",
        DEFAULT: "0.25rem",
        md: "0.375rem",
        lg: "0.5rem",
        xl: "0.75rem",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};

export default config;
