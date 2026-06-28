let checkoutProducts = {
  limoncello: { name: "Casa del Mulino Limoncello", price: 24.95, icon: "Citroen" },
  arancello: { name: "Casa del Mulino Arancello", price: 24.95, icon: "Sinaasappel" },
  meloncello: { name: "Casa del Mulino Meloncello", price: 24.95, icon: "Meloen" },
  duo: { name: "Duo Collectie", price: 45, icon: "Duo", bundle: ["Kies zelf twee flessen"] },
  signature: { name: "Signature Collectie", price: 65, icon: "Collectie", bundle: ["Limoncello", "Arancello", "Meloncello"] }
};

let checkoutShippingCost = 6.95;
let checkoutFreeShippingFrom = 75;
let checkoutWhatsappNumber = "31636188895";

const checkoutCurrency = (value) => new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" }).format(value);
const checkoutCart = () => JSON.parse(localStorage.getItem("cdm-cart") || "[]");
const checkoutSubtotal = (cart) => cart.reduce((sum, item) => sum + (checkoutProducts[item.key]?.price || 0) * item.quantity, 0);
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
  const subtotal = checkoutSubtotal(cart);
  const shipping = checkoutShipping(subtotal);
  const total = subtotal + shipping;
  linesEl.innerHTML = cart.length ? cart.map((item) => {
    const product = checkoutProducts[item.key];
    return `<article class="checkout-line"><div><h3>${item.quantity} x ${product.name}</h3><p>${product.bundle ? product.bundle.join(", ") : "500 ml"}${item.giftWrap ? " - Luxe cadeauverpakking" : ""}</p>${item.message ? `<small>${item.message}</small>` : ""}</div><strong>${checkoutCurrency(product.price * item.quantity)}</strong></article>`;
  }).join("") : `<p>Uw winkelwagen is nog leeg.</p><a class="button secondary dark" href="bestellen.html">Terug naar bestellen</a>`;
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
  const subtotal = checkoutSubtotal(cart);
  const shipping = checkoutShipping(subtotal);
  const total = subtotal + shipping;
  const orderLines = cart.map((item) => {
    const product = checkoutProducts[item.key];
    const gift = item.giftWrap ? "\nCadeauverpakking: Ja" : "";
    const note = item.message ? `\nPersoonlijke boodschap: ${item.message}` : "";
    return `${item.quantity} x ${product.name} - ${checkoutCurrency(product.price * item.quantity)}${gift}${note}`;
  }).join("\n\n");
  return `Hallo!\n\nIk wil graag onderstaande bestelling plaatsen via Casa del Mulino.\n\nBestelling:\n\n${orderLines}\n\nVerzendkosten: ${shipping ? checkoutCurrency(shipping) : "Gratis"}\nTotaal: ${checkoutCurrency(total)}\n\nMijn gegevens:\n\nNaam: ${data.get("voornaam")} ${data.get("achternaam")}\nAdres: ${data.get("straat")}\nPostcode: ${data.get("postcode")}\nPlaats: ${data.get("plaats")}\nTelefoon: ${data.get("telefoon")}\nE-mailadres: ${data.get("email")}\n\nIk ontvang graag verdere informatie over betaling en levering.\n\nBedankt!`;
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
