module.exports = {
  mode: 'jit',
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        'primary-color': '#662d2a',
        'secondary-color': '#f0d0ce',
      }
    },

  },
  variants: {
    extend: {
    },
  },
  plugins: [],
}