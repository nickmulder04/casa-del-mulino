const sharedPairings = [
  {
    title: "Vanille-ijs",
    image: "images/limoncello-spritz-service.jpg",
    note: "De romige zachtheid laat citrus en fruit extra helder naar voren komen."
  },
  {
    title: "Tiramisu",
    image: "images/casa-del-mulino-flessen.jpg",
    note: "Een klein glas naast koffie, cacao en mascarpone geeft het dessert meer spanning."
  },
  {
    title: "Vers fruit",
    image: "images/product-collection-three.jpg",
    note: "Serveer ijskoud bij aardbei, meloen of citrus voor een lichte afsluiting."
  },
  {
    title: "Pure chocolade",
    image: "images/product-arancello.jpg",
    note: "Bittere chocolade contrasteert elegant met de natuurlijke zoetheid."
  }
];

const products = {
  limoncello: {
    name: "Casa del Mulino Limoncello",
    short: "Fris, zonnig en intens citroenachtig.",
    image: "images/product-limoncello.jpg",
    gallery: ["images/product-limoncello.jpg", "images/limoncello-fles.jpg", "images/hero-limoncello-citrus-trees.jpg", "images/limoncello-citrus-still-life.jpg"],
    accent: "#d9b72f",
    alcohol: "30% vol",
    size: "500 ml",
    fruit: "Citroen",
    story: "De Limoncello is de signatuur van Casa del Mulino: helder, fris en gemaakt voor het moment na het eten, wanneer de tafel nog vol verhalen ligt.",
    ingredients: ["Citroenschillen", "Alcohol", "Water", "Suiker"],
    process: "Citroenen worden zorgvuldig geselecteerd en met de hand geschild. Alleen het geurige gele deel gaat wekenlang op alcohol, waarna de infusie wordt gefilterd, gemengd en rustig gebotteld.",
    serve: "Serveer ijskoud in een klein glas of gebruik hem als frisse basis voor een spritz.",
    pairings: [
      ...sharedPairings,
      {
        title: "Citroentaart",
        image: "images/limoncello-zests-board.jpg",
        note: "Een toon-op-toon combinatie voor wie het frisse karakter wil versterken."
      }
    ],
    recipes: [
      {
        title: "Limoncello Spritz",
        image: "images/limoncello-spritz-service.jpg",
        mood: "De perfecte aperitivo voor een warme zomeravond.",
        ingredients: [
          "60 ml Casa del Mulino Limoncello",
          "90 ml Prosecco",
          "30 ml bruiswater",
          "IJsblokjes",
          "Schijfje citroen",
          "Takje munt, optioneel"
        ],
        method: "Vul een groot wijnglas met ijs. Schenk eerst de Limoncello in, gevolgd door de Prosecco en het bruiswater. Roer rustig door en garneer met een schijfje citroen en eventueel een takje munt.",
        serve: "Serveer als aperitivo, ruim voor het diner of aan het begin van een lange avond."
      },
      {
        title: "Italian Corona",
        image: "images/product-limoncello.jpg",
        mood: "Een verrassend frisse combinatie van Italiaans vakmanschap en een zomers biermoment.",
        ingredients: [
          "1 fles Corona Extra",
          "40 ml Casa del Mulino Limoncello"
        ],
        method: "Neem enkele slokken uit de Corona-fles zodat er ruimte ontstaat. Voeg vervolgens 40 ml Casa del Mulino Limoncello toe, draai de fles een paar keer rustig rond en serveer direct ijskoud.",
        serve: "Zet de fles vooraf koud en serveer direct na het mengen."
      }
    ]
  },
  arancello: {
    name: "Casa del Mulino Arancello",
    short: "Warme sinaasappeltonen met een bitterzoete finale.",
    image: "images/product-arancello.jpg",
    gallery: ["images/product-arancello.jpg", "images/arancello-fles.jpg", "images/limoncello-arancello-case.jpg", "images/product-collection-three.jpg"],
    accent: "#cf7228",
    alcohol: "30% vol",
    size: "500 ml",
    fruit: "Sinaasappel",
    story: "Arancello brengt de zachtere kant van citrus naar voren: rijpe sinaasappel, mediterrane warmte en een ronde afdronk.",
    ingredients: ["Sinaasappelschillen", "Alcohol", "Water", "Suiker"],
    process: "De sinaasappels worden met de hand geschild, waarna de schillen langzaam hun olie en kleur afgeven. Na het trekken wordt de likeur handmatig gefilterd en gemengd.",
    serve: "Serveer gekoeld bij desserts, pure chocolade of als citrusaccent in cocktails.",
    pairings: sharedPairings
  },
  meloncello: {
    name: "Casa del Mulino Meloncello",
    short: "Licht, rond en fruitig met zachte meloen.",
    image: "images/product-meloncello.jpg",
    gallery: ["images/product-meloncello.jpg", "images/meloncello-fles.jpg", "images/product-collection-three.jpg", "images/casa-del-mulino-flessen.jpg"],
    accent: "#71925a",
    alcohol: "30% vol",
    size: "500 ml",
    fruit: "Meloen",
    story: "Meloncello is vriendelijk, verrassend en zacht. Een likeur die doet denken aan lange avonden, rijp fruit en een tafel in de zon.",
    ingredients: ["Meloen", "Alcohol", "Water", "Suiker"],
    process: "De meloenbasis wordt in kleine batches bereid, gefilterd en zorgvuldig in balans gebracht zodat fruitigheid en zachtheid elkaar niet overheersen.",
    serve: "Serveer goed gekoeld na het eten of combineer met ijs en zomerse desserts.",
    pairings: sharedPairings
  }
};

const key = document.body.dataset.product;
const product = products[key] || products.limoncello;
const root = document.getElementById("product-root");
let activeProductPrice = 24.95;

const recipeSection = product.recipes
  ? `
    <section class="section recipe-section">
      <div class="section-copy reveal">
        <p class="eyebrow">Serveerinspiratie</p>
        <h2>Exclusieve recepten met ${product.name.replace("Casa del Mulino ", "")}</h2>
        <p>Ontworpen als elegante serveermomenten: weinig handelingen, veel sfeer en altijd ijskoud geserveerd.</p>
      </div>
      <div class="recipe-grid">
        ${product.recipes.map((recipe) => `
          <article class="recipe-card reveal">
            <img src="${recipe.image}" alt="${recipe.title}" loading="lazy">
            <div class="recipe-card-body">
              <span class="recipe-mark">Recept</span>
              <h3>${recipe.title}</h3>
              <p class="recipe-mood">"${recipe.mood}"</p>
              <h4>Ingredienten</h4>
              <ul>${recipe.ingredients.map((item) => `<li>${item}</li>`).join("")}</ul>
              <h4>Bereiding</h4>
              <p>${recipe.method}</p>
              <p class="serve-note">${recipe.serve}</p>
            </div>
          </article>
        `).join("")}
      </div>
    </section>`
  : `
    <section class="section recipe-section">
      <div class="section-copy reveal">
        <p class="eyebrow">Serveerinspiratie</p>
        <h2>Een klein glas, groots moment</h2>
        <p>${product.name.replace("Casa del Mulino ", "")} komt het mooist tot zijn recht als hij ijskoud wordt geserveerd, puur of als zachte fruitige toets in een cocktail.</p>
      </div>
    </section>`;

root.innerHTML = `
  <header class="site-header solid">
    <a class="brand" href="index.html"><span class="windmill" aria-hidden="true"><span></span></span><span><strong>Casa del Mulino</strong><small>Fatto a Mano</small></span></a>
    <nav class="main-nav visible"><a href="index.html#collectie">Collectie</a><a href="citroen-tot-fles.html">Proces</a><a href="achter-de-schermen.html">Atelier</a><a href="bestellen.html">Bestellen</a></nav>
  </header>
  <main style="--accent:${product.accent}">
    <section class="product-hero">
      <div>
        <p class="eyebrow">${product.fruit}</p>
        <h1>${product.name}</h1>
        <p>${product.short}</p>
        <p><strong>${product.size} - ${product.alcohol} - €24,95</strong></p>
        <div class="product-trust-list">
          <span>Handgemaakt in Nederland</span>
          <span>Kleine batches</span>
          <span>Gratis verzending vanaf €75</span>
          <span>Veilig verpakt verzonden</span>
        </div>
        <div class="product-hero-actions">
          <a class="button primary" href="#configurator">Configureer fles</a>
          <button class="favorite-button" type="button" data-favorite="${key}" aria-label="Toevoegen aan favorieten">♡</button>
        </div>
      </div>
      <img src="${product.image}" alt="${product.name}">
    </section>
    <section class="section product-gallery-section">
      <div class="section-copy reveal">
        <p class="eyebrow">Productfoto's</p>
        <h2>Bekijk de fles van dichtbij</h2>
        <p>Meerdere beelden, voorbereid voor een toekomstige 360 graden viewer.</p>
      </div>
      <div class="product-gallery-viewer reveal">
        <div class="gallery-stage">
          <img src="${product.gallery[0]}" alt="${product.name}" data-gallery-main>
          <button type="button" class="zoom-hint" data-gallery-zoom>Fullscreen bekijken</button>
        </div>
        <div class="gallery-thumbs">
          ${product.gallery.map((image, index) => `<button type="button" data-gallery-thumb="${image}" class="${index === 0 ? "active" : ""}"><img src="${image}" alt="${product.name} foto ${index + 1}"></button>`).join("")}
        </div>
      </div>
    </section>
    <section class="section configurator-section" id="configurator">
      <div class="configurator-panel reveal" data-configurator>
        <div>
          <p class="eyebrow">Productconfigurator</p>
          <h2>${product.name}</h2>
          <p>Kies het formaat en aantal. De 700 ml fles is alvast zichtbaar, maar nog niet selecteerbaar.</p>
        </div>
        <div class="configurator-options">
          <fieldset>
            <legend>Inhoud</legend>
            <label><input type="radio" name="size-${key}" checked value="500"> 500 ml <strong>€24,95</strong></label>
            <label class="soon"><input type="radio" name="size-${key}" disabled value="700"> 700 ml <span>Binnenkort verkrijgbaar</span></label>
          </fieldset>
          <label class="qty-label">Aantal<input type="number" min="1" value="1" data-config-qty></label>
          <label class="gift-option gift-option-disabled"><input type="checkbox" data-gift-wrap disabled> <span>Luxe cadeauverpakking <small>Binnenkort beschikbaar</small></span></label>
          <p class="gift-soon-note">We werken momenteel aan een luxe cadeauverpakking voor Casa del Mulino. Zodra deze beschikbaar is, kun je je bestelling uitbreiden met een stijlvolle geschenkverpakking voor €3,95.</p>
          <label class="gift-message gift-message-disabled"><span>Persoonlijke boodschap</span><textarea rows="3" data-gift-message placeholder="Beschikbaar zodra cadeauverpakking live is" disabled></textarea></label>
          <div class="shipping-box compact">
            <span class="shipping-icon" aria-hidden="true"></span>
            <p data-shipping-message>Gratis verzending vanaf €75,00.</p>
            <div class="shipping-track"><i data-shipping-progress></i></div>
            <small>Nederland: €6,95 verzendkosten</small>
          </div>
          <p class="config-price">Totaal <strong data-config-total>€24,95</strong></p>
          <div class="config-actions">
            <button class="button primary" type="button" data-add-cart="${key}">Toevoegen aan winkelwagen</button>
            <a class="button secondary dark" href="contact.html">Interesse tonen</a>
          </div>
          <p class="form-note">Demo-webshop: er vindt geen echte betaling plaats.</p>
        </div>
      </div>
    </section>
    <section class="section product-detail">
      <article class="detail-panel reveal">
        <p class="eyebrow">Verhaal</p>
        <h2>Gemaakt voor lange tafels en kleine glazen.</h2>
        <p>${product.story}</p>
        <h3>Hoe wordt hij gemaakt</h3>
        <p>${product.process}</p>
      </article>
      <aside class="detail-panel reveal">
        <h3>Ingredienten</h3>
        <ul>${product.ingredients.map((item) => `<li>${item}</li>`).join("")}</ul>
        <h3>Serveertips</h3>
        <p>${product.serve}</p>
        <h3>Perfect met</h3>
        <ul><li>Desserts</li><li>IJs</li><li>Cocktails</li><li>Na het eten</li></ul>
      </aside>
    </section>
    <section class="section pairing-section">
      <div class="section-copy reveal">
        <p class="eyebrow">Heerlijk bij</p>
        <h2>Pairings die de smaak laten spreken</h2>
        <p>Rustige combinaties voor dessert, borrel of het laatste glas aan tafel. Beweeg over een kaart voor extra serveeradvies.</p>
      </div>
      <div class="pairing-grid">
        ${product.pairings.map((pairing) => `
          <article class="pairing-card reveal">
            <img src="${pairing.image}" alt="${pairing.title}" loading="lazy">
            <div>
              <span class="pairing-icon">${pairing.title.charAt(0)}</span>
              <h3>${pairing.title}</h3>
              <p>${pairing.note}</p>
            </div>
          </article>
        `).join("")}
      </div>
    </section>
    <section class="section product-care">
      <div class="care-panel reveal">
        <p class="eyebrow">Bewaaradvies</p>
        <h2>IJskoud bewaren, rustig serveren</h2>
        <div class="care-points">
          <p><strong>Bewaren</strong><span>Bij voorkeur in de vriezer.</span></p>
          <p><strong>Serveren</strong><span>IJskoud in een klein glas.</span></p>
          <p><strong>Houdbaarheid</strong><span>Minimaal een jaar gesloten en koel bewaard.</span></p>
          <p><strong>Schudden</strong><span>Licht schudden wanneer natuurlijke olien zich hebben gescheiden.</span></p>
        </div>
      </div>
    </section>
    ${recipeSection}
  </main>
  <footer class="site-footer"><p>Casa del Mulino<br>Fatto a Mano<br>Gemaakt in Nederland</p><nav><a href="index.html">Home</a><a href="citroen-tot-fles.html">Proces</a><a href="bestellen.html">Bestellen</a></nav></footer>
  <div class="lightbox" data-product-lightbox aria-hidden="true"><button type="button" aria-label="Sluiten" data-product-lightbox-close>&times;</button><img alt=""></div>
`;

const mainImage = document.querySelector("[data-gallery-main]");
const total = document.querySelector("[data-config-total]");
const qty = document.querySelector("[data-config-qty]");
const updateConfiguratorTotal = () => {
  if (total && qty) {
    total.textContent = new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" }).format(Number(qty.value || 1) * activeProductPrice);
  }
};
document.querySelectorAll("[data-gallery-thumb]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll("[data-gallery-thumb]").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    mainImage.src = button.dataset.galleryThumb;
  });
});
qty?.addEventListener("input", updateConfiguratorTotal);
updateConfiguratorTotal();
const productLightbox = document.querySelector("[data-product-lightbox]");
document.querySelector("[data-gallery-zoom]")?.addEventListener("click", () => {
  productLightbox.querySelector("img").src = mainImage.src;
  productLightbox.classList.add("open");
});
document.querySelector("[data-product-lightbox-close]")?.addEventListener("click", () => productLightbox.classList.remove("open"));

const applyProductCmsContent = async () => {
  try {
    const response = await fetch("content/products.json", { cache: "no-store" });
    if (!response.ok) return;
    const data = await response.json();
    const cmsProduct = data.products?.find((item) => item.id === key);
    if (!cmsProduct) return;

    activeProductPrice = Number(cmsProduct.price ?? activeProductPrice);
    const price = new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" }).format(activeProductPrice);
    const hero = document.querySelector(".product-hero");
    const configurator = document.querySelector("[data-configurator]");
    const heroImage = hero?.querySelector("img");
    const primaryImage = cmsProduct.image?.replace(/^\/+/, "");

    if (hero?.querySelector("h1")) hero.querySelector("h1").textContent = cmsProduct.name || product.name;
    if (hero?.querySelector(".eyebrow")) hero.querySelector(".eyebrow").textContent = cmsProduct.flavor || product.fruit;
    if (hero?.querySelector("p:not(.eyebrow)")) hero.querySelector("p:not(.eyebrow)").textContent = cmsProduct.short || product.short;
    if (hero?.querySelector("strong")) hero.querySelector("strong").textContent = `${cmsProduct.size || product.size} - ${cmsProduct.alcohol || product.alcohol} - ${price}`;
    if (heroImage && primaryImage) {
      heroImage.src = primaryImage;
      heroImage.alt = cmsProduct.name || product.name;
    }
    if (configurator?.querySelector("h2")) configurator.querySelector("h2").textContent = cmsProduct.name || product.name;
    const sizeLabel = configurator?.querySelector("fieldset label strong");
    if (sizeLabel) sizeLabel.textContent = price;
    updateConfiguratorTotal();
  } catch (error) {
    // Static fallback remains available when CMS content cannot be loaded.
  }
};

applyProductCmsContent();
