module.exports = (tags) => {
  return (tags || []).filter(tag => ["all", "authors", "pages", "post"].indexOf(tag) === -1);
}