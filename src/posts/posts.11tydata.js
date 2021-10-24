module.exports = {
  layout: "layouts/post",
  permalink: "/{{ title | slugify }}/index.html",
  author: "{{ meta.author }}",
  eleventyComputed: {
    tags: data => {
      if (data.env.IS_DEV) {
        return ["post", data.status, ...data.tags];
      } else {
        return ["post", ...data.tags];
      }
    },
  }
};