const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");
const reveals = document.querySelectorAll(".reveal");
const lightbox = document.querySelector("[data-lightbox-modal]");
const loader = document.querySelector("[data-loader]");
const parallaxItems = document.querySelectorAll("[data-parallax]");
const imageFallback = "/images/casa-del-mulino-official-logo.jpg";

const revealCriticalHomepageCards = () => {
  document.querySelectorAll("#collectie .product-card, .exclusive-collections .collection-bundle").forEach((card) => {
    card.classList.add("in-view");
    card.style.visibility = "visible";
  });
};

document.addEventListener("error", (event) => {
  const image = event.target;
  if (!(image instanceof HTMLImageElement) || image.dataset.fallbackApplied === "true") return;
  image.dataset.fallbackApplied = "true";
  image.classList.add("image-fallback");
  image.src = imageFallback;
}, true);

window.addEventListener("load", () => {
  if (loader) {
    window.setTimeout(() => loader.classList.add("is-hidden"), 350);
  }
  revealCriticalHomepageCards();
});

if (header) {
  const setHeader = () => header.classList.toggle("scrolled", window.scrollY > 28);
  setHeader();
  window.addEventListener("scroll", setHeader, { passive: true });
}

if (nav && navToggle) {
  navToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  reveals.forEach((el) => observer.observe(el));
} else {
  reveals.forEach((el) => el.classList.add("in-view"));
}

revealCriticalHomepageCards();

let ticking = false;
const updateParallax = () => {
  const scrollY = window.scrollY;
  parallaxItems.forEach((item) => {
    const speed = Number(item.dataset.parallax || 0);
    item.style.transform = `translate3d(0, ${scrollY * speed}px, 0) scale(1.04)`;
  });
  ticking = false;
};

if (parallaxItems.length && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  window.addEventListener("scroll", () => {
    if (!ticking) {
      window.requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }, { passive: true });
}

document.querySelectorAll("[data-lightbox]").forEach((item) => {
  item.addEventListener("click", () => {
    if (!lightbox) return;
    const image = lightbox.querySelector("img");
    image.src = item.dataset.lightbox;
    image.alt = item.querySelector("img")?.alt || "";
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
  });
});

if (lightbox) {
  const close = () => {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    lightbox.querySelector("img").removeAttribute("src");
  };
  lightbox.querySelector("[data-lightbox-close]").addEventListener("click", close);
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) close();
  });
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && lightbox.classList.contains("open")) close();
  });
}
