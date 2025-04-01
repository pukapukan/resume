import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputPath = path.join(__dirname, '../client/public/assets/earth-dark.svg');
const outputPath = path.join(__dirname, '../client/public/assets/earth-dark.jpg');

// Ensure the output directory exists
const outputDir = path.dirname(outputPath);
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Convert SVG to JPEG
sharp(inputPath)
  .jpeg({
    quality: 90,
    progressive: true,
  })
  .toFile(outputPath)
  .then(info => {
    console.log('Conversion successful!');
    console.log(info);
  })
  .catch(err => {
    console.error('Error converting SVG to JPEG:', err);
  });