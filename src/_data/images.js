const fg = require('fast-glob');
const path = require('path');
const exifr = require('exifr');

async function getCookingImages() {
  const imageFilenames = await fg('src/assets/images/cooking/**.{jpg,png,gif}');
  const images = await Promise.all(imageFilenames.map(async filename => {
    let fileObj = path.parse(filename);
    let imgData = await exifr.parse(filename, { iptc: true });
    return {
      title: imgData?.Headline || fileObj.name,
      url: filename.slice(3) // remove leading 'src'
    };
  }));
  return images;
}

async function getImages() {
  let images = {};
  images.cooking = await getCookingImages();
  return images;
}

module.exports = getImages;