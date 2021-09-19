module.exports = (collection) => {
  let allPosts = [...collection.getFilteredByGlob('./src/posts/*.md')].sort((a, b) => {
    aDate = a.data.updatedAt || a.date;
    bDate = b.data.updatedAt || b.date;
    return bDate - aDate;

  });
  if (process.env.NODE_ENV !== 'production')
    return allPosts;
  else
    return allPosts.filter((post) => post.data.status === "published");
}