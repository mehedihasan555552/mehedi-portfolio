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
        display:  ['var(--font-playfair)', 'Georgia', 'serif'],
        body:     ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
        italic:   ['var(--font-cormorant)', 'Georgia', 'serif'],
        mono:     ['var(--font-jetbrains)', 'monospace'],
      },
    },
  },
  plugins: [],
}
