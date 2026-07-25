import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#0F1119",
          900: "#14161F",
          800: "#1C1F2E",
          700: "#262A3D",
          600: "#333850",
          500: "#454B6B",
        },
        paper: {
          100: "#F4F1EA",
          200: "#E7E2D6",
        },
        amber: {
          DEFAULT: "#E8A33D",
          light: "#F2C177",
          dark: "#C7842A",
        },
        teal: {
          DEFAULT: "#4FD1C5",
          dark: "#2FA79B",
        },
        coral: {
          DEFAULT: "#F16A6A",
          dark: "#D14A4A",
        },
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        body: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-jbmono)", "monospace"],
      },
      backgroundImage: {
        "grid-lines":
          "linear-gradient(rgba(232,163,61,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(232,163,61,0.06) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "28px 28px",
      },
    },
  },
  plugins: [],
};

export default config;
