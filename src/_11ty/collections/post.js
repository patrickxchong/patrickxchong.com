const sortByUpdated = require("../filters/sortByUpdated");

module.exports = (collection) => {
  let allPosts = sortByUpdated([...collection.getFilteredByGlob('./src/posts/*.{md,njk}')]);

  if (process.env.NODE_ENV !== 'production')
    return allPosts;
  else
    return allPosts.filter((post) => post.data.status === "published");
};