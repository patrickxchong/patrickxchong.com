const Image = require("@11ty/eleventy-img");
const path = require("path")
const options = {
  widths: [768, 1280, 1920],
  // widths: [600, 900, 1500],
  // widths: [25, 320, 640, 960, 1200, 1800, 2400],
  formats: ["webp", "jpeg"],
  urlPath: "/images/",
  outputDir: "./dist/images/",
  // human readable filename
  filenameFormat: function (id, src, width, format, options) {
    const extension = path.extname(src);
    const name = encodeURIComponent(path.basename(src, extension).replace(/[/\\?%*:|"<>]/g, '-')); // remove invalid filename characters
    return `${name}-${width}w-${id}.${format}`;
  }
};
async function main() {
  const meta = await Image("./src/assets/images/food/Chilli Pan Mee.jpg", options);
  console.log(meta)
}
main();