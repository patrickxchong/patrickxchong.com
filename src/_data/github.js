const Cache = require("@11ty/eleventy-cache-assets");

module.exports = async function () {
  try {
    // https://developer.github.com/v3/repos/#get
    let user = await Cache("https://api.github.com/users/patrickxchong", {
      duration: "1d", // 1 day
      type: "json" // also supports "text" or "buffer"
    });
    let repos = await Cache("https://api.github.com/users/patrickxchong/repos", {
      duration: "1d", // 1 day
      type: "json" // also supports "text" or "buffer"
    });

    let github = {};
    github.user = user;
    github.repo = {};
    repos.forEach(element => {
      github.repo[element.name] = element;
    });
    return github;

  } catch (e) {
    console.error("Failed querying Github API");
    console.error(e);
    return {};
  }
};