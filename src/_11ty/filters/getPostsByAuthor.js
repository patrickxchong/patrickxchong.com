module.exports = (posts, key) => {
  return posts.filter((a) => a.data.author === key);
}