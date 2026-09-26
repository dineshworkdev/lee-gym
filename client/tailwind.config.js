/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Lee Gym brand palette
        yellow: {
          DEFAULT: '#F4C400',
          50:  '#FFFAE6',
          100: '#FFF3B3',
          200: '#FFE866',
          300: '#F4C400',
          400: '#D4A900',
          500: '#B38E00',
        },
        charcoal: {
          DEFAULT: '#252A2E',
          light: '#2E343A',
          dark: '#1A1E22',
        },
        slate: {
          gym: '#4B555D',
        },
        red: {
          gym: '#A83D3D',
          light: '#C94747',
        },
        warm: {
          bg: '#F7F5EF',
          50:  '#F9F8F4',
        },
        success: {
          DEFAULT: '#2F7D4A',
        },
      },
      fontFamily: {
        display: ['Bebas Neue', 'Impact', 'Arial Black', 'sans-serif'],
        body:    ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'hero-xl': ['clamp(4rem, 9vw, 8.5rem)', { lineHeight: '0.9', letterSpacing: '-0.01em' }],
        'hero-lg': ['clamp(3rem, 7vw, 6.5rem)', { lineHeight: '0.92', letterSpacing: '-0.01em' }],
        'hero-md': ['clamp(2rem, 5vw, 4rem)',   { lineHeight: '0.95', letterSpacing: '-0.01em' }],
      },
      screens: {
        xs: '390px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1440px',
      },
      animation: {
        'fade-up': 'fadeUp 0.7s ease forwards',
        'fade-in': 'fadeIn 0.6s ease forwards',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
