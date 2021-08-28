/**
 * Pass ` | limit(x)` to a Collection loop to limit the number returned
 * Alt = ` | reverse | limit(x)` to return X most recent
 * Took the following filters from
 * @link https://www.youtube.com/watch?v=wV77GwOY22w&feature=share
 */
module.exports = (arr, count = 5) => {
  return arr.slice(0, count);
};