// References:
// https://mahmoudashraf.dev/blog/how-to-optimize-and-lazyloading-images-on-eleventy/
// https://www.brycewray.com/posts/2021/04/using-eleventys-official-image-plugin/
// https://www.11ty.dev/docs/plugins/image/#synchronous-usage
// https://gist.github.com/Alexs7zzh/d92ae991ad05ed585d072074ea527b5c
const Image = require("@11ty/eleventy-img");
const sharp = require("sharp");
const path = require('path');
const { parseHTML } = require('linkedom');

module.exports = async (content, outputPath) => {
  if (
    process.env.NODE_ENV !== 'production'
    || !outputPath
    || !outputPath.endsWith('.html')) {
    return content;
  }
  // process images from html files in production

  let { document } = parseHTML(content);

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
      const name = path.basename(src, extension).replace(/[/\\?%*:|"<>]/g, '-'); // remove invalid filename characters
      return `${name}-${width}w.${format}`;
    }
  };

  // When screen > 768px, set width to 33.3vw, else it's 100vw 
  let defaultSizes = "(min-width: 768px) 33.3vw, 100vw";
  // let sizes = "33.3vw";
  // let sizes = "(min-width: 1024px) 1024px, 100vw";
  // sizes="(max-width: 640px) 100%, 100%"
  // sizes = "100vw"

  const images = [...document.querySelectorAll('img')];

  await Promise.all(images.map(async (i, index) => {

    let src = i.getAttribute('src');
    let sizes = i.getAttribute('data-sizes') || defaultSizes;

    // regex to test if src is from an external URL -> "//"
    // returns null if not external
    if (!src.match(/.*\/\/.*/)) {
      src = './src' + src; // append /src directory
    }

    const meta = await Image(src, options);
    const last = meta.jpeg[meta.jpeg.length - 1];
    if (last.width < 500) return;

    i.setAttribute('width', last.width);
    i.setAttribute('height', last.height);
    if (index !== 0) {
      i.setAttribute('loading', 'lazy');
      i.setAttribute('decoding', 'async');
    }

    // put webp before jpeg so that webp would be evaluated first
    i.outerHTML = `
      <picture>
        <source type="image/webp" sizes="${sizes}" srcset="${meta.webp.map(p => p.srcset).join(', ')}">
        <source type="image/jpeg" sizes="${sizes}" srcset="${meta.jpeg.map(p => p.srcset).join(', ')}">
        ${i.outerHTML}
      </picture>`;
  }));

  return `<!DOCTYPE html>${document.documentElement.outerHTML}`;

};