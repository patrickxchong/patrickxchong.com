const util = require('util');
// {{ something | debug | safe }}
// alternative nunjucks filter: {{ something | dump | safe }}
module.exports = (content) => util.inspect(content);