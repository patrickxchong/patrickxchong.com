const htmlmin = require('html-minifier');

module.exports = (content, outputPath) => {
  if (
    process.env.NODE_ENV !== 'production'
    || !outputPath
    || !outputPath.endsWith('.html')) {
    return content;
  }
  // returned minified content from html files in production

  let minified = htmlmin.minify(content, {
    useShortDoctype: true,
    removeComments: true,
    collapseWhitespace: true,
    minifyCSS: true,
    minifyJS: true,
    collapseWhitespace: true,
    conservativeCollapse: true
  });

  return minified;
};
