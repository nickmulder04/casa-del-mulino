let checkoutProducts = {
  limoncello: { name: "Casa del Mulino Limoncello", price: 24.95, icon: "Citroen", bottles: 1 },
  arancello: { name: "Casa del Mulino Arancello", price: 24.95, icon: "Sinaasappel", bottles: 1 },
  meloncello: { name: "Casa del Mulino Meloncello", price: 24.95, icon: "Meloen", bottles: 1 },
  duo: { name: "Duo Collectie", price: 47.50, icon: "Duo", bottles: 2, bundle: ["Casa del Mulino Limoncello", "Casa del Mulino Arancello"] },
  signature: { name: "Signature Collectie", price: 69.95, icon: "Collectie", bottles: 3, bundle: ["Limoncello", "Arancello", "Meloncello"] },
  mixmatch: { name: "Mix & Match Collectie", price: 47.50, icon: "Mix", bottles: 2, bundle: ["Kies zelf uw favoriete smaken"] }
};

let checkoutShippingCost = 6.95;
let checkoutFreeShippingFrom = 75;
let checkoutWhatsappNumber = "31636188895";
const checkoutSingleBottlePrice = 24.95;
const checkoutBundleOffers = [
  { key: "single", label: "Losse fles", bottles: 1, price: 24.95 },
  { key: "duo", label: "Duo Collection", bottles: 2, price: 47.50 },
  { key: "signature", label: "Signature Collection", bottles: 3, price: 69.95 }
];

const checkoutCurrency = (value) => new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" }).format(value);
const checkoutCart = () => JSON.parse(localStorage.getItem("cdm-cart") || "[]");
const checkoutBottleCount = (cart) => cart.reduce((sum, item) => sum + (checkoutProducts[item.key]?.bottles || 1) * item.quantity, 0);
const checkoutBestPricing = (bottleCount) => {
  const best = Array.from({ length: bottleCount + 1 }, () => ({ total: Infinity, offers: [] }));
  best[0] = { total: 0, offers: [] };
  for (let count = 1; count <= bottleCount; count += 1) {
    checkoutBundleOffers.forEach((offer) => {
      if (count >= offer.bottles && best[count - offer.bottles].total + offer.price < best[count].total) {
        best[count] = {
          total: best[count - offer.bottles].total + offer.price,
          offers: [...best[count - offer.bottles].offers, offer]
        };
      }
    });
  }
  const applied = best[bottleCount].offers.reduce((items, offer) => {
    items[offer.key] = items[offer.key] || { ...offer, quantity: 0 };
    items[offer.key].quantity += 1;
    return items;
  }, {});
  const originalTotal = bottleCount * checkoutSingleBottlePrice;
  const subtotal = Number((best[bottleCount].total || 0).toFixed(2));
  return {
    bottleCount,
    originalTotal,
    subtotal,
    saving: Math.max(0, Number((originalTotal - subtotal).toFixed(2))),
    appliedBundles: Object.values(applied)
  };
};
const checkoutPricing = (cart) => checkoutBestPricing(checkoutBottleCount(cart));
const checkoutSubtotal = (cart) => checkoutPricing(cart).subtotal;
const checkoutShipping = (subtotal) => subtotal > 0 && subtotal < checkoutFreeShippingFrom ? checkoutShippingCost : 0;

const fetchCheckoutJson = async (path) => {
  try {
    const response = await fetch(path, { cache: "no-store" });
    if (!response.ok) throw new Error(`CMS content missing: ${path}`);
    return await response.json();
  } catch (error) {
    return null;
  }
};

const applyCheckoutCmsContent = async () => {
  const [settings, products, collections] = await Promise.all([
    fetchCheckoutJson("content/settings.json"),
    fetchCheckoutJson("content/products.json"),
    fetchCheckoutJson("content/collections.json")
  ]);

  if (settings?.shipping) {
    checkoutShippingCost = Number(settings.shipping.cost ?? checkoutShippingCost);
    checkoutFreeShippingFrom = Number(settings.shipping.freeFrom ?? checkoutFreeShippingFrom);
  }
  if (settings?.whatsappNumber) checkoutWhatsappNumber = settings.whatsappNumber.replace(/\D/g, "");

  products?.products?.forEach((product) => {
    if (!product?.id) return;
    checkoutProducts[product.id] = {
      ...checkoutProducts[product.id],
      name: product.name || checkoutProducts[product.id]?.name,
      price: Number(product.price ?? checkoutProducts[product.id]?.price ?? 0),
      icon: product.flavor || checkoutProducts[product.id]?.icon
    };
  });

  collections?.collections?.forEach((collection) => {
    if (!collection?.id) return;
    checkoutProducts[collection.id] = {
      ...checkoutProducts[collection.id],
      name: collection.name || checkoutProducts[collection.id]?.name,
      price: Number(collection.price ?? checkoutProducts[collection.id]?.price ?? 0),
      bottles: Number(collection.bottles ?? checkoutProducts[collection.id]?.bottles ?? 1),
      bundle: collection.bundle || checkoutProducts[collection.id]?.bundle
    };
  });
};

const linesEl = document.querySelector("[data-checkout-lines]");
const subtotalEl = document.querySelector("[data-checkout-subtotal]");
const shippingEl = document.querySelector("[data-checkout-shipping]");
const totalEl = document.querySelector("[data-checkout-total]");
const form = document.querySelector("[data-whatsapp-checkout]");
const progress = document.querySelector("[data-shipping-progress]");
const message = document.querySelector("[data-shipping-message]");

const renderCheckout = () => {
  const cart = checkoutCart();
  const pricing = checkoutPricing(cart);
  const subtotal = pricing.subtotal;
  const shipping = checkoutShipping(subtotal);
  const total = subtotal + shipping;
  linesEl.innerHTML = cart.length ? cart.map((item) => {
    const product = checkoutProducts[item.key];
    return `<article class="checkout-line"><div><h3>${item.quantity} x ${product.name}</h3><p>${product.bundle ? product.bundle.join(", ") : "500 ml"}${item.giftWrap ? " - Luxe cadeauverpakking" : ""}</p>${item.message ? `<small>${item.message}</small>` : ""}</div><strong>${checkoutCurrency(product.price * item.quantity)}</strong></article>`;
  }).join("") : `<p>Uw winkelwagen is nog leeg.</p><a class="button secondary dark" href="bestellen.html">Terug naar bestellen</a>`;
  if (cart.length && pricing.appliedBundles.length) {
    linesEl.insertAdjacentHTML("beforeend", `
      <article class="checkout-line checkout-discount-line">
        <div>
          <h3>Automatisch bundelvoordeel</h3>
          <p>${pricing.appliedBundles.map((bundle) => `${bundle.quantity}x ${bundle.label}`).join(", ")}</p>
          ${pricing.saving > 0 ? `<small>Losse flessen: ${checkoutCurrency(pricing.originalTotal)}. Besparing: ${checkoutCurrency(pricing.saving)}.</small>` : ""}
        </div>
        <strong>${checkoutCurrency(subtotal)}</strong>
      </article>
    `);
  }
  subtotalEl.textContent = checkoutCurrency(subtotal);
  shippingEl.textContent = shipping ? checkoutCurrency(shipping) : "Gratis";
  totalEl.textContent = checkoutCurrency(total);
  if (progress) progress.style.width = `${Math.min(100, Math.round((subtotal / checkoutFreeShippingFrom) * 100))}%`;
  if (message) {
    message.textContent = subtotal >= checkoutFreeShippingFrom
      ? "Gefeliciteerd! Je bestelling wordt gratis verzonden."
      : subtotal > 0
        ? `Nog ${checkoutCurrency(checkoutFreeShippingFrom - subtotal)} tot gratis verzending.`
        : `Gratis verzending vanaf ${checkoutCurrency(checkoutFreeShippingFrom)}.`;
  }
};

const buildWhatsappMessage = (data) => {
  const cart = checkoutCart();
  const pricing = checkoutPricing(cart);
  const subtotal = pricing.subtotal;
  const shipping = checkoutShipping(subtotal);
  const total = subtotal + shipping;
  const orderLines = cart.map((item) => {
    const product = checkoutProducts[item.key];
    const gift = item.giftWrap ? "\nCadeauverpakking: Ja" : "";
    const note = item.message ? `\nPersoonlijke boodschap: ${item.message}` : "";
    return `${item.quantity} x ${product.name} - ${checkoutCurrency(product.price * item.quantity)}${gift}${note}`;
  }).join("\n\n");
  const bundleLines = pricing.appliedBundles.length
    ? `\n\nToegepast bundelvoordeel:\n${pricing.appliedBundles.map((bundle) => `${bundle.quantity} x ${bundle.label}`).join("\n")}${pricing.saving > 0 ? `\nBesparing t.o.v. losse flessen: ${checkoutCurrency(pricing.saving)}` : ""}`
    : "";
  return `Hallo!\n\nIk wil graag onderstaande bestelling plaatsen via Casa del Mulino.\n\nBestelling:\n\n${orderLines}${bundleLines}\n\nVerzendkosten: ${shipping ? checkoutCurrency(shipping) : "Gratis"}\nTotaal: ${checkoutCurrency(total)}\n\nMijn gegevens:\n\nNaam: ${data.get("voornaam")} ${data.get("achternaam")}\nAdres: ${data.get("straat")}\nPostcode: ${data.get("postcode")}\nPlaats: ${data.get("plaats")}\nTelefoon: ${data.get("telefoon")}\nE-mailadres: ${data.get("email")}\n\nIk ontvang graag verdere informatie over betaling en levering.\n\nBedankt!`;
};

form?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!checkoutCart().length) {
    alert("Uw winkelwagen is nog leeg.");
    return;
  }
  const data = new FormData(form);
  const url = `https://wa.me/${checkoutWhatsappNumber}?text=${encodeURIComponent(buildWhatsappMessage(data))}`;
  window.open(url, "_blank", "noopener");
  window.location.href = "bedankt-bestelling.html";
});

applyCheckoutCmsContent().then(renderCheckout);
