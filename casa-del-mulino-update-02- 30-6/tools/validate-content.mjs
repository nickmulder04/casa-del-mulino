import { readdirSync, readFileSync } from "node:fs";

const files = readdirSync("content")
  .filter((file) => file.endsWith(".json"))
  .map((file) => `content/${file}`)
  .sort();

for (const file of files) {
  JSON.parse(readFileSync(file, "utf8"));
}

console.log(`Validated ${files.length} CMS content files.`);
