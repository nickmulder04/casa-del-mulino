const SITE_BASE = new URL("../../", document.currentScript?.src || window.location.href).href;
const fromSite = (path) => new URL(path.replace(/^\/+/, ""), SITE_BASE).href;

let SHIPPING_COST = 6.95;
let FREE_SHIPPING_FROM = 75;

const shopProducts = {
  limoncello: {
    name: "Casa del Mulino Limoncello",
    image: "assets/images/product-limoncello.jpg",
    size: "500 ml",
    price: 24.95
  },
  arancello: {
    name: "Casa del Mulino Arancello",
    image: "assets/images/product-arancello.jpg",
    size: "500 ml",
    price: 24.95
  },
  meloncello: {
    name: "Casa del Mulino Meloncello",
    image: "assets/images/product-meloncello.jpg",
    size: "500 ml",
    price: 24.95
  },
  duo: {
    name: "Duo Collectie",
    image: "assets/images/limoncello-arancello-case.jpg",
    size: "2 x 500 ml",
    price: 45,
    bundle: ["Kies zelf twee flessen", "Limoncello + Arancello", "Limoncello + Meloncello", "Arancello + Meloncello"]
  },
  signature: {
    name: "Signature Collectie",
    image: "assets/images/product-collection-three.jpg",
    size: "3 x 500 ml",
    price: 65,
    bundle: ["Casa del Mulino Limoncello", "Casa del Mulino Arancello", "Casa del Mulino Meloncello"],
    badge: "Complete Collectie"
  }
};

const playlist = [
  {
    title: "Limoncello del Mulino",
    src: "assets/audio/limoncello-del-mulino.mp3",
    cover: "assets/images/casa-del-mulino-official-logo.jpg"
  }
];

const cmsState = {
  settings: null,
  footer: null
};

const fetchCmsJson = async (path) => {
  try {
    const response = await fetch(fromSite(path), { cache: "no-store" });
    if (!response.ok) throw new Error(`CMS content missing: ${path}`);
    return await response.json();
  } catch (error) {
    return null;
  }
};

const publicAssetPath = (path) => path ? fromSite(path) : "";

const applyCmsContent = async () => {
  const [settings, products, collections, footer] = await Promise.all([
    fetchCmsJson("content/settings.json"),
    fetchCmsJson("content/products.json"),
    fetchCmsJson("content/collections.json"),
    fetchCmsJson("content/footer.json")
  ]);

  cmsState.settings = settings;
  cmsState.footer = footer;

  if (settings?.shipping) {
    SHIPPING_COST = Number(settings.shipping.cost ?? SHIPPING_COST);
    FREE_SHIPPING_FROM = Number(settings.shipping.freeFrom ?? FREE_SHIPPING_FROM);
  }

  if (settings?.music?.active !== false && settings?.music?.title) {
    playlist[0] = {
      title: settings.music.title || playlist[0].title,
      src: publicAssetPath(settings.music.file) || playlist[0].src,
      cover: publicAssetPath(settings.music.cover) || playlist[0].cover
    };
  }

  products?.products?.forEach((product) => {
    if (!product?.id) return;
    shopProducts[product.id] = {
      ...shopProducts[product.id],
      name: product.name || shopProducts[product.id]?.name,
      image: publicAssetPath(product.image) || shopProducts[product.id]?.image,
      size: product.size || shopProducts[product.id]?.size,
      price: Number(product.price ?? shopProducts[product.id]?.price ?? 0)
    };
  });

  collections?.collections?.forEach((collection) => {
    if (!collection?.id) return;
    shopProducts[collection.id] = {
      ...shopProducts[collection.id],
      name: collection.name || shopProducts[collection.id]?.name,
      image: publicAssetPath(collection.image) || shopProducts[collection.id]?.image,
      size: collection.size || shopProducts[collection.id]?.size,
      price: Number(collection.price ?? shopProducts[collection.id]?.price ?? 0),
      bundle: collection.bundle || shopProducts[collection.id]?.bundle,
      badge: collection.badge || shopProducts[collection.id]?.badge
    };
  });
};

const currency = (value) => new Intl.NumberFormat("nl-NL", {
  style: "currency",
  currency: "EUR"
}).format(value);

const getCart = () => JSON.parse(localStorage.getItem("cdm-cart") || "[]");
const setCart = (cart) => localStorage.setItem("cdm-cart", JSON.stringify(cart));
const getFavorites = () => JSON.parse(localStorage.getItem("cdm-favorites") || "[]");
const setFavorites = (items) => localStorage.setItem("cdm-favorites", JSON.stringify(items));

const cartSubtotal = (cart) => cart.reduce((sum, item) => sum + (shopProducts[item.key]?.price || 0) * item.quantity, 0);
const shippingFor = (subtotal) => subtotal > 0 && subtotal < FREE_SHIPPING_FROM ? SHIPPING_COST : 0;
const shippingMessage = (subtotal) => {
  if (subtotal >= FREE_SHIPPING_FROM) return "Gefeliciteerd! Je bestelling wordt gratis verzonden.";
  if (subtotal <= 0) return `Gratis verzending vanaf ${currency(FREE_SHIPPING_FROM)}.`;
  return `Nog ${currency(FREE_SHIPPING_FROM - subtotal)} tot gratis verzending.`;
};

const addToCart = (key, quantity = 1, giftWrap = false, message = "") => {
  const product = shopProducts[key];
  if (!product) return;
  const cart = getCart();
  const existing = cart.find((item) => item.key === key && item.giftWrap === giftWrap && item.message === message);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ key, quantity, giftWrap, message });
  }
  setCart(cart);
  renderCart();
  openCart();
};

const updateCartItem = (index, quantity) => {
  const cart = getCart();
  if (!cart[index]) return;
  cart[index].quantity = Math.max(0, quantity);
  setCart(cart.filter((item) => item.quantity > 0));
  renderCart();
};

const openCart = () => document.querySelector("[data-cart-drawer]")?.classList.add("open");
const closeCart = () => document.querySelector("[data-cart-drawer]")?.classList.remove("open");

const renderCart = () => {
  const cart = getCart();
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartSubtotal(cart);
  const shipping = shippingFor(subtotal);
  const progress = Math.min(100, Math.round((subtotal / FREE_SHIPPING_FROM) * 100));

  document.querySelectorAll("[data-cart-count]").forEach((el) => { el.textContent = String(count); });
  document.querySelectorAll("[data-shipping-message]").forEach((el) => { el.textContent = shippingMessage(subtotal); });
  document.querySelectorAll("[data-shipping-progress]").forEach((el) => { el.style.width = `${progress}%`; });
  document.querySelectorAll("[data-shipping-cost]").forEach((el) => { el.textContent = shipping ? currency(shipping) : "Gratis"; });

  const body = document.querySelector("[data-cart-items]");
  const subtotalEl = document.querySelector("[data-cart-subtotal]");
  const shippingEl = document.querySelector("[data-cart-shipping]");
  const totalEl = document.querySelector("[data-cart-total]");
  if (!body || !subtotalEl || !shippingEl || !totalEl) return;

  body.innerHTML = cart.length ? cart.map((item, index) => {
    const product = shopProducts[item.key];
    const line = product.price * item.quantity;
    return `
      <article class="cart-line">
        <img src="${product.image}" alt="${product.name}">
        <div>
          <h3>${product.name}</h3>
          <p>${product.size} - ${currency(product.price)}</p>
          ${product.badge ? `<small>${product.badge}</small>` : ""}
          ${product.bundle ? `<ul>${product.bundle.map((entry) => `<li>${entry}</li>`).join("")}</ul>` : ""}
          ${item.giftWrap ? "<small>Luxe cadeauverpakking</small>" : ""}
          ${item.message ? `<small>Persoonlijke boodschap: ${item.message}</small>` : ""}
          <div class="cart-line-actions">
            <button type="button" data-cart-minus="${index}">-</button>
            <span>${item.quantity}</span>
            <button type="button" data-cart-plus="${index}">+</button>
            <strong>${currency(line)}</strong>
          </div>
        </div>
      </article>`;
  }).join("") : "<p class=\"cart-empty\">Uw winkelwagen is nog leeg.</p>";
  subtotalEl.textContent = currency(subtotal);
  shippingEl.textContent = shipping ? currency(shipping) : "Gratis";
  totalEl.textContent = currency(subtotal + shipping);
};

const injectCart = () => {
  if (document.querySelector("[data-cart-drawer]")) return;
  document.body.insertAdjacentHTML("beforeend", `
    <button class="cart-fab" type="button" data-cart-open aria-label="Open winkelwagen">
      <span class="cart-icon" aria-hidden="true"></span>
      <span class="cart-count" data-cart-count>0</span>
    </button>
    <aside class="cart-drawer" data-cart-drawer aria-label="Winkelwagen">
      <div class="cart-drawer-head">
        <div>
          <p class="eyebrow">Demo webshop</p>
          <h2>Winkelwagen</h2>
        </div>
        <button type="button" data-cart-close aria-label="Sluit winkelwagen">&times;</button>
      </div>
      <div class="cart-items" data-cart-items></div>
      <div class="shipping-box">
        <span class="shipping-icon" aria-hidden="true"></span>
        <p data-shipping-message>Gratis verzending vanaf €75,00.</p>
        <div class="shipping-track"><i data-shipping-progress></i></div>
        <small>Nederland: €6,95 verzendkosten</small>
      </div>
      <div class="cart-total"><span>Subtotaal</span><strong data-cart-subtotal>€0,00</strong></div>
      <div class="cart-total muted"><span>Verzending</span><strong data-cart-shipping>€0,00</strong></div>
      <div class="cart-total grand"><span>Totaal</span><strong data-cart-total>€0,00</strong></div>
      <button class="button secondary dark" type="button" data-cart-close>Verder winkelen</button>
      <a class="button primary" href="checkout.html">Afrekenen</a>
      <p class="cart-note">Deze webshop is een demonstratie. Er wordt niets afgerekend.</p>
    </aside>
  `);

  document.addEventListener("click", (event) => {
    const open = event.target.closest("[data-cart-open]");
    const close = event.target.closest("[data-cart-close]");
    const minus = event.target.closest("[data-cart-minus]");
    const plus = event.target.closest("[data-cart-plus]");
    if (open) openCart();
    if (close) closeCart();
    if (minus) {
      const index = Number(minus.dataset.cartMinus);
      const item = getCart()[index];
      updateCartItem(index, item.quantity - 1);
    }
    if (plus) {
      const index = Number(plus.dataset.cartPlus);
      const item = getCart()[index];
      updateCartItem(index, item.quantity + 1);
    }
  });
  renderCart();
};

const injectMusicPlayer = () => {
  if (document.querySelector("[data-music-shell]")) return;
  const track = playlist[0];
  document.body.insertAdjacentHTML("beforeend", `
    <div class="music-shell" data-music-shell>
      <button class="music-fab" type="button" data-music-toggle aria-label="Speel Limoncello del Mulino">
        <span class="music-disc"><span class="windmill" aria-hidden="true"><span></span></span></span>
        <span>Italiaanse sfeer</span>
      </button>
      <section class="music-player" data-music-player aria-label="Muziekspeler">
        <button class="music-minimize" type="button" data-music-minimize aria-label="Minimaliseer muziekspeler">×</button>
        <img src="${track.cover}" alt="" class="music-cover">
        <div class="music-main">
          <p class="eyebrow">Soundtrack</p>
          <h3>${track.title}</h3>
          <div class="music-controls">
            <button type="button" data-audio-play>Play</button>
            <span class="equalizer" aria-hidden="true"><i></i><i></i><i></i></span>
            <span data-audio-time>0:00 / 0:00</span>
          </div>
          <input type="range" min="0" max="100" value="0" data-audio-progress aria-label="Voortgang">
          <label class="volume-label">Volume<input type="range" min="0" max="1" step="0.01" data-audio-volume aria-label="Volume"></label>
        </div>
        <audio data-audio src="${track.src}" preload="metadata"></audio>
      </section>
    </div>
  `);

  const audio = document.querySelector("[data-audio]");
  const shell = document.querySelector("[data-music-shell]");
  const player = document.querySelector("[data-music-player]");
  const toggle = document.querySelector("[data-music-toggle]");
  const minimize = document.querySelector("[data-music-minimize]");
  const play = document.querySelector("[data-audio-play]");
  const progress = document.querySelector("[data-audio-progress]");
  const volume = document.querySelector("[data-audio-volume]");
  const time = document.querySelector("[data-audio-time]");
  const savedVolume = Number(sessionStorage.getItem("cdm-audio-volume") || 0.55);
  audio.volume = savedVolume;
  volume.value = String(savedVolume);
  const mobileDefault = window.matchMedia("(max-width: 620px)").matches;
  const minimized = sessionStorage.getItem("cdm-audio-minimized");
  if (sessionStorage.getItem("cdm-audio-enabled") === "true" && minimized !== "true" && !mobileDefault) player.classList.add("open");

  const fmt = (seconds) => {
    if (!Number.isFinite(seconds)) return "0:00";
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60).toString().padStart(2, "0");
    return `${min}:${sec}`;
  };
  const updateAudioUi = () => {
    const pct = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
    progress.value = String(pct);
    time.textContent = `${fmt(audio.currentTime)} / ${fmt(audio.duration)}`;
    sessionStorage.setItem("cdm-audio-time", String(audio.currentTime));
  };
  const togglePlayback = async () => {
    player.classList.add("open");
    sessionStorage.setItem("cdm-audio-minimized", "false");
    sessionStorage.setItem("cdm-audio-enabled", "true");
    if (audio.paused) {
      await audio.play();
      shell.classList.add("is-playing");
      play.textContent = "Pauze";
    } else {
      audio.pause();
      sessionStorage.setItem("cdm-audio-enabled", "false");
      shell.classList.remove("is-playing");
      play.textContent = "Play";
    }
  };
  toggle.addEventListener("click", togglePlayback);
  minimize.addEventListener("click", () => {
    player.classList.remove("open");
    sessionStorage.setItem("cdm-audio-minimized", "true");
  });
  play.addEventListener("click", togglePlayback);
  volume.addEventListener("input", () => {
    audio.volume = Number(volume.value);
    sessionStorage.setItem("cdm-audio-volume", volume.value);
  });
  progress.addEventListener("input", () => {
    if (audio.duration) audio.currentTime = (Number(progress.value) / 100) * audio.duration;
  });
  audio.addEventListener("timeupdate", updateAudioUi);
  audio.addEventListener("loadedmetadata", () => {
    const savedTime = Number(sessionStorage.getItem("cdm-audio-time") || 0);
    if (savedTime > 0 && savedTime < audio.duration) audio.currentTime = savedTime;
    updateAudioUi();
    if (sessionStorage.getItem("cdm-audio-enabled") === "true") {
      audio.play().then(() => {
        shell.classList.add("is-playing");
        play.textContent = "Pauze";
      }).catch(() => {
        play.textContent = "Play";
      });
    }
  });
  audio.addEventListener("pause", () => shell.classList.remove("is-playing"));
  audio.addEventListener("play", () => shell.classList.add("is-playing"));
};

const enhanceFooter = () => {
  document.querySelectorAll(".site-footer").forEach((footer) => {
    const footerLinks = cmsState.footer?.links?.length
      ? cmsState.footer.links
      : [
        { label: "Home", url: "index.html" },
        { label: "Over Casa del Mulino", url: "over.html" },
        { label: "Ons verhaal", url: "verhaal.html" },
        { label: "Producten", url: "smaken.html" },
        { label: "Recepten", url: "recepten.html" },
        { label: "Proeverijen & Masterclasses", url: "proeverijen.html" },
        { label: "Contact", url: "contact.html" },
        { label: "Veelgestelde vragen", url: "faq.html" },
        { label: "Privacyverklaring", url: "privacy.html" },
        { label: "Algemene voorwaarden", url: "algemene-voorwaarden.html" },
        { label: "Leeftijdscontrole (18+)", url: "leeftijdscontrole.html" },
        { label: "Cookiebeleid", url: "cookiebeleid.html" },
        { label: "Verzendinformatie", url: "verzendinformatie.html" },
        { label: "Retourbeleid", url: "retourbeleid.html" },
        { label: "Instagram", url: "https://www.instagram.com/casa.del.mulino" }
      ];
    footer.classList.add("rich-footer");
    footer.innerHTML = `
      <div class="footer-intro">
        <div class="brand footer-brand">
          <img src="${fromSite("assets/images/casa-del-mulino-official-logo.jpg")}" alt="" class="brand-logo">
          <span><strong>Casa del Mulino</strong><small>Fatto a Mano</small></span>
        </div>
        <p>Italiaanse traditie ontmoet Nederlands vakmanschap. Kleine batches, met de hand gemaakt in Nederland.</p>
      </div>
      <nav class="footer-links" aria-label="Footer">
        ${footerLinks.map((link) => {
          const external = /^https?:\/\//.test(link.url);
          return `<a href="${external ? link.url : fromSite(link.url)}"${external ? ' target="_blank" rel="noopener"' : ""}>${link.label}</a>`;
        }).join("")}
      </nav>
      <form class="newsletter-form" action="#" data-newsletter>
        <p class="eyebrow">Nieuwsbrief</p>
        <h3>Blijf op de hoogte</h3>
        <p>Ontvang als eerste nieuws over nieuwe batches, recepten, evenementen en toekomstige smaken.</p>
        <label><span>E-mailadres</span><input type="email" required placeholder="naam@email.nl"></label>
        <button class="button primary" type="submit">Inschrijven</button>
      </form>
      <address class="footer-contact">
        <strong>Contact</strong><br>
        <a href="mailto:info@casadelmulino.nl">info@casadelmulino.nl</a><br>
        <a href="https://wa.me/31636188895">06-36188895</a><br>
        <a href="https://www.instagram.com/casa.del.mulino" target="_blank" rel="noopener">@casa.del.mulino</a>
      </address>
      <p class="footer-bottom">© 2026 Casa del Mulino - Italiaanse traditie. Nederlands vakmanschap. Fatto a Mano - Handgemaakt in Nederland.</p>
    `;
  });
};

const bindShopForms = () => {
  document.addEventListener("submit", (event) => {
    if (event.target.matches("[data-newsletter]")) {
      event.preventDefault();
      alert("Dank u. De nieuwsbriefkoppeling wordt binnenkort geactiveerd.");
    }
  });
  document.addEventListener("click", (event) => {
    const add = event.target.closest("[data-add-cart]");
    const favorite = event.target.closest("[data-favorite]");
    if (add) {
      const key = add.dataset.addCart;
      const form = add.closest("[data-configurator]");
      const quantity = Number(form?.querySelector("[data-config-qty]")?.value || 1);
      const giftInput = form?.querySelector("[data-gift-wrap]");
      const messageInput = form?.querySelector("[data-gift-message]");
      const giftWrap = Boolean(giftInput?.checked && !giftInput.disabled);
      const message = messageInput && !messageInput.disabled ? messageInput.value.trim() : "";
      addToCart(key, quantity, giftWrap, message);
    }
    if (favorite) {
      const key = favorite.dataset.favorite;
      const favorites = getFavorites();
      const next = favorites.includes(key) ? favorites.filter((item) => item !== key) : [...favorites, key];
      setFavorites(next);
      favorite.classList.toggle("active", next.includes(key));
    }
  });
  document.querySelectorAll("[data-favorite]").forEach((button) => {
    button.classList.toggle("active", getFavorites().includes(button.dataset.favorite));
  });
};

const pageCatalog = [
  { title: "Limoncello", url: "limoncello.html", keywords: "citroen limoncello smaken product" },
  { title: "Arancello", url: "arancello.html", keywords: "sinaasappel arancello smaken product" },
  { title: "Meloncello", url: "meloncello.html", keywords: "meloen meloncello smaken product" },
  { title: "Recepten", url: "recepten.html", keywords: "cocktail spritz tonic dessert recepten" },
  { title: "FAQ", url: "faq.html", keywords: "vragen bewaren troebel houdbaarheid verzending cadeau" },
  { title: "Ambacht", url: "ambacht.html", keywords: "handgemaakt ambacht schillen trekken bottelen" },
  { title: "Proeverijen", url: "proeverijen.html", keywords: "masterclass proeven proeverij" },
  { title: "Cadeaugids", url: "cadeaugids.html", keywords: "cadeau verjaardag kerst relatiegeschenk" },
  { title: "Productvergelijking", url: "vergelijken.html", keywords: "vergelijken smaakprofiel zoetheid frisheid" }
];

const pageLabels = {
  "index.html": "Home",
  "limoncello.html": "Limoncello",
  "arancello.html": "Arancello",
  "meloncello.html": "Meloncello",
  "recepten.html": "Recepten",
  "bestellen.html": "Bestellen",
  "checkout.html": "Afrekenen",
  "contact.html": "Contact",
  "faq.html": "FAQ",
  "reviews.html": "Reviews",
  "vergelijken.html": "Productvergelijking",
  "cadeaugids.html": "Cadeaugids",
  "ambacht.html": "Ambacht",
  "proeverijen.html": "Proeverijen",
  "citroen-tot-fles.html": "Van citroen tot fles",
  "achter-de-schermen.html": "Achter de schermen"
};

const injectSearch = () => {
  if (document.querySelector("[data-search-overlay]")) return;
  document.querySelector(".site-header")?.insertAdjacentHTML("beforeend", `<button class="search-trigger" type="button" data-search-open aria-label="Zoeken">Zoeken</button>`);
  document.body.insertAdjacentHTML("beforeend", `
    <section class="search-overlay" data-search-overlay aria-hidden="true">
      <div class="search-panel">
        <button type="button" data-search-close aria-label="Zoeken sluiten">&times;</button>
        <p class="eyebrow">Zoeken</p>
        <h2>Waar bent u naar op zoek?</h2>
        <input type="search" data-search-input placeholder="Zoek op Limoncello, recepten, FAQ..." autocomplete="off">
        <div class="search-results" data-search-results></div>
      </div>
    </section>
  `);
  const overlay = document.querySelector("[data-search-overlay]");
  const input = document.querySelector("[data-search-input]");
  const results = document.querySelector("[data-search-results]");
  const render = (query = "") => {
    const q = query.trim().toLowerCase();
    const items = pageCatalog.filter((item) => !q || `${item.title} ${item.keywords}`.toLowerCase().includes(q));
    results.innerHTML = items.map((item) => `<a href="${fromSite(item.url)}"><span>${item.title}</span><small>${item.keywords.split(" ").slice(0, 4).join(" · ")}</small></a>`).join("");
  };
  render();
  document.addEventListener("click", (event) => {
    if (event.target.closest("[data-search-open]")) {
      overlay.classList.add("open");
      overlay.setAttribute("aria-hidden", "false");
      render();
      window.setTimeout(() => input.focus(), 80);
    }
    if (event.target.closest("[data-search-close]") || event.target === overlay) {
      overlay.classList.remove("open");
      overlay.setAttribute("aria-hidden", "true");
    }
  });
  input.addEventListener("input", () => render(input.value));
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") overlay.classList.remove("open");
  });
};

const injectBreadcrumbs = () => {
  const file = location.pathname.split("/").pop() || "index.html";
  if (file === "index.html" || document.querySelector(".breadcrumbs")) return;
  const label = pageLabels[file] || document.title.replace(" | Casa del Mulino", "");
  document.querySelector("main")?.insertAdjacentHTML("afterbegin", `<nav class="breadcrumbs" aria-label="Breadcrumb"><a href="${fromSite("index.html")}">Home</a><span aria-hidden="true">/</span><span>${label}</span></nav>`);
};

const injectCookieBanner = () => {
  if (localStorage.getItem("cdm-cookies-ok") === "true") return;
  document.body.insertAdjacentHTML("beforeend", `
    <section class="cookie-banner" data-cookie-banner>
      <p><strong>Casa del Mulino gebruikt cookies</strong><br>Alleen voor een rustige, goede werking van de website.</p>
      <button class="button secondary dark" type="button" data-cookie-accept>Akkoord</button>
    </section>
  `);
  document.querySelector("[data-cookie-accept]")?.addEventListener("click", () => {
    localStorage.setItem("cdm-cookies-ok", "true");
    document.querySelector("[data-cookie-banner]")?.remove();
  });
};

const injectAgeGate = () => {
  const acceptedAt = Number(localStorage.getItem("cdm-age-ok-at") || 0);
  const thirtyDays = 30 * 24 * 60 * 60 * 1000;
  if (acceptedAt && Date.now() - acceptedAt < thirtyDays) return;
  if (document.querySelector("[data-age-gate]")) return;

  document.body.classList.add("age-gate-active");
  document.body.insertAdjacentHTML("beforeend", `
    <section class="age-gate" data-age-gate role="dialog" aria-modal="true" aria-labelledby="age-gate-title">
      <div class="age-gate-card">
        <img src="${fromSite("assets/images/casa-del-mulino-official-logo.jpg")}" alt="" class="age-gate-logo">
        <p class="eyebrow">Leeftijdscontrole</p>
        <h2 id="age-gate-title">Welkom bij Casa del Mulino</h2>
        <p>Casa del Mulino verkoopt uitsluitend alcoholhoudende producten aan personen van 18 jaar en ouder. Door verder te gaan bevestig je dat je minimaal 18 jaar oud bent.</p>
        <p class="age-gate-note">Wij stimuleren verantwoord alcoholgebruik en ondersteunen de Nederlandse NIX18-campagne.</p>
        <div class="age-gate-actions">
          <button class="button primary" type="button" data-age-yes>Ik ben 18 jaar of ouder</button>
          <button class="button secondary dark" type="button" data-age-no>Ik ben jonger dan 18 jaar</button>
        </div>
        <p class="age-denied" data-age-denied hidden>Helaas is Casa del Mulino uitsluitend toegankelijk voor bezoekers van 18 jaar en ouder.</p>
      </div>
    </section>
  `);

  const gate = document.querySelector("[data-age-gate]");
  gate.querySelector("[data-age-yes]")?.addEventListener("click", () => {
    localStorage.setItem("cdm-age-ok-at", String(Date.now()));
    document.body.classList.remove("age-gate-active");
    gate.remove();
  });
  gate.querySelector("[data-age-no]")?.addEventListener("click", () => {
    gate.querySelector("[data-age-denied]").hidden = false;
  });
};

const enhanceSeo = () => {
  const canonical = document.querySelector("link[rel='canonical']") || document.head.appendChild(document.createElement("link"));
  canonical.setAttribute("rel", "canonical");
  canonical.setAttribute("href", `https://casadelmulino.nl/${location.pathname.split("/").pop() || ""}`);
  if (!document.querySelector("meta[name='twitter:card']")) {
    const twitter = document.createElement("meta");
    twitter.name = "twitter:card";
    twitter.content = "summary_large_image";
    document.head.appendChild(twitter);
  }
  if (!document.querySelector("script[data-site-schema]")) {
    const schema = document.createElement("script");
    schema.type = "application/ld+json";
    schema.dataset.siteSchema = "true";
    schema.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Casa del Mulino",
      url: "https://casadelmulino.nl",
      logo: "https://casadelmulino.nl/assets/images/casa-del-mulino-official-logo.jpg",
      sameAs: ["https://www.instagram.com/casa.del.mulino"]
    });
    document.head.appendChild(schema);
  }
};

const initShopExperience = async () => {
  await applyCmsContent();
  injectCart();
  injectMusicPlayer();
  enhanceFooter();
  bindShopForms();
  injectSearch();
  injectBreadcrumbs();
  injectAgeGate();
  injectCookieBanner();
  enhanceSeo();
};

initShopExperience();
