const recipeFallback = window.CDM_RECIPES || [
  {
    title: "Limoncello Spritz",
    slug: "limoncello-spritz",
    summary: "Een frisse Italiaanse klassieker met Casa del Mulino Limoncello.",
    image: "assets/images/limoncello-spritz-service.jpg",
    flavor: "Limoncello",
    categories: ["Cocktails", "Borrel", "Limoncello"],
    time: "5 minuten",
    difficulty: "Eenvoudig",
    servings: "1 glas"
  }
];

const recipeUrl = (recipe) => `recepten/${recipe.slug}.html`;
const recipeDataUrl = "content/recipes.json";

const loadRecipes = async () => {
  try {
    const response = await fetch(recipeDataUrl, { cache: "no-store" });
    if (!response.ok) throw new Error("No recipe CMS content");
    const data = await response.json();
    return data.items?.length ? data.items : recipeFallback;
  } catch (error) {
    return recipeFallback;
  }
};

const renderRecipeLibrary = (recipes) => {
  const grid = document.querySelector("[data-recipe-grid]");
  const search = document.querySelector("[data-recipe-search]");
  const filters = document.querySelectorAll("[data-recipe-filter]");
  if (!grid) return;

  let activeFilter = "Alle recepten";

  const matches = (recipe, query) => {
    const haystack = `${recipe.title} ${recipe.summary} ${recipe.flavor} ${(recipe.categories || []).join(" ")}`.toLowerCase();
    const filterMatch = activeFilter === "Alle recepten" || recipe.flavor === activeFilter || recipe.categories?.includes(activeFilter);
    return filterMatch && haystack.includes(query.toLowerCase());
  };

  const render = () => {
    const query = search?.value.trim() || "";
    const items = recipes.filter((recipe) => matches(recipe, query));
    grid.innerHTML = items.length ? items.map((recipe) => `
      <article class="recipe-overview-card reveal">
        <a href="${recipeUrl(recipe)}" aria-label="Bekijk recept ${recipe.title}">
          <img src="${recipe.image}" alt="${recipe.title}" loading="lazy">
          <div>
            <span class="recipe-mark">${recipe.flavor}</span>
            <h3>${recipe.title}</h3>
            <p>${recipe.summary}</p>
            <small>${recipe.time || ""} · ${recipe.difficulty || ""} · ${recipe.servings || ""}</small>
            <strong>Bekijk recept →</strong>
          </div>
        </a>
      </article>
    `).join("") : `<p class="recipe-empty">Geen recepten gevonden. Pas de zoekterm of filter aan.</p>`;
  };

  filters.forEach((button) => {
    button.addEventListener("click", () => {
      activeFilter = button.dataset.recipeFilter;
      filters.forEach((item) => item.classList.toggle("active", item === button));
      render();
    });
  });
  search?.addEventListener("input", render);
  render();
};

loadRecipes().then(renderRecipeLibrary);
