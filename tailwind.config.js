/** @type {import('tailwindcss').Config} */
const flowbite = require("flowbite-react/tailwind");

function customColors(cssVar) {
  return ({ opacityVariable, opacityValue }) => {
    if (opacityValue !== undefined) {
      return `rgba(var(${cssVar}), ${opacityValue})`;
    }
    if (opacityVariable !== undefined) {
      return `rgba(var(${cssVar}), var(${opacityVariable}, 1))`;
    }
    return `rgb(var(${cssVar}))`;
  };
}

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", flowbite.content()],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        "2xl": "128px",
      },
    },
    extend: {
      colors: {
        "light-blue": "rgba(63, 196, 251, 1)",
        purple: "rgba(76, 70, 252, 1)",
        primary: {
          50: customColors("--c-primary-50"),
          100: customColors("--c-primary-100"),
          200: customColors("--c-primary-200"),
          300: customColors("--c-primary-300"),
          400: customColors("--c-primary-400"),
          500: customColors("--c-primary-500"),
          6000: "#7066e0", //(purple color)
          700: "#4137b8",
          800: customColors("--c-primary-800"),
          900: customColors("--c-primary-900"),
        },
        secondary: {
          50: customColors("--c-secondary-50"),
          100: customColors("--c-secondary-100"),
          200: customColors("--c-secondary-200"),
          300: customColors("--c-secondary-300"),
          400: customColors("--c-secondary-400"),
          500: "#f34a42", //(red color)
          6000: "#e73c34", //(red color)
          700: customColors("--c-secondary-700"),
          800: customColors("--c-secondary-800"),
          900: customColors("--c-secondary-900"),
        },
        neutral: {
          50: customColors("--c-neutral-50"),
          100: customColors("--c-neutral-100"),
          200: customColors("--c-neutral-200"),
          300: customColors("--c-neutral-300"),
          400: customColors("--c-neutral-400"),
          500: customColors("--c-neutral-500"),
          6000: customColors("--c-neutral-600"),
          700: customColors("--c-neutral-700"),
          800: customColors("--c-neutral-800"),
          900: customColors("--c-neutral-900"),
        },
        background: {
          50: customColors("--c-neutral-50"),
          100: customColors("--c-neutral-100"),
          200: customColors("--c-neutral-200"),
          300: customColors("--c-neutral-300"),
          400: customColors("--c-neutral-400"),
          500: customColors("--c-neutral-500"),
          6000: "#031f3d",
          700: "#00162d",
          800: customColors("--c-neutral-800"),
          900: customColors("--c-neutral-900"),
        },
      },
      keyframes: {
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "25%": { transform: "translateX(-5px)" },
          "75%": { transform: "translateX(5px)" },
        },
        slide: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        spinner: {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.16)" },
          "100%": { transform: "scale(1)" },
        },
        breathe: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
        textLoader: {
          '0%, 100%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
        },
        'text-gradient': {
          '0%, 100%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
        },
      },
      animation: {
        shake: "shake 0.5s ease-in-out",
        slide: "slide 1s linear infinite",
        // spinLoader: "spin 1s linear infinite",
        pulserEffect: "spinner 2s linear 1s infinite",
        breathe: 'breathe 2.5s ease-in-out infinite',
        textLoader: 'text 5s ease infinite',
        pulseLoader: 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 3s linear infinite',
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'text-gradient': 'text-gradient 6s linear infinite',
      },
    },
    variants: {
      extend: {},
    },
  },
  plugins: [flowbite.plugin()],
};
