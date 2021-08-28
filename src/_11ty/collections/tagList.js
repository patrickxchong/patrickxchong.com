// TAGLIST used from the official eleventy-base-blog  https://github.com/11ty/eleventy-base-blog/blob/master/.eleventy.js
module.exports = (collection) => {
  let tagSet = new Set();
  collection.getAll().forEach(item => {
    (item.data.tags || []).forEach(tag => tagSet.add(tag));
  });

  function filterTagList(tags) {
    return (tags || []).filter(tag => ["all", "authors", "pages", "post"].indexOf(tag) === -1);
  }
  return filterTagList([...tagSet]);
};