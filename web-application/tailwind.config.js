module.exports = {
  mode: 'jit',
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  content: ['node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}'],
  darkMode: false,
  theme: {
    extend: {
      colors: {
        'primary-color': '#18194d',
        'secondary-color': '#9797de',
      },
      transitionProperty: {
      'opacity': 'opacity',
      },
      fontFamily: {
        "lalezar": ['Lalezar', 'cursive'],
      }
  },
  variants: {
    extend: {
    },
  },
  plugins: [
    require('flowbite/plugin')
  ],
}}