const cmsPageBase = new URL("../../", document.currentScript?.src || window.location.href).href;
const cmsPath = (path) => new URL(path.replace(/^\/+/, ""), cmsPageBase).href;

const cmsFetch = async (path) => {
  try {
    const response = await fetch(cmsPath(path), { cache: "no-store" });
    if (!response.ok) throw new Error(path);
    return await response.json();
  } catch (error) {
    return null;
  }
};

const pageKey = () => {
  const file = (location.pathname.split("/").pop() || "index.html").replace(".html", "");
  if (file === "index") return "home";
  if (file === "verhaal") return "story";
  return file;
};

const setMeta = (selector, attr, value) => {
  if (!value) return;
  let element = document.querySelector(selector);
  if (!element) {
    element = selector.startsWith("meta")
      ? document.head.appendChild(document.createElement("meta"))
      : null;
  }
  if (!element) return;
  if (selector.includes("property=")) element.setAttribute("property", selector.match(/property='?([^'\\]]+)/)?.[1] || "");
  if (selector.includes("name=")) element.setAttribute("name", selector.match(/name='?([^'\\]]+)/)?.[1] || "");
  element.setAttribute(attr, value);
};

const applyHero = (content) => {
  const hero = document.querySelector(".page-hero");
  if (!hero || !content) return;
  const eyebrow = hero.querySelector(".eyebrow");
  const title = hero.querySelector("h1");
  const text = hero.querySelector("p:not(.eyebrow)");
  const image = hero.querySelector("img");
  const heroData = content.hero || content;

  if (eyebrow && (heroData.eyebrow || content.title)) eyebrow.textContent = heroData.eyebrow || content.title;
  if (title && (heroData.heroTitle || content.heroTitle || heroData.title)) title.textContent = heroData.heroTitle || content.heroTitle || heroData.title;
  if (text && (heroData.subtitle || content.heroText || content.intro)) text.textContent = heroData.subtitle || content.heroText || content.intro;
  if (image && (heroData.image || content.heroImage || content.image)) {
    image.src = cmsPath(heroData.image || content.heroImage || content.image);
    image.alt = heroData.title || content.title || "Casa del Mulino";
  }
};

const applySeo = (content, seo) => {
  const title = content?.seoTitle || seo?.defaultTitle;
  const description = content?.seoDescription || seo?.defaultDescription;
  if (title) document.title = title;
  setMeta("meta[name='description']", "content", description);
  setMeta("meta[property='og:title']", "content", title);
  setMeta("meta[property='og:description']", "content", description);
  setMeta("meta[name='twitter:card']", "content", seo?.twitterCard || "summary_large_image");
};

const applyContactContent = (contact) => {
  if (!contact || pageKey() !== "contact") return;
  document.querySelector("input[name='onderwerp']")?.setAttribute("value", contact.defaultSubject || "");
  const textarea = document.querySelector("textarea[name='bericht']");
  if (textarea && contact.defaultMessage) textarea.value = contact.defaultMessage;
  document.querySelectorAll("a[href^='mailto:']").forEach((link) => {
    link.href = `mailto:${contact.email}`;
    link.textContent = contact.email;
  });
};

const htmlList = (items = [], mapper) => items.map(mapper).join("");

const fallbackProducts = [
  {
    id: "limoncello",
    name: "Casa del Mulino Limoncello",
    flavor: "Citroen",
    image: "/images/product-limoncello.jpg",
    short: "Fris, zonnig en intens citroenachtig.",
    size: "500 ml",
    alcohol: "30% vol"
  },
  {
    id: "arancello",
    name: "Casa del Mulino Arancello",
    flavor: "Sinaasappel",
    image: "/images/product-arancello.jpg",
    short: "Warme sinaasappeltonen met een bitterzoete finale.",
    size: "500 ml",
    alcohol: "30% vol"
  },
  {
    id: "meloncello",
    name: "Casa del Mulino Meloncello",
    flavor: "Meloen",
    image: "/images/product-meloncello.jpg",
    short: "Licht, rond en fruitig met zachte meloen.",
    size: "500 ml",
    alcohol: "30% vol"
  }
];

const fallbackCollections = [
  {
    id: "duo",
    name: "Duo Collectie",
    price: 47.5,
    image: "/images/limoncello-arancello-case.jpg",
    description: "De perfecte combinatie om twee smaken van Casa del Mulino te ontdekken."
  },
  {
    id: "signature",
    name: "Signature Collectie",
    price: 69.95,
    badge: "Complete Collectie",
    image: "/images/product-collection-three.jpg",
    description: "Ontdek de volledige collectie van Casa del Mulino. Drie unieke smaken, samengebracht in een exclusieve selectie."
  },
  {
    id: "mixmatch",
    name: "Mix & Match Collectie",
    price: 47.5,
    badge: "Create Your Collection",
    image: "/images/casa-del-mulino-flessen.jpg",
    description: "Stel jouw eigen Casa del Mulino collectie samen en ontvang automatisch bundelvoordeel."
  }
];

const fallbackInstagramItems = [
  { image: "/images/instagram-limoncello-post.jpg", caption: "Van schil tot fles." },
  { image: "/images/limoncello-citrus-still-life.jpg", caption: "Italiaanse sfeer, Nederlands vakmanschap." },
  { image: "/images/product-collection-three.jpg", caption: "Drie smaken, met aandacht gemaakt." }
];

const revealRenderedContent = (root = document) => {
  root.querySelectorAll(".reveal:not(.in-view)").forEach((element) => {
    element.classList.add("in-view");
  });
};

const applyHomeContent = ({ home, products, collections, instagram, contact }) => {
  if (pageKey() !== "home") return;

  const hero = home?.hero;
  if (hero) {
    const heroSection = document.querySelector(".hero");
    const heroImage = heroSection?.querySelector(".hero-image");
    const eyebrow = heroSection?.querySelector(".eyebrow");
    const title = heroSection?.querySelector("h1");
    const subtitle = heroSection?.querySelector(".hero-subtitle");
    const actions = heroSection?.querySelector(".hero-actions");
    if (heroImage && hero.image) {
      heroImage.src = cmsPath(hero.image);
      heroImage.alt = hero.title || "Casa del Mulino";
    }
    if (eyebrow && hero.eyebrow) eyebrow.textContent = hero.eyebrow;
    if (title && hero.title) title.textContent = hero.title;
    if (subtitle && hero.subtitle) subtitle.innerHTML = hero.subtitle.replaceAll(". ", ".<br><span>").replace(/<span>(.*)$/, "<span>$1</span>");
    if (actions && hero.buttons?.length) {
      actions.innerHTML = hero.buttons.map((button, index) => `<a class="button ${index === 0 ? "primary" : "secondary"}" href="${button.url}">${button.label}</a>`).join("");
    }
  }

  const intro = document.querySelector(".intro-band p");
  if (intro && home?.intro) intro.textContent = home.intro;

  const story = home?.sections?.[0];
  const storySection = document.querySelector("#verhaal");
  if (story && storySection) {
    const heading = storySection.querySelector(".section-heading h2");
    const storyTitle = storySection.querySelector(".story-copy h2, .story-copy h3");
    const storyParagraph = storySection.querySelector(".story-copy p:not(.eyebrow):not(.signature)");
    const storyImage = storySection.querySelector(".story-image img");
    if (heading) heading.textContent = story.title || heading.textContent;
    if (storyTitle) storyTitle.textContent = story.title || storyTitle.textContent;
    if (storyParagraph) storyParagraph.textContent = story.text || storyParagraph.textContent;
    if (storyImage && story.image) {
      storyImage.src = cmsPath(story.image);
      storyImage.alt = story.title || "Casa del Mulino verhaal";
    }
  }

  const productGrid = document.querySelector("#collectie .product-grid");
  const productItems = products?.products?.length ? products.products : fallbackProducts;
  if (productGrid && productItems.length && !productGrid.closest("[data-static-commerce='true']")) {
    productGrid.innerHTML = htmlList(productItems, (product, index) => `
      <article class="product-card product-card-large reveal accent-${product.id}">
        <a class="product-media" href="${product.id}.html" aria-label="Bekijk details van ${product.name}">
          <img src="${cmsPath(product.image)}" loading="lazy" alt="${product.name}">
        </a>
        <div class="product-info">
          <span class="product-count">${String(index + 1).padStart(2, "0")}</span>
          <h3>${product.name}</h3>
          <p>${product.short || product.description || ""}</p>
          <div class="product-meta"><span>${product.size || ""}</span><span>${product.alcohol || ""}</span><span>${product.flavor || ""}</span></div>
          <a class="text-link" href="${product.id}.html">Bekijk details</a>
        </div>
      </article>
    `);
    revealRenderedContent(productGrid);
  }

  const bundleGrid = document.querySelector(".collection-bundle-grid");
  const collectionItems = collections?.collections?.length ? collections.collections : fallbackCollections;
  if (bundleGrid && collectionItems.length && !bundleGrid.closest("[data-static-commerce='true']")) {
    bundleGrid.innerHTML = htmlList(collectionItems, (collection) => `
      <article class="collection-bundle reveal">
        <img src="${cmsPath(collection.image)}" loading="lazy" alt="${collection.name}">
        <div>
          ${collection.badge ? `<span class="bundle-badge">${collection.badge}</span>` : ""}
          <p class="eyebrow">Exclusieve Collectie</p>
          <h3>${collection.name}</h3>
          <strong>${new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" }).format(collection.price || 0)}</strong>
          <p>${collection.description || ""}</p>
          <a class="text-link" href="bestellen.html#collecties">Bekijk collectie</a>
        </div>
      </article>
    `);
    revealRenderedContent(bundleGrid);
  }

  const instagramSection = document.querySelector("#instagram");
  const instagramGrid = instagramSection?.querySelector(".instagram-grid");
  if (instagramSection && instagram) {
    const heading = instagramSection.querySelector("h2");
    if (heading) heading.textContent = instagram.title || heading.textContent;
    if (instagramGrid) {
      instagramGrid.href = instagram.url || instagramGrid.href;
      const instagramItems = [...(instagram.items || []).filter((item) => item?.image)];
      fallbackInstagramItems.forEach((item) => {
        if (instagramItems.length < 3 && !instagramItems.some((existing) => existing.image === item.image)) instagramItems.push(item);
      });
      instagramGrid.innerHTML = htmlList(instagramItems, (item) => `<img src="${cmsPath(item.image)}" loading="lazy" alt="${item.caption || instagram.title}">`);
      revealRenderedContent(instagramGrid);
    }
  }

  const contactSection = document.querySelector("#contact");
  if (contactSection && contact) {
    const heading = contactSection.querySelector("h2");
    const form = contactSection.querySelector("form");
    const textarea = contactSection.querySelector("textarea[name='bericht']");
    const panel = contactSection.querySelector(".contact-panel");
    if (heading) heading.textContent = contact.title || heading.textContent;
    if (form && contact.email) form.action = `mailto:${contact.email}`;
    if (textarea && contact.defaultMessage) textarea.value = contact.defaultMessage;
    if (panel) {
      panel.innerHTML = `
        <h3>Casa del Mulino</h3>
        <p>${contact.intro || ""}</p>
        <a href="mailto:${contact.email}">${contact.email}</a>
        <a href="https://wa.me/${contact.whatsapp}" target="_blank" rel="noopener">${contact.whatsappDisplay || contact.whatsapp}</a>
        <a href="${contact.instagram}" target="_blank" rel="noopener">${contact.instagramHandle || "Instagram"}</a>
        <div class="map" aria-label="Sfeerbeeld Casa del Mulino"><span>${contact.reactionTime || "Wij reageren zo snel mogelijk."}</span></div>
      `;
    }
  }
};

const applyLegalContent = (legalContent) => {
  const key = pageKey();
  const legalKeys = ["privacy", "cookiebeleid", "algemene-voorwaarden", "verzendinformatie", "retourbeleid", "leeftijdscontrole"];
  if (!legalKeys.includes(key) || !legalContent) return;
  const container = document.querySelector(".text-page");
  if (!container) return;
  const updated = legalContent.updated ? `<p><strong>Laatst bijgewerkt:</strong> ${legalContent.updated}</p>` : "";
  container.innerHTML = `
    <h2>${legalContent.title}</h2>
    ${updated}
    <p>${legalContent.body}</p>
  `;
};

const applyStoryContent = (story) => {
  if (pageKey() !== "story" || !story?.sections?.length) return;
  const target = document.querySelector(".story-longform .text-page");
  if (!target) return;
  target.innerHTML = htmlList(story.sections, (section) => {
    const paragraphs = section.paragraphs || (section.text ? [section.text] : []);
    return `
      <section class="cms-text-block">
        ${section.title ? `<h2>${section.title}</h2>` : ""}
        ${paragraphs.map((paragraph) => paragraph.startsWith("\"") ? `<blockquote>${paragraph}</blockquote>` : `<p>${paragraph}</p>`).join("")}
      </section>
    `;
  });
  revealRenderedContent(target);
};

const applyExperienceContent = ({ masterclasses, tastings }) => {
  const key = pageKey();
  const content = key === "masterclass" ? masterclasses : key === "proeverijen" ? tastings : null;
  if (!content) return;
  applyHero({
    title: content.title,
    heroTitle: content.status || content.title,
    heroText: content.intro,
    heroImage: content.image
  });

  const copy = document.querySelector(".tasting-page .section-copy");
  if (copy) {
    const title = copy.querySelector("h2");
    const text = copy.querySelector("p");
    if (title) title.textContent = content.title || title.textContent;
    if (text) text.textContent = content.intro || text.textContent;
  }
  const grid = document.querySelector(".experience-grid");
  if (grid && content.cards?.length) {
    grid.innerHTML = htmlList(content.cards, (card) => `<article><h3>${card.title}</h3><p>${card.text}</p></article>`);
    revealRenderedContent(grid);
  }
};

const applyGenericPageContent = (pagesContent) => {
  const slug = pageKey();
  const pages = pagesContent?.pages || pagesContent?.items || [];
  const page = pages.find((item) => item.slug === slug || item.slug === `${slug}.html`);
  if (!page) return;

  applyHero({
    title: page.title,
    heroTitle: page.title,
    heroText: page.intro || page.metaDescription,
    heroImage: page.heroImage
  });

  applySeo({
    seoTitle: page.seoTitle || page.title,
    seoDescription: page.metaDescription
  });

  const target = document.querySelector(".text-page");
  if (!target || !page.blocks?.length) return;
  target.innerHTML = htmlList(page.blocks, (block) => `
    <section class="cms-text-block">
      ${block.heading ? `<h2>${block.heading}</h2>` : ""}
      ${block.text ? `<p>${block.text}</p>` : ""}
      ${block.image ? `<img src="${cmsPath(block.image)}" loading="lazy" alt="${block.heading || page.title}">` : ""}
    </section>
  `);
  revealRenderedContent(target);
};

const loadPageContent = async () => {
  const key = pageKey();
  const [seo, home, story, contact, legal, products, collections, instagram, masterclasses, tastings, pages] = await Promise.all([
    cmsFetch("content/seo.json"),
    cmsFetch("content/home.json"),
    cmsFetch("content/story.json"),
    cmsFetch("content/contact.json"),
    cmsFetch("content/legal.json"),
    cmsFetch("content/products.json"),
    cmsFetch("content/collections.json"),
    cmsFetch("content/instagram.json"),
    cmsFetch("content/masterclasses.json"),
    cmsFetch("content/tastings.json"),
    cmsFetch("content/pages.json")
  ]);

  const contentMap = {
    home,
    story,
    contact,
    privacy: legal?.privacy,
    "cookiebeleid": legal?.cookies,
    "algemene-voorwaarden": legal?.terms,
    "verzendinformatie": legal?.shipping,
    "retourbeleid": legal?.returns,
    "leeftijdscontrole": legal?.age
  };
  const content = contentMap[key];
  applyHero(content);
  applySeo(content, seo);
  applyContactContent(contact);
  applyHomeContent({ home, products, collections, instagram, contact });
  applyStoryContent(story);
  applyLegalContent(content);
  applyExperienceContent({ masterclasses, tastings });
  applyGenericPageContent(pages);
  revealRenderedContent();
};

loadPageContent().catch(() => {
  applyHomeContent({ products: { products: fallbackProducts }, collections: { collections: fallbackCollections } });
  revealRenderedContent();
});
