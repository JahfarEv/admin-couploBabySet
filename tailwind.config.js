/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['"DM Sans"', 'sans-serif'],
      },
      colors: {
        cream: {
          DEFAULT: '#FAF6F1',
          soft: '#FBF8F4',
          deep: '#F3ECE4',
        },
        blush: {
          50: '#FDF3F3',
          100: '#F9E2E3',
          200: '#F4CACD',
          300: '#EDB0B6',
        },
        mauve: {
          400: '#9C6B72',
          500: '#7E525A',
          600: '#6D4A50',
          700: '#5A3C41',
        },
        ink: {
          DEFAULT: '#2E2926',
          soft: '#524A46',
          muted: '#8C837C',
          faint: '#B5ACA4',
        },
        mint: {
          100: '#DEEEE7',
          500: '#5FA285',
        },
        sky: {
          100: '#DCEAF4',
          500: '#4E85AC',
        },
        sand: {
          100: '#EFEAE3',
          500: '#9C9186',
        },
      },
      boxShadow: {
        card: '0 1px 2px rgba(46, 41, 38, 0.04), 0 8px 24px -12px rgba(46, 41, 38, 0.10)',
        panel: '0 20px 60px -20px rgba(93, 60, 65, 0.25)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
    },
  },
  plugins: [],
}
