const htmlmin = require('html-minifier');

module.exports = {
  htmlmin: function (content, outputPath) {
    // returned minified content from html files in production
    if (process.env.NODE_ENV === 'production'
      && outputPath
      && outputPath.endsWith('.html')) {

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
    } else {
      // no transformation
      return content;
    }
  },
};
