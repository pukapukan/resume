// This script creates pixelated versions of SVG files in the projects folder
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

// Get current file directory (ES modules don't have __dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourceDir = path.join(__dirname, '../client/public/assets/projects');
const targetDir = path.join(__dirname, '../client/public/assets/projects/pixel');

// Ensure target directory exists
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Process each SVG file
async function processImages() {
  const files = fs.readdirSync(sourceDir);
  const svgFiles = files.filter(file => file.endsWith('.svg'));

  console.log(`Found ${svgFiles.length} SVG files to process.`);

  for (const file of svgFiles) {
    try {
      const inputPath = path.join(sourceDir, file);
      const outputPath = path.join(targetDir, file.replace('.svg', '.png'));
      
      console.log(`Converting ${file} to pixel art...`);
      
      // Step 1: Convert SVG to small PNG (creates pixelation)
      await sharp(inputPath)
        .resize(32, 32, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .toFile(outputPath);
      
      // Step 2: Scale up the pixelated image to create the pixel art effect
      await sharp(outputPath)
        .resize(256, 256, { 
          fit: 'contain', 
          background: { r: 0, g: 0, b: 0, alpha: 0 },
          kernel: 'nearest' // Use nearest neighbor for pixelated look
        })
        .toFile(outputPath.replace('.png', '-large.png'));
      
      console.log(`Created pixel art version for ${file}`);
    } catch (error) {
      console.error(`Error processing ${file}:`, error);
    }
  }
}

processImages()
  .then(() => console.log('All images processed successfully!'))
  .catch(err => console.error('Error processing images:', err));