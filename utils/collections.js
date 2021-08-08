module.exports = {
  post: (collection) => {
    let allPosts = [...collection.getFilteredByGlob('./src/posts/*.md')];
    if (process.env.NODE_ENV !== 'production')
      return allPosts;
    else
      return allPosts.filter((post) => post.data.status === "published");
  },

  // TAGLIST used from the official eleventy-base-blog  https://github.com/11ty/eleventy-base-blog/blob/master/.eleventy.js
  tagList: (collection) => {
    let tagSet = new Set();
    collection.getAll().forEach(item => {
      (item.data.tags || []).forEach(tag => tagSet.add(tag));
    });

    function filterTagList(tags) {
      return (tags || []).filter(tag => ["all", "authors", "pages", "post"].indexOf(tag) === -1);
    }
    return filterTagList([...tagSet]);
  }
}