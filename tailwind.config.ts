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
        navy: {
          900: "#0b071d", // Main background from Figma
          800: "#080516", // Secondary background from Figma
        },
        orange: {
          500: "#ffa60c", // Orange accent from Figma
        },
      },
      fontFamily: {
        'source-code': ['"Source Code Pro"', 'monospace'],
        'source-sans': ['"Source Sans 3"', 'sans-serif'],
      },
      keyframes: {
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        slideDown: 'slideDown 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
        slideInRight: 'slideInRight 0.3s ease-out',
        fadeIn: 'fadeIn 0.2s ease-out',
      },
    },
  },
  plugins: [],
};
export default config;
