import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563eb',
        secondary: '#1f2937',
      },
      fontFamily: {
        sans: ['var(--font-phetsarath)', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config
