# Casa del Mulino CMS-status

Laatste update: 2026-06-28

## Afgerond

- Decap CMS bereikbaar via `/admin/`.
- Backend ingesteld op Netlify Identity + Git Gateway (`git-gateway`, branch `main`).
- Hoofddomein ingesteld op `casadelmulino.nl`.
- `cellodelmulino.nl` vastgelegd als doorverwijsdomein in content/settings en Netlify redirect.
- Generieke CMS-overridescript toegevoegd (`assets/js/cms-page.js`) voor basis-hero/SEO/contact/legal content.
- Homepagina, juridische pagina's, Instagram-sectie en masterclass/proeverij-pagina's worden runtime uit CMS JSON opgebouwd waar de bestaande DOM-structuur dit ondersteunt.
- Uploads via CMS gaan naar `public/images` en zijn bereikbaar via `/images/...`.
- CMS-contentbestanden aangemaakt voor:
  - instellingen
  - producten
  - collecties
  - recepten
  - FAQ
  - reviews
  - pagina's
  - footer
  - home
  - ons verhaal
  - limited editions
  - cadeaupakketten
  - masterclasses
  - proeverijen
  - Instagram
  - contact
  - juridische content
  - SEO
- Producten hebben CMS-velden voor naam, subtitel, prijs, alcoholpercentage, inhoud, voorraadstatus, afbeeldingen, ingrediënten, serveertips, kleuraccent, collectie en SEO.
- Recepten hebben CMS-velden en automatische pagina-generatie via `tools/build-recipes.mjs`.
- Fallback receptdata wordt automatisch gegenereerd vanuit `content/recipes.json` via `tools/build-recipe-data.mjs`.
- Sitemap wordt automatisch gegenereerd via `tools/build-sitemap.mjs` met `https://casadelmulino.nl` als hoofddomein.
- Eenvoudige pagina's met `.text-page` kunnen generiek contentblokken uit `content/pages.json` renderen.
- Winkelwagen, checkout, producten, collecties, recepten, footer, muziek en verzendinstellingen zijn deels runtime-gekoppeld aan CMS JSON.

## Nog open

- Alle hardcoded pagina-inhoud volledig vervangen door CMS-rendering.
- Homepagina-secties verder uitbreiden naar volledige sectie-volgorde/buttons/video's vanuit `content/home.json`.
- Contactpagina verder uitbreiden naar volledige CMS-rendering van alle contactblokken.
- Generieke CMS-pagina-renderer uitbreiden voor nieuwe pagina's zonder bestaand HTML-bestand.
- Lokale Node-validatie uitvoeren zodra Node beschikbaar is (`npm run build`). Netlify voert dit tijdens deployment automatisch uit.

## Werkwijze volgende sessie

1. Lees dit bestand.
2. Controleer welke open punten inmiddels zijn afgerond.
3. Ga verder met het eerstvolgende open punt.
4. Herhaal geen afgeronde onderdelen.
