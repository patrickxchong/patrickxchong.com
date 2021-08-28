const sass = require('sass');

module.exports = (code) => {
  const result = sass.renderSync({
    data: code,
    outputStyle: "compressed"
  });
  return result.css.toString();
};
