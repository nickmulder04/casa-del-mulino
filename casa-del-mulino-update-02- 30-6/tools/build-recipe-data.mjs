import { readFileSync, writeFileSync } from "node:fs";

const source = JSON.parse(readFileSync("content/recipes.json", "utf8"));
const recipes = Array.isArray(source.items) ? source.items : [];

writeFileSync(
  "assets/js/recipe-data.js",
  `window.CDM_RECIPES = ${JSON.stringify(recipes, null, 2)};\n`
);

console.log(`Generated fallback data for ${recipes.length} recipes.`);
