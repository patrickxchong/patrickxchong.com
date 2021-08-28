let markdownIt = require("../../../utils/markdownIt");

module.exports = (content, classes = "") => {
  if (!content) return "";

  return `
  <link rel="stylesheet" href="/assets/css/markdown.css"/>
  <div class="markdown ${classes}">
    ${markdownIt.render(content)}
  </div>`;
};