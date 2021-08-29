module.exports = {
  permalink: (data) => {
    if (process.env.NODE_ENV !== "production") return data.permalink;
    else return data.status === "published" ? data.permalink : false;
  },
};