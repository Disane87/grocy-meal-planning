/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      width: {
        '1/7': "14.28571428571429%",
      },
      borderColor: {
        DEFAULT: '#e5e7eb', // gray-200 as default border color
      }
    },
  },
  plugins: [],
}

