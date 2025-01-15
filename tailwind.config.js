/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      maxWidth: {
        'xxs': '16rem',
        'xxxs': '12rem',
      },
      minHeight: {
        'screen-75': '75vh',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
      backdropBlur: {
        'xs': '2px',
      },
      backgroundColor: {
        'glass': 'rgba(255, 255, 255, 0.1)',
      },
      backgroundOpacity: {
        '15': '0.15',
      },
    },
  },
  plugins: [],
};
