const filterTagList = require("./filterTagList");

// TAGLIST used from the official eleventy-base-blog  
// https://github.com/11ty/eleventy-base-blog/blob/master/.eleventy.js
module.exports = (collection) => {
  let tagSet = new Set();
  collection.getAll().forEach(item => {
    (item.data.tags || []).forEach(tag => tagSet.add(tag));
  });
  return filterTagList([...tagSet]);
};