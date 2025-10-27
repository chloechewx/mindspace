/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Nunito', 'Inter', 'sans-serif'],
        serif: ['Cormorant Garamond', 'Playfair Display', 'serif'],
      },
      colors: {
        sage: {
          50: '#f6f8f6',
          100: '#e8f0e8',
          200: '#d1e1d1',
          300: '#a8c9a8',
          400: '#7dae7d',
          500: '#5a925a',
          600: '#457645',
          700: '#365d36',
          800: '#2d4a2d',
          900: '#263d26',
        },
        blush: {
          50: '#fef5f5',
          100: '#fde8e8',
          200: '#fbd5d5',
          300: '#f7b5b5',
          400: '#f18a8a',
          500: '#e66060',
          600: '#d24545',
          700: '#b03535',
          800: '#922f2f',
          900: '#7a2c2c',
        },
        lavender: {
          50: '#f7f5fd',
          100: '#eeebfb',
          200: '#dfd9f8',
          300: '#c7baf2',
          400: '#ab94ea',
          500: '#906de0',
          600: '#7a4fd3',
          700: '#6940b9',
          800: '#573698',
          900: '#49307b',
        },
        cream: {
          50: '#fefdfb',
          100: '#fdf9f3',
          200: '#faf3e8',
          300: '#f7eddc',
          400: '#f4e7d0',
          500: '#f1e1c4',
          600: '#c1b49d',
          700: '#918776',
          800: '#605a4e',
          900: '#302d27',
        },
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 6s ease-in-out 2s infinite',
        'fade-in': 'fadeIn 0.8s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'scale-in': 'scaleIn 0.5s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
