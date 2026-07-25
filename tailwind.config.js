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
        display:  ['var(--font-jetbrains)', 'monospace'],
        body:     ['var(--font-jetbrains)', 'monospace'],
        italic:   ['var(--font-jetbrains)', 'monospace'],
        mono:     ['var(--font-jetbrains)', 'monospace'],
      },
    },
  },
  plugins: [],
}
