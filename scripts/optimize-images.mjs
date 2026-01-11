import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

const PUBLIC_DIR = path.join(process.cwd(), 'public');
const TEMP_DIR = path.join(process.cwd(), '.temp-images');

// HIGH QUALITY Configuration - minimal quality loss
const CONFIG = {
  // Keep original dimensions - only resize if extremely large (4K+)
  maxWidth: 3840,  // 4K max
  maxHeight: 2160,

  // HIGH quality WebP - near lossless
  webpQuality: 95,

  // Size threshold - skip if already small
  minSizeToOptimize: 300 * 1024, // 300KB
};

async function getImageFiles(dir) {
  const files = await fs.readdir(dir);
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp'];

  return files.filter(file => {
    const ext = path.extname(file).toLowerCase();
    return imageExtensions.includes(ext);
  });
}

async function optimizeImage(filePath) {
  const stats = await fs.stat(filePath);
  const filename = path.basename(filePath);
  const ext = path.extname(filePath).toLowerCase();

  // Skip if already small
  if (stats.size < CONFIG.minSizeToOptimize) {
    console.log(`  ⏭️  Skipping (already small): ${filename}`);
    return { skipped: true, originalSize: stats.size };
  }

  try {
    // For existing WebP files, use temp file approach
    const isWebp = ext === '.webp';
    const tempPath = path.join(TEMP_DIR, `temp_${Date.now()}_${filename}`);
    const outputPath = filePath.replace(/\.(jpg|jpeg|png)$/i, '.webp');

    let pipeline = sharp(filePath)
      .resize(CONFIG.maxWidth, CONFIG.maxHeight, {
        fit: 'inside',
        withoutEnlargement: true,
      });

    if (isWebp) {
      // For WebP files, write to temp first, then replace
      await pipeline
        .webp({ quality: CONFIG.webpQuality, effort: 6 })
        .toFile(tempPath);

      // Replace original with optimized
      await fs.unlink(filePath);
      await fs.rename(tempPath, filePath);

      const newStats = await fs.stat(filePath);
      const savings = ((stats.size - newStats.size) / stats.size * 100).toFixed(1);

      if (newStats.size < stats.size) {
        console.log(`  ✅ ${filename}: ${formatSize(stats.size)} → ${formatSize(newStats.size)} (-${savings}%)`);
      } else {
        console.log(`  ⚠️  ${filename}: No size reduction (kept original quality)`);
      }

      return {
        skipped: false,
        originalSize: stats.size,
        newSize: newStats.size,
      };
    } else {
      // For JPG/PNG, convert to WebP
      await pipeline
        .webp({ quality: CONFIG.webpQuality, effort: 6 })
        .toFile(outputPath);

      const newStats = await fs.stat(outputPath);
      const savings = ((stats.size - newStats.size) / stats.size * 100).toFixed(1);

      console.log(`  ✅ ${filename} → ${path.basename(outputPath)}: ${formatSize(stats.size)} → ${formatSize(newStats.size)} (-${savings}%)`);

      // Remove original JPG/PNG
      await fs.unlink(filePath);

      return {
        skipped: false,
        originalSize: stats.size,
        newSize: newStats.size,
        renamed: { from: filename, to: path.basename(outputPath) },
      };
    }
  } catch (error) {
    console.error(`  ❌ Error: ${filename}: ${error.message}`);
    return { error: true, originalSize: stats.size };
  }
}

function formatSize(bytes) {
  if (bytes < 1024) return bytes + 'B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + 'KB';
  return (bytes / 1024 / 1024).toFixed(1) + 'MB';
}

async function main() {
  console.log('🖼️  High-Quality Image Optimization\n');
  console.log('📁 Source:', PUBLIC_DIR);
  console.log('⚙️  Quality: 95 (near-lossless)');
  console.log('📐 Max size: 3840x2160 (4K)');
  console.log('');

  // Create temp directory
  try {
    await fs.mkdir(TEMP_DIR, { recursive: true });
  } catch (e) {}

  const imageFiles = await getImageFiles(PUBLIC_DIR);
  console.log(`Found ${imageFiles.length} images to process\n`);

  let totalOriginal = 0;
  let totalNew = 0;
  let processed = 0;
  let skipped = 0;
  let errors = 0;
  const renamedFiles = [];

  for (const file of imageFiles) {
    const filePath = path.join(PUBLIC_DIR, file);
    const result = await optimizeImage(filePath);

    totalOriginal += result.originalSize || 0;

    if (result.skipped) {
      skipped++;
      totalNew += result.originalSize || 0;
    } else if (result.error) {
      errors++;
      totalNew += result.originalSize || 0;
    } else {
      processed++;
      totalNew += result.newSize || 0;
      if (result.renamed) {
        renamedFiles.push(result.renamed);
      }
    }
  }

  // Cleanup temp directory
  try {
    await fs.rm(TEMP_DIR, { recursive: true });
  } catch (e) {}

  console.log('\n' + '='.repeat(50));
  console.log('📊 Summary:');
  console.log(`   Processed: ${processed}`);
  console.log(`   Skipped (already small): ${skipped}`);
  console.log(`   Errors: ${errors}`);
  console.log(`   Original size: ${formatSize(totalOriginal)}`);
  console.log(`   New size: ${formatSize(totalNew)}`);
  console.log(`   Saved: ${formatSize(totalOriginal - totalNew)} (${((totalOriginal - totalNew) / totalOriginal * 100).toFixed(1)}%)`);

  if (renamedFiles.length > 0) {
    console.log('\n⚠️  Files converted to WebP (update code references):');
    renamedFiles.forEach(f => {
      console.log(`   ${f.from} → ${f.to}`);
    });
  }

  console.log('\n✅ Done!');
}

main().catch(console.error);
