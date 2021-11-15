const fg = require('fast-glob');
const path = require('path');
const exifr = require('exifr');

async function getCookingImages() {

  const imageFilenames = await fg('src/assets/images/food/**.{jpg,png,gif}');
  const images = await Promise.all(imageFilenames.map(async filename => {
    let fileObj = path.parse(filename);
    let imgData = await exifr.parse(filename, { iptc: true });
    return {
      title: imgData?.Headline || fileObj.name,
      url: filename.slice(3) // remove leading 'src'
    };
  }));
  // console.log("getCookingImages");
  // console.log(images);
  return images;
}

module.exports = getCookingImages;