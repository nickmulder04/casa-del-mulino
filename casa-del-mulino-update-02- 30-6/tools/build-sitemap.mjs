import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { extname, join, relative } from "node:path";

const siteUrl = "https://casadelmulino.nl";
const skipFiles = new Set(["404.html"]);
const urls = new Set();

function addHtmlFiles(directory = ".") {
  for (const entry of readdirSync(directory)) {
    if (entry.startsWith(".") || ["assets", "admin", "content", "tools", "netlify-upload", "node_modules"].includes(entry)) {
      continue;
    }

    const fullPath = join(directory, entry);
    const stats = statSync(fullPath);

    if (stats.isDirectory()) {
      addHtmlFiles(fullPath);
      continue;
    }

    if (extname(entry) !== ".html" || skipFiles.has(entry)) {
      continue;
    }

    const route = relative(".", fullPath).replaceAll("\\", "/").replace(/index\.html$/, "");
    urls.add(route === "" ? "/" : `/${route}`);
  }
}

function addCmsPages() {
  try {
    const content = JSON.parse(readFileSync("content/pages.json", "utf8"));
    const pages = content.items || content.pages || [];
    for (const page of pages) {
      if (page?.slug) {
        urls.add(`/${page.slug.replace(/^\/+/, "").replace(/\.html$/, "")}.html`);
      }
    }
  } catch {
    // The static HTML crawl is enough when optional CMS pages are absent.
  }
}

addHtmlFiles(".");
addCmsPages();

const body = [...urls]
  .sort((a, b) => a.localeCompare(b))
  .map((path) => {
    const loc = `${siteUrl}${path === "/" ? "/" : path}`;
    return `  <url>\n    <loc>${loc}</loc>\n  </url>`;
  })
  .join("\n");

writeFileSync(
  "sitemap.xml",
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`
);

console.log(`Generated sitemap.xml with ${urls.size} URLs.`);
