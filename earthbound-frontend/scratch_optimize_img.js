const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, 'src', 'assets', 'outdoorhero.webp');
const outputPath = path.join(__dirname, 'src', 'assets', 'outdoorhero_opt.webp');

sharp(inputPath)
  .resize(1200) // Resize to a reasonable max width for hero (currently it might be too large)
  .webp({ quality: 60, effort: 6 }) // Increase compression, effort 6 is maximum compression efficiency for WebP
  .toFile(outputPath)
  .then(info => {
    console.log(`Successfully optimized image: ${JSON.stringify(info)}`);
    // Replace original image with optimized one
    fs.renameSync(outputPath, inputPath);
    console.log('Original image overwritten with optimized version.');
  })
  .catch(err => {
    console.error(`Error optimizing image: ${err}`);
  });
