module.exports = (collection) => {
  let allPosts = [...collection.getFilteredByGlob('./src/posts/*.md')];
  if (process.env.NODE_ENV !== 'production')
    return allPosts;
  else
    return allPosts.filter((post) => post.data.status === "published");
}