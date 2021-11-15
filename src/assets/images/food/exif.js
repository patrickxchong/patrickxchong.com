
const exifr = require('exifr');
const fs = require('fs');
exifr.parse('Dakgalbi1.jpg', { iptc: true })
  .then(output => console.log(output));;
// console.log(fs.readFile('./Ribs.jpg'))

// fs.promises.readFile('./Ribs.jpg')
//   .then(exifr.parse)
//   .then(output => console.log(output));