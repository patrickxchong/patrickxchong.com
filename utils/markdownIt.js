const markdownIt = require('markdown-it');

let options = {
  html: true,
  breaks: true,
  linkify: true,
  typographer: true,
};

module.exports = markdownIt(options)
  .use(require('markdown-it-emoji'))
  .use(require("markdown-it-link-attributes"), {
    pattern: /^https?:\/\//,
    attrs: {
      target: '_blank',
      rel: 'noopener noreferrer',
    },
  })
  .use(require('markdown-it-anchor'), {
    permalink: true,
    permalinkSymbol: '#',
    level: 2,
    tabIndex: false
  })
  .use(require('markdown-it-toc-done-right'));