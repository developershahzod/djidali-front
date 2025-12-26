import { readdir, readFile, writeFile } from "fs/promises";
import { join, extname } from "path";

const SRC_DIR = "./src";

// Images to keep as original (placeholders, logos that need transparency, etc.)
const KEEP_ORIGINAL = [
  "loho_white_png.png", // Logo - keep PNG for transparency
  "placeholder-tour.jpg",
  "tour-placeholder.jpg",
  "images/tour-complete.jpg",
];

async function getAllFiles(dir) {
  const files = [];
  const items = await readdir(dir, { withFileTypes: true });

  for (const item of items) {
    const fullPath = join(dir, item.name);
    if (item.isDirectory()) {
      files.push(...(await getAllFiles(fullPath)));
    } else if (/\.(tsx?|jsx?)$/.test(item.name)) {
      files.push(fullPath);
    }
  }
  return files;
}

async function updateImageReferences() {
  console.log("🔄 Updating image references to WebP...\n");

  const files = await getAllFiles(SRC_DIR);
  let totalUpdates = 0;

  for (const file of files) {
    let content = await readFile(file, "utf-8");
    let updated = false;

    // Replace .jpg and .png with .webp, but skip certain files
    const newContent = content.replace(
      /["']([^"']*?)(\.jpg|\.png)["']/g,
      (match, path, ext) => {
        // Check if this should be kept as original
        const shouldKeep = KEEP_ORIGINAL.some((keep) =>
          path.includes(keep.replace(ext, "")),
        );
        if (shouldKeep) {
          return match;
        }

        // Skip external URLs
        if (path.startsWith("http")) {
          return match;
        }

        updated = true;
        const quote = match[0];
        return `${quote}${path}.webp${quote}`;
      },
    );

    if (updated && newContent !== content) {
      await writeFile(file, newContent, "utf-8");
      console.log(`✅ Updated: ${file}`);
      totalUpdates++;
    }
  }

  console.log(`\n📊 Updated ${totalUpdates} files`);
}

updateImageReferences().catch(console.error);
