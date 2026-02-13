/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './*.html',
    './**/index.html',
    './partials/**/*.html',
    './js/**/*.js',
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
