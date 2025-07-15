/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        skorange: {
          DEFAULT: '#FF6F1F', // Primary orange
          dark: '#E65C00',   // Deeper orange for hover/active
        },
        skgreen: {
          DEFAULT: '#E6F4E6', // Accent green
        },
      },
      fontFamily: {
        sans: ['Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'sk-card': '0 4px 24px 0 rgba(255, 111, 31, 0.08)',
      },
      keyframes: {
        'fade-in-scale': {
          '0%': { opacity: 0, transform: 'scale(0.95)' },
          '100%': { opacity: 1, transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-in-scale': 'fade-in-scale 0.6s cubic-bezier(0.4, 0, 0.2, 1) both',
      },
    },
  },
  plugins: [],
};
