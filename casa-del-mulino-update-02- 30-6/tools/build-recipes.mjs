import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const recipes = JSON.parse(readFileSync("content/recipes.json", "utf8")).items || [];
mkdirSync("recepten", { recursive: true });

const escapeHtml = (value = "") => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;");

const template = (recipe) => `<!doctype html>
<html lang="nl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(recipe.seoTitle || `${recipe.title} | Casa del Mulino`)}</title>
  <meta name="description" content="${escapeHtml(recipe.seoDescription || recipe.summary)}">
  <link rel="canonical" href="https://casadelmulino.nl/recepten/${escapeHtml(recipe.slug)}.html">
  <meta property="og:title" content="${escapeHtml(recipe.seoTitle || recipe.title)}">
  <meta property="og:description" content="${escapeHtml(recipe.seoDescription || recipe.summary)}">
  <meta property="og:image" content="${escapeHtml(recipe.image)}">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" href="/images/favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="../assets/css/styles.css">
</head>
<body data-recipe="${escapeHtml(recipe.slug)}">
  <header class="site-header solid"><a class="brand" href="../index.html"><img src="/images/casa-del-mulino-official-logo.jpg" alt="" class="brand-logo"><span><strong>Casa del Mulino</strong><small>Fatto a Mano</small></span></a><nav class="main-nav visible"><a href="../recepten.html">Recepten</a><a href="../smaken.html">Smaken</a><a href="../bestellen.html">Bestellen</a></nav></header>
  <main data-recipe-detail></main>
  <footer class="site-footer"></footer>
  <script src="../assets/js/main.js" defer></script>
  <script src="../assets/js/cms-page.js" defer></script>
  <script src="../assets/js/shop.js" defer></script>
  <script src="../assets/js/recipe-data.js" defer></script>
  <script src="../assets/js/recipe-detail.js" defer></script>
</body>
</html>
`;

for (const recipe of recipes) {
  if (!recipe.slug) continue;
  writeFileSync(join("recepten", `${recipe.slug}.html`), template(recipe));
}

console.log(`Generated ${recipes.length} recipe pages.`);
