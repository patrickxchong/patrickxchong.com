const svgsprite = require('./svgsprite');

module.exports = async () => {
  // Prerun svgsprite script so that addNunjucksAsyncShortcode 
  // won't run it once for every page 
  await svgsprite();
};