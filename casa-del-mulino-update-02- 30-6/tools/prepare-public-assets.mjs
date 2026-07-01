import { copyFileSync, cpSync, existsSync, mkdirSync, readdirSync, rmSync } from "node:fs";
import { join } from "node:path";

const source = "public/images";
const target = "images";
const legacySource = "assets/images";

mkdirSync(source, { recursive: true });

if (existsSync(legacySource)) {
  for (const file of readdirSync(legacySource)) {
    const targetFile = join(source, file);
    if (!existsSync(targetFile)) {
      copyFileSync(join(legacySource, file), targetFile);
    }
  }
}

if (existsSync(target)) {
  rmSync(target, { recursive: true, force: true });
}

cpSync(source, target, { recursive: true });

console.log("Prepared /images from public/images.");
