const util = require('util');
// {{ something | debug | safe }}
module.exports = (content) => util.inspect(content);