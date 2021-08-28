const { extname } = require('path');

module.exports = (inputPath) => {
  return extname(inputPath);
};