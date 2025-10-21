import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const publicDir = path.join(__dirname, 'public');

// Get all PNG and JPG files
const imageExtensions = ['.png', '.jpg', '.jpeg'];
const files = fs.readdirSync(publicDir).filter(file => {
  const ext = path.extname(file).toLowerCase();
  return imageExtensions.includes(ext);
});

console.log(`Found ${files.length} images to convert\n`);

async function convertToWebP() {
  let converted = 0;
  let errors = 0;

  for (const file of files) {
    const inputPath = path.join(publicDir, file);
    const outputPath = path.join(publicDir, file.replace(/\.(png|jpg|jpeg)$/i, '.webp'));

    try {
      const inputStats = fs.statSync(inputPath);
      await sharp(inputPath)
        .webp({ quality: 90 })
        .toFile(outputPath);

      const outputStats = fs.statSync(outputPath);
      const savedPercent = Math.round((1 - outputStats.size / inputStats.size) * 100);

      console.log(`✓ ${file} -> ${path.basename(outputPath)}`);
      console.log(`  Size: ${(inputStats.size / 1024).toFixed(2)}KB -> ${(outputStats.size / 1024).toFixed(2)}KB (saved ${savedPercent}%)\n`);
      converted++;
    } catch (error) {
      console.error(`✗ Error converting ${file}:`, error.message);
      errors++;
    }
  }

  console.log(`\nConversion complete!`);
  console.log(`Converted: ${converted} files`);
  console.log(`Errors: ${errors} files`);

  if (converted > 0) {
    console.log(`\nWebP files have been created. You can now update your code to use .webp extensions.`);
    console.log(`Original files have been kept for backup.`);
  }
}

convertToWebP();
