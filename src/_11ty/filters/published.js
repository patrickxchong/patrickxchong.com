module.exports = (arr) => {
  return arr.filter((post) => post.data && post.data.status == "published");
}