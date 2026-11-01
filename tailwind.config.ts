import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        charcoal: {
          950: "#090a0d",
          900: "#0e1017",
          850: "#131620",
          800: "#1a1e2b",
          700: "#262b3d",
          600: "#363d54",
        },
        brand: {
          purple: {
            DEFAULT: "#9061f9",
            hover: "#7e4be6",
            light: "#a78bfa",
            muted: "#352758",
            border: "#4b367d",
          },
          green: {
            DEFAULT: "#10b981",
            hover: "#059669",
            light: "#34d399",
            muted: "#13382c",
            border: "#1c5c46",
          },
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;

