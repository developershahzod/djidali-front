/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f5f3ed',
          100: '#e8e3d3',
          200: '#d4cab0',
          300: '#bfac87',
          400: '#a89563',
          500: '#8f7b49',
          600: '#7a673d',
          700: '#645333',
          800: '#50432c',
          900: '#433826',
        },
        earth: {
          50: '#fafaf8',
          100: '#f2f1ed',
          200: '#e5e3da',
          300: '#d1cdc0',
          400: '#b5afa0',
          500: '#9a9283',
          600: '#7e7767',
          700: '#635f52',
          800: '#4d4a41',
          900: '#3a3833',
        },
        nature: {
          50: '#f5f7f5',
          100: '#e8ede8',
          200: '#d1dbd1',
          300: '#afc2af',
          400: '#85a285',
          500: '#5f8560',
          600: '#4a6a4b',
          700: '#3c553d',
          800: '#324532',
          900: '#2a3a2b',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      fontSize: {
        'display-1': ['4.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-2': ['3.75rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'h1': ['3rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'h2': ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'h3': ['1.875rem', { lineHeight: '1.3', letterSpacing: '-0.01em' }],
        'h4': ['1.5rem', { lineHeight: '1.4' }],
        'body-lg': ['1.125rem', { lineHeight: '1.5' }],
        'body': ['1rem', { lineHeight: '1.5' }],
        'body-sm': ['0.875rem', { lineHeight: '1.5' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      }
    },
  },
  plugins: [],
};
