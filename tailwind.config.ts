import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: ["selector", "[data-mode='dark']"],
  theme: {
    extend: {
      colors: {
        kumo: {
          base: "var(--color-kumo-base)",
          elevated: "var(--color-kumo-elevated)",
          recessed: "var(--color-kumo-recessed)",
          overlay: "var(--color-kumo-overlay)",
          contrast: "var(--color-kumo-contrast)",
          control: "var(--color-kumo-control)",
          tint: "var(--color-kumo-tint)",
          interact: "var(--color-kumo-interact)",
          fill: "var(--color-kumo-fill)",
          line: "var(--color-kumo-line)",
          ring: "var(--color-kumo-ring)",
          brand: "var(--color-kumo-brand)",
          "brand-hover": "var(--color-kumo-brand-hover)",
          "brand-text": "var(--color-kumo-brand-text)",
          info: "var(--color-kumo-info)",
          success: "var(--color-kumo-success)",
          warning: "var(--color-kumo-warning)",
          danger: "var(--color-kumo-danger)",
        },
        text: {
          default: "var(--text-color-default)",
          subtle: "var(--text-color-subtle)",
          inactive: "var(--text-color-inactive)",
          link: "var(--text-color-link)",
        },
      },
      fontFamily: {
        sans: ['"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        xs: ['12px', { lineHeight: '1.33' }],
        sm: ['13px', { lineHeight: '1.23' }],
        base: ['14px', { lineHeight: '1.43' }],
        lg: ['16px', { lineHeight: '1.25' }],
        xl: ['20px', { lineHeight: '1.4' }],
        '2xl': ['24px', { lineHeight: '1.33' }],
        '3xl': ['32px', { lineHeight: '1.25' }],
        '4xl': ['40px', { lineHeight: '1.2' }],
      },
      keyframes: {
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
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
        slideDown: 'slideDown 0.8s cubic-bezier(0.25, 0.1, 0.25, 1)',
        slideInRight: 'slideInRight 0.3s ease-out',
        fadeIn: 'fadeIn 0.5s cubic-bezier(0.19, 1, 0.22, 1)',
      },
    },
  },
  plugins: [],
};
export default config;
