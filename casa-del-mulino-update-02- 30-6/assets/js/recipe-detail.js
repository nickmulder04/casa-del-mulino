const recipeBase = new URL("../../", document.currentScript.src).href;
const rootPath = (path) => new URL(path.replace(/^\/+/, ""), recipeBase).href;
const currentSlug = document.body.dataset.recipe;
const recipeRoot = document.querySelector("[data-recipe-detail]");

const loadRecipeItems = async () => {
  try {
    const response = await fetch(rootPath("content/recipes.json"), { cache: "no-store" });
    if (!response.ok) throw new Error("Recipe content missing");
    const data = await response.json();
    return data.items || [];
  } catch (error) {
    return window.CDM_RECIPES || [];
  }
};

const listHtml = (items = []) => items.map((item) => `<li>${item}</li>`).join("");

const renderSchema = (recipe) => {
  const schema = document.createElement("script");
  schema.type = "application/ld+json";
  schema.textContent = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Recipe",
    name: recipe.title,
    description: recipe.summary,
    image: rootPath(recipe.image),
    recipeCategory: recipe.categories?.join(", "),
    recipeIngredient: recipe.ingredients,
    recipeInstructions: recipe.steps?.map((step) => ({ "@type": "HowToStep", text: step })),
    prepTime: recipe.time,
    recipeYield: recipe.servings,
    author: {
      "@type": "Organization",
      name: "Casa del Mulino"
    }
  });
  document.head.appendChild(schema);
};

const renderRecipe = (recipes) => {
  const recipe = recipes.find((item) => item.slug === currentSlug);
  if (!recipeRoot || !recipe) {
    if (recipeRoot) {
      recipeRoot.innerHTML = `<section class="section text-page"><h1>Recept niet gevonden</h1><p>Dit recept is niet beschikbaar.</p><a class="button primary" href="${rootPath("recepten.html")}">Terug naar recepten</a></section>`;
    }
    return;
  }

  document.title = recipe.seoTitle || `${recipe.title} | Casa del Mulino`;
  document.querySelector("meta[name='description']")?.setAttribute("content", recipe.seoDescription || recipe.summary);
  document.querySelector("meta[property='og:title']")?.setAttribute("content", recipe.seoTitle || recipe.title);
  document.querySelector("meta[property='og:description']")?.setAttribute("content", recipe.seoDescription || recipe.summary);
  document.querySelector("meta[property='og:image']")?.setAttribute("content", rootPath(recipe.image));
  document.querySelector("link[rel='canonical']")?.setAttribute("href", `https://casadelmulino.nl/recepten/${recipe.slug}.html`);

  const related = recipes
    .filter((item) => item.slug !== recipe.slug && (item.flavor === recipe.flavor || item.categories?.some((category) => recipe.categories?.includes(category))))
    .slice(0, 4);

  recipeRoot.innerHTML = `
    <section class="recipe-detail-hero">
      <div>
        <p class="eyebrow">${recipe.flavor}</p>
        <h1>${recipe.title}</h1>
        <p>${recipe.summary}</p>
        <div class="recipe-meta">
          <span><strong>Bereidingstijd</strong>${recipe.time}</span>
          <span><strong>Porties</strong>${recipe.servings}</span>
          <span><strong>Moeilijkheid</strong>${recipe.difficulty}</span>
          <span><strong>Likeur</strong>${recipe.flavor}</span>
        </div>
      </div>
      <img src="${rootPath(recipe.image)}" alt="${recipe.title}">
    </section>
    <section class="section recipe-detail-layout">
      <aside class="recipe-ingredients reveal">
        <p class="eyebrow">Ingrediënten</p>
        <h2>Voor ${recipe.servings}</h2>
        <ul>${listHtml(recipe.ingredients)}</ul>
      </aside>
      <article class="recipe-method reveal">
        <p class="eyebrow">Bereiding</p>
        <h2>Stap voor stap</h2>
        <ol>${listHtml(recipe.steps)}</ol>
        <div class="recipe-tip-box">
          <h3>Tips van Casa del Mulino</h3>
          <ul>${listHtml(recipe.tips)}</ul>
        </div>
      </article>
    </section>
    <section class="section recommended-product">
      <div class="section-copy reveal">
        <p class="eyebrow">Aanbevolen</p>
        <h2>Casa del Mulino ${recipe.flavor}</h2>
        <p>${recipe.serveAdvice}</p>
        <a class="button primary" href="${rootPath(recipe.productUrl)}">Bekijk product</a>
      </div>
    </section>
    <section class="section related-recipes">
      <div class="section-copy reveal">
        <p class="eyebrow">Verder ontdekken</p>
        <h2>Misschien vind je dit ook lekker</h2>
      </div>
      <div class="recipe-overview-grid compact">
        ${related.map((item) => `
          <article class="recipe-overview-card reveal">
            <a href="${rootPath(`recepten/${item.slug}.html`)}">
              <img src="${rootPath(item.image)}" alt="${item.title}" loading="lazy">
              <div>
                <span class="recipe-mark">${item.flavor}</span>
                <h3>${item.title}</h3>
                <p>${item.summary}</p>
                <strong>Bekijk recept â†’</strong>
              </div>
            </a>
          </article>
        `).join("")}
      </div>
    </section>
  `;
  renderSchema(recipe);
};

loadRecipeItems().then(renderRecipe);

