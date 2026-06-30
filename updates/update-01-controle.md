# Update 01 - Bundels en staffelkorting

Status: deels afgerond  
Lokaal getest: deels, via bestands- en rekencontroles  
Mobiel gecontroleerd: nee, browser-plugin was in deze sessie niet beschikbaar  
Advies: eerst nakijken in de browser voordat Update 02 wordt doorgevoerd

## 1. Wat is aangepast

- De oude bundelprijzen zijn vervangen:
  - 1 fles: €24,95
  - Duo Collection: €47,50
  - Signature Collection: €69,95
- De webshop berekent nu automatisch de voordeligste combinatie van losse flessen, Duo Collection en Signature Collection.
- De berekening werkt door voor hogere aantallen flessen, niet alleen voor 2 of 3 flessen.
- De winkelwagen toont toegepast bundelvoordeel.
- De checkout toont toegepast bundelvoordeel.
- Het WhatsApp-bestelbericht vermeldt toegepast bundelvoordeel en besparing.
- De bestelpagina toont dezelfde slimme prijsberekening in het besteloverzicht.
- Mix & Match Collectie is toegevoegd als derde premium collectieblok.
- Decap CMS-collecties hebben een extra veld `bottles`, zodat collecties later beter beheerd kunnen worden.

## 2. Welke bestanden zijn gewijzigd

- `assets/js/shop.js`
- `assets/js/checkout.js`
- `assets/js/order.js`
- `assets/js/cms-page.js`
- `assets/css/styles.css`
- `content/collections.json`
- `admin/config.yml`
- `index.html`
- `bestellen.html`
- `updates/update-01-controle.md`

## 3. Wat zie ik nu anders op de website

- Op de homepage staat bij Exclusieve Collecties nu ook een derde blok: Mix & Match Collectie.
- Duo Collectie toont €47,50.
- Signature Collectie toont €69,95.
- Mix & Match toont:
  - 2 flessen €47,50
  - 3 flessen €69,95
- In de winkelwagen verschijnt een rustig blok met automatisch toegepast bundelvoordeel.
- De losse-flessenprijs wordt doorgestreept getoond wanneer er voordeel is.
- De besparing wordt apart vermeld.
- De bundels worden niet als schreeuwerige korting gepresenteerd, maar als premium bundelvoordeel.

## 4. Welke pagina's moet ik controleren

- `index.html`
  - Controleer de sectie Exclusieve Collecties.
  - Controleer of drie collectiekaarten zichtbaar zijn.
- `bestellen.html`
  - Controleer de drie collectieblokken.
  - Voeg 1 t/m 9 flessen toe met de plusknoppen.
  - Controleer of het besteloverzicht de juiste bundelprijs toont.
- De zwevende winkelwagen
  - Voeg losse flessen toe via productpagina's of collectieknoppen.
  - Controleer toegepast bundelvoordeel.
- `checkout.html`
  - Controleer of de bundelprijs en besparing doorlopen naar de checkout.
  - Controleer of het WhatsApp-bericht logisch opgebouwd is.

## 5. Wat werkt lokaal in de browser

Niet volledig browsermatig getest in deze sessie. De browser-plugin mistte het benodigde `browser-client.mjs` bestand en kon daardoor niet worden gestart.

Wel lokaal gecontroleerd:

- Alle JSON-bestanden in `content/` parsen correct.
- Alle `/images/...` verwijzingen bestaan lokaal.
- De bundelprijsberekening is getest voor 1 t/m 9 flessen:
  - 1 fles = €24,95
  - 2 flessen = €47,50
  - 3 flessen = €69,95
  - 4 flessen = €94,90
  - 5 flessen = €117,45
  - 6 flessen = €139,90
  - 7 flessen = €164,85
  - 8 flessen = €187,40
  - 9 flessen = €209,85

## 6. Wat werkt nog niet of moet later nog worden verbeterd

- De browsercontrole op desktop en mobiel moet nog visueel worden gedaan.
- Update 02 moet de drie collectieblokken verder visueel gelijk trekken als dat na controle nodig blijkt.
- De bestelpagina gebruikt nog een los besteloverzicht naast de winkelwagen. Dat kan in Update 08 verder worden samengebracht tot een nog vloeiendere checkout-ervaring.
- De Mix & Match Collection heeft nu een knop naar de bestelproducten. Een latere uitbreiding kan hier een echte configurator van maken.

## 7. Advies: doorgaan of eerst controleren

Eerst controleren.

Deze update raakt prijzen, winkelwagen, checkout en collectieblokken. Controleer daarom eerst lokaal of:

- drie collectieblokken netjes zichtbaar zijn;
- de slimme prijsberekening klopt;
- winkelwagen en checkout de besparing premium tonen;
- mobiel niets over elkaar valt.

