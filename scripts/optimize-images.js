import sharp from "sharp";
import { readdir, stat, mkdir } from "fs/promises";
import { join, extname, basename } from "path";

const PUBLIC_DIR = "./public";
const BACKUP_DIR = "./public/originals";
const MAX_WIDTH = 1920;
const WEBP_QUALITY = 85;

async function optimizeImages() {
  console.log("🖼️  Starting image optimization...\n");

  // Create backup directory
  try {
    await mkdir(BACKUP_DIR, { recursive: true });
  } catch (e) {
    // Directory exists
  }

  const files = await readdir(PUBLIC_DIR);
  const imageFiles = files.filter(
    (f) => /\.(jpg|jpeg|png)$/i.test(f) && !f.includes("originals"),
  );

  let totalOriginalSize = 0;
  let totalOptimizedSize = 0;
  let processed = 0;

  for (const file of imageFiles) {
    const inputPath = join(PUBLIC_DIR, file);
    const fileStats = await stat(inputPath);

    // Skip directories
    if (fileStats.isDirectory()) continue;

    const originalSize = fileStats.size;
    totalOriginalSize += originalSize;

    const name = basename(file, extname(file));
    const outputPath = join(PUBLIC_DIR, `${name}.webp`);

    try {
      // Get image metadata
      const metadata = await sharp(inputPath).metadata();

      // Resize if wider than MAX_WIDTH, convert to WebP
      let pipeline = sharp(inputPath);

      if (metadata.width && metadata.width > MAX_WIDTH) {
        pipeline = pipeline.resize(MAX_WIDTH, null, {
          withoutEnlargement: true,
          fit: "inside",
        });
      }

      await pipeline.webp({ quality: WEBP_QUALITY }).toFile(outputPath);

      const newStats = await stat(outputPath);
      totalOptimizedSize += newStats.size;

      const savings = (
        ((originalSize - newStats.size) / originalSize) *
        100
      ).toFixed(1);
      console.log(`✅ ${file} → ${name}.webp`);
      console.log(
        `   ${(originalSize / 1024 / 1024).toFixed(2)}MB → ${(newStats.size / 1024 / 1024).toFixed(2)}MB (${savings}% smaller)\n`,
      );

      processed++;
    } catch (err) {
      console.error(`❌ Error processing ${file}:`, err.message);
    }
  }

  console.log("\n📊 Summary:");
  console.log(`   Processed: ${processed} images`);
  console.log(
    `   Original total: ${(totalOriginalSize / 1024 / 1024).toFixed(2)}MB`,
  );
  console.log(
    `   Optimized total: ${(totalOptimizedSize / 1024 / 1024).toFixed(2)}MB`,
  );
  console.log(
    `   Total savings: ${((totalOriginalSize - totalOptimizedSize) / 1024 / 1024).toFixed(2)}MB`,
  );
  console.log(
    `   Reduction: ${(((totalOriginalSize - totalOptimizedSize) / totalOriginalSize) * 100).toFixed(1)}%`,
  );
  console.log(
    "\n⚠️  Remember to update image references in your code from .jpg/.png to .webp",
  );
}

optimizeImages().catch(console.error);
