# Update 02 - Homepagevolgorde, reviews, Instagram en merkverhaal

Status: deels afgerond  
Lokaal getest: deels, via bestands-, link- en contentcontroles  
Mobiel gecontroleerd: nee, browser-plugin was in deze sessie niet beschikbaar  
Advies: homepage eerst visueel controleren op desktop en mobiel

## 1. Welke onderdelen zijn aangepast

- De homepage is opnieuw geordend zodat de flow minder repetitief is.
- De uitgebreide merkverhaaltekst is van de homepage gehaald.
- De homepage bevat nu een korte teaser:
  - `Van Mulder naar Mulino`
  - knop naar `ons-verhaal.html`
- Er is een nieuwe homepage-teaser toegevoegd:
  - `Onze Belofte`
  - knop naar `onze-belofte.html`
- Reviews zijn persoonlijker gemaakt:
  - maximaal drie reviews op de homepage;
  - sterren;
  - naam;
  - korte ervaring;
  - favoriete smaak/collectie;
  - kleine ronde profielfoto met bestaand Casa del Mulino logo.
- Instagram is verplaatst zodat het niet direct aansluit op een zware fotogalerij.
- Er is een serveertips-teaser toegevoegd:
  - `Hoe serveer je Casa del Mulino?`
  - knop naar `serveren.html`
- Er zijn drie pagina's toegevoegd of vernieuwd:
  - `ons-verhaal.html`
  - `onze-belofte.html`
  - `serveren.html`
- De bestaande `verhaal.html` is vervangen door de nieuwe, rustigere verhaalopbouw zodat oude links niet naar dubbele oude tekst blijven gaan.

## 2. Welke bestanden zijn gewijzigd

- `index.html`
- `ons-verhaal.html`
- `onze-belofte.html`
- `serveren.html`
- `verhaal.html`
- `assets/css/styles.css`
- `assets/js/shop.js`
- `assets/js/cms-page.js`
- `content/home.json`
- `content/pages.json`
- `content/footer.json`
- `admin/config.yml`
- `netlify.toml`
- `sitemap.xml`
- `updates/update-02-merkverhaal.md`

## 3. Wat zie ik nu anders op de website

- De homepage voelt meer als een route:
  1. Hero
  2. Huidige collectie
  3. Exclusieve Collecties
  4. Korte merkverhaal-teaser
  5. Onze Belofte
  6. Ambacht en bewaaradvies
  7. Galerij
  8. FAQ
  9. Reviews
  10. Serveertips
  11. Instagram
  12. Bestellen, handgemaakt, proeverijen en contact
- De homepage vertelt niet langer meerdere keren hetzelfde uitgebreide merkverhaal.
- `Ons Verhaal` is nu een aparte redactionele pagina.
- `Onze Belofte` is nu een aparte, rustige merkpagina.
- Reviews voelen minder generiek en meer persoonlijk.
- Instagram staat later in de paginaflow en heeft een duidelijker doel.

## 4. Wat moet ik controleren

Controleer op desktop en mobiel:

- Homepage:
  - Is de volgorde prettig om doorheen te scrollen?
  - Voelt de overgang van collecties naar verhaal logisch?
  - Voelen reviews persoonlijker en premium?
  - Staat Instagram niet te dicht op andere grote fotoblokken?
- `ons-verhaal.html`:
  - Klopt de toon?
  - Is het verhaal persoonlijk genoeg zonder verkooppraat te worden?
- `onze-belofte.html`:
  - Voelt deze pagina anders dan het verhaal?
  - Zijn de vijf beloftes duidelijk?
- `serveren.html`:
  - Werkt de knop vanaf de homepage?
  - Zijn de serveertips helder en premium?

## 5. Wat werkt lokaal in de browser

Browsercontrole kon niet betrouwbaar worden uitgevoerd in deze sessie:

- De in-app browser-plugin mistte het benodigde `browser-client.mjs` bestand.
- Headless Chrome gaf geen bruikbare DOM-uitvoer terug.

Wel lokaal gecontroleerd:

- Alle JSON-bestanden in `content/` parsen correct.
- Alle `/images/...` verwijzingen bestaan lokaal.
- Alle interne `.html` links verwijzen naar bestaande bestanden.
- De nieuwe pagina's bestaan in de projectmap.
- Netlify redirects zijn toegevoegd voor:
  - `/ons-verhaal`
  - `/onze-belofte`
  - `/serveren`

## 6. Wat werkt nog niet of moet later nog worden verbeterd

- De pagina's `ons-verhaal.html`, `onze-belofte.html` en `serveren.html` zijn klaar als statische premium pagina's, maar kunnen later nog verder CMS-gestuurd worden gemaakt per sectie.
- De homepage heeft nog een grote galerij. Als de pagina na visuele controle nog te fotovol voelt, kan Update 03 of een latere update de galerij compacter maken of naar een aparte pagina verplaatsen.
- De reviewpagina zelf is nog niet opnieuw opgebouwd in dezelfde premium-reviewstijl; deze update ging alleen over de homepage-reviews.

## 7. Advies: doorgaan of eerst controleren

Eerst controleren.

Deze update verandert de verhaallijn van de homepage. Bekijk vooral of de homepage nu natuurlijker aanvoelt en of de nieuwe pagina's de juiste toon hebben. Als dit goed staat, kan de volgende grote update doorgaan.

