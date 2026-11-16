/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#070B14',
          900: '#0B132B',
          850: '#0F172A',
          800: '#1C2541',
          700: '#263456',
          600: '#3A4D78'
        },
        brand: {
          teal: {
            DEFAULT: '#0D9488',
            hover: '#0F766E',
            light: '#14B8A6',
            accent: '#2DD4BF',
            subtle: '#CCFBF1'
          },
          lightblue: {
            DEFAULT: '#38BDF8',
            dark: '#0284C7',
            light: '#7DD3FC',
            subtle: '#E0F2FE'
          }
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['Fira Code', 'JetBrains Mono', 'Consolas', 'monospace']
      }
    },
  },
  plugins: [],
}

