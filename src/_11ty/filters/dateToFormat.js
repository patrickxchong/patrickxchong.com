const { DateTime } = require('luxon');

/**
 * dateToFormat allows specifiying display format at point of use.
 * Example in footer: {{ env.BUILD_TIMESTAMP | dateToFormat('yyyy') }} uses .timestamp
 *  from the _data/env.js export and formats it via dateToFormat.
 * Another usage example used in layouts: {{ post.date | dateToFormat("LLL dd, yyyy") }}
 * And finally, example used in /src/posts/posts.json to format the permalink
 *  when working with old /yyyy/MM/dd/slug format from Wordpress exports
 */
module.exports = (date, format) => {
  // replace default date with current build date
  if (!date || date.getFullYear() == 1970) {
    date = new Date();
  }
  return DateTime.fromJSDate(date, {
    zone: 'utc',
  }).toFormat(String(format));
};