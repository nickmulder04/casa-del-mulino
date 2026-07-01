const formatCurrency = (value) => new Intl.NumberFormat("nl-NL", {
  style: "currency",
  currency: "EUR"
}).format(value);

const cards = [...document.querySelectorAll(".order-card")];
const lines = document.querySelector("[data-summary-lines]");
const subtotalEl = document.querySelector("[data-subtotal]");
const shippingEl = document.querySelector("[data-shipping]");
const totalEl = document.querySelector("[data-total]");
const form = document.querySelector("[data-checkout-form]");
const shipping = 6.95;
const freeShippingFrom = 75;
const singleBottlePrice = 24.95;
const bundleOffers = [
  { key: "single", label: "Losse fles", bottles: 1, price: 24.95 },
  { key: "duo", label: "Duo Collection", bottles: 2, price: 47.50 },
  { key: "signature", label: "Signature Collection", bottles: 3, price: 69.95 }
];

const calculateBestPricing = (bottleCount) => {
  const best = Array.from({ length: bottleCount + 1 }, () => ({ total: Infinity, offers: [] }));
  best[0] = { total: 0, offers: [] };

  for (let count = 1; count <= bottleCount; count += 1) {
    bundleOffers.forEach((offer) => {
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

  const originalTotal = bottleCount * singleBottlePrice;
  const subtotal = Number((best[bottleCount].total || 0).toFixed(2));
  return {
    subtotal,
    originalTotal,
    saving: Math.max(0, Number((originalTotal - subtotal).toFixed(2))),
    appliedBundles: Object.values(applied)
  };
};

const updateSummary = () => {
  const selected = cards.map((card) => {
    const quantity = Number(card.querySelector("output").textContent);
    return {
      name: card.querySelector("h2").textContent,
      quantity,
      price: Number(card.dataset.price)
    };
  }).filter((item) => item.quantity > 0);

  const bottleCount = selected.reduce((sum, item) => sum + item.quantity, 0);
  const pricing = calculateBestPricing(bottleCount);
  const subtotal = pricing.subtotal;
  lines.innerHTML = selected.length
    ? selected.map((item) => `<p><span>${item.quantity}x ${item.name}</span><strong>${formatCurrency(item.quantity * item.price)}</strong></p>`).join("")
    : "<p>Nog geen flessen gekozen.</p>";

  if (selected.length && pricing.appliedBundles.length) {
    lines.insertAdjacentHTML("beforeend", `
      <div class="summary-bundle-benefit">
        <p class="eyebrow">Automatisch bundelvoordeel</p>
        <ul>${pricing.appliedBundles.map((bundle) => `<li>${bundle.quantity}x ${bundle.label}</li>`).join("")}</ul>
        ${pricing.saving > 0 ? `<p><span>Losse flessen</span><s>${formatCurrency(pricing.originalTotal)}</s></p><p><span>U bespaart</span><strong>${formatCurrency(pricing.saving)}</strong></p>` : ""}
      </div>
    `);
  }

  subtotalEl.textContent = formatCurrency(subtotal);
  const shippingCost = subtotal > 0 && subtotal < freeShippingFrom ? shipping : 0;
  shippingEl.textContent = shippingCost ? formatCurrency(shippingCost) : "Gratis";
  totalEl.textContent = formatCurrency(subtotal > 0 ? subtotal + shippingCost : 0);
  document.querySelectorAll("[data-shipping-message]").forEach((el) => {
    el.textContent = subtotal >= freeShippingFrom
      ? "Gefeliciteerd! Je bestelling wordt gratis verzonden."
      : subtotal > 0
        ? `Nog ${formatCurrency(freeShippingFrom - subtotal)} tot gratis verzending.`
        : `Gratis verzending vanaf ${formatCurrency(freeShippingFrom)}.`;
  });
  document.querySelectorAll("[data-shipping-progress]").forEach((el) => {
    el.style.width = `${Math.min(100, Math.round((subtotal / freeShippingFrom) * 100))}%`;
  });
};

cards.forEach((card) => {
  const output = card.querySelector("output");
  card.querySelector("[data-minus]").addEventListener("click", () => {
    output.textContent = Math.max(0, Number(output.textContent) - 1);
    updateSummary();
  });
  card.querySelector("[data-plus]").addEventListener("click", () => {
    output.textContent = Number(output.textContent) + 1;
    updateSummary();
  });
});

if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const hasBottle = cards.some((card) => Number(card.querySelector("output").textContent) > 0);
    if (!hasBottle) {
      alert("Kies minimaal één fles voordat je de bestelling plaatst.");
      return;
    }
    alert("De webshop is momenteel in ontwikkeling. Binnenkort kunt u hier rechtstreeks bestellen.");
  });
}

updateSummary();

