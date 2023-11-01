module.exports = {
  mode: 'jit',
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false,
  theme: {
    extend: {
      colors: {
        'primary-color': '#18194d',
        'secondary-color': '#9797de',
      },
      transitionProperty: {
      'opacity': 'opacity',
      }

  },
  variants: {
    extend: {
    },
  },
  plugins: [],
}}