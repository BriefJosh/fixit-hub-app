import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        poster: ['Anton', 'sans-serif'],
      },
      colors: {
        brand: { DEFAULT: '#15B877', 600: '#0FA869', 700: '#0E8C58', ink: '#0A1A13' },
        mint: { 50: '#F1FBF6', 100: '#E3F7EC', 200: '#CDEFDC', 300: '#86E0B8' },
        sun: { DEFAULT: '#FFD21E', 600: '#F5B100' },
      },
      boxShadow: {
        soft: '0 16px 50px -16px rgba(10,26,19,0.22)',
        card: '0 4px 24px -10px rgba(10,26,19,0.14)',
      },
    },
  },
  plugins: [],
} satisfies Config
