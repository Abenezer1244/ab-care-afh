/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './*.html',
    './scripts/**/*.js',
  ],
  theme: {
    extend: {
      colors: {
        coral: '#B05C3A',
        'coral-soft': '#EFDCD1',
        ink: '#1F1B1A',
        cream: '#FAF7F2',
        'warm-dark': '#1B1714',
      },
      maxWidth: {
        '[1400px]': '1400px',
      },
    },
  },
  plugins: [],
};
