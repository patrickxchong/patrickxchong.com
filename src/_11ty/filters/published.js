require('dotenv').config();

module.exports = (arr) => {
  if (process.env.NODE_ENV === "development") {
    return arr;
  } else {
    return arr.filter((post) => post.data && post.data.status == "published");
  }
};