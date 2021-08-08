// References:
// https://mahmoudashraf.dev/blog/how-to-optimize-and-lazyloading-images-on-eleventy/
// https://www.brycewray.com/posts/2021/04/using-eleventys-official-image-plugin/
// https://www.11ty.dev/docs/plugins/image/#synchronous-usage
const Image = require("@11ty/eleventy-img");
const sharp = require("sharp");
const path = require('path');

module.exports = (src, alt, cls = "") => {
  if (!alt) {
    throw new Error(`Missing \`alt\` on myImage from: ${src}`);
  }
  let options = {
    // widths: [25, 320, 640, 960, 1200, 1800, 2400],
    widths: [600, 900, 1500],
    formats: ["jpeg", "webp"],
    urlPath: "/images/",
    outputDir: "./dist/images/",
    /* =====
    Now we'll make sure each resulting file's name will 
    make sense to you. **This** is why you need 
    that `path` statement mentioned earlier.
    ===== */
    filenameFormat: function (id, src, width, format, options) {
      const extension = path.extname(src);
      const name = path.basename(src, extension);
      return `${name}-${width}w.${format}`;
    }
  };

  Image(`./src${src}`, options);

  let metadata = Image.statsSync(`./src${src}`, options);

  let lowestSrc = metadata["jpeg"][0];
  let sizes = "(min-width: 1024px) 1024px, 100vw";

  // const placeholder = await sharp(lowestSrc.outputPath)
  //   .resize({ fit: sharp.fit.inside })
  //   .blur()
  //   .toBuffer();

  // const base64Placeholder = `data:image/png;base64,${placeholder.toString(
  //   "base64"
  // )}`;

  const source = Object.values(metadata).map(imageFormat => {
    return `  <source type="${imageFormat[0].sourceType}" srcset="${imageFormat.map(entry => entry.srcset).join(", ")}" sizes="${sizes}">`;
  }).join("\n");

  // src="${base64Placeholder}"
  const img = `<img
    class="${cls}"
    alt="${alt}"
    src="${lowestSrc.url}"
    width="${lowestSrc.width}"
    height="${lowestSrc.height}"
    loading="lazy"
    decoding="async">`;

  return `<picture class="${cls}"> ${source} ${img} </picture>`;
};