
const slugify = require('slugify');
/**
 * Universal slug filter strips unsafe chars from URLs
 */
module.exports = (string) => {
  return slugify(string, {
    lower: true,
    replacement: '-',
    remove: /[*+~.·,()'"`´%!?¿:@]/g,
  });
};