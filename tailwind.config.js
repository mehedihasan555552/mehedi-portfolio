/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/context/**/*.{js,ts,jsx,tsx,mdx}',
    './src/hooks/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans:    ['var(--font-inter)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        body:    ['var(--font-inter)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        italic:  ['var(--font-inter)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['var(--font-jetbrains)', 'ui-monospace', 'monospace'],
        mono:    ['var(--font-jetbrains)', 'ui-monospace', 'monospace'],
      },
      colors: {
        accent: 'var(--accent)',
        signal: 'var(--signal)',
      },
      borderRadius: {
        xs: 'var(--r-xs)',
        sm: 'var(--r-sm)',
        DEFAULT: 'var(--r-md)',
        md: 'var(--r-md)',
        lg: 'var(--r-lg)',
        xl: 'var(--r-xl)',
      },
      transitionTimingFunction: {
        expo:   'cubic-bezier(0.16, 1, 0.30, 1)',
        quart:  'cubic-bezier(0.25, 1, 0.50, 1)',
        spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        swift:  'cubic-bezier(0.40, 0.00, 0.20, 1)',
      },
    },
  },
  plugins: [],
}
