module.exports = (authors, key) => {
  let author = authors.filter((a) => a.slug === key)[0];
  return author;
}