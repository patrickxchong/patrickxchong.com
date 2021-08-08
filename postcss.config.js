module.exports = {
  syntax: 'postcss-scss',
  plugins: [
    require('postcss-import'),
    require('@mozaic-ds/postcss-sass'),
    require('tailwindcss'),
    ...process.env.NODE_ENV === "production" ? [require('autoprefixer'), require('cssnano')] : []
  ]
};
