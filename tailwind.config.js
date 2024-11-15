/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      transition: {
        'all': 'all 0.3s ease',
      }
    },
  },
  plugins: [],
}