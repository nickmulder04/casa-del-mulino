Status: deels afgerond
Lokaal getest: ja, statische bestandscontrole uitgevoerd
Mobiel gecontroleerd: deels, responsive CSS gecontroleerd maar geen live browser beschikbaar
Advies: eerst visueel controleren in de browser, daarna door met de volgende update

# Update 03 - Merkverhaal, homepage-flow en kwaliteitscontrole

## 1. Wat is aangepast

De homepage is opnieuw opgebouwd rondom een duidelijker merkverhaal. De dubbele verhaalteksten zijn verwijderd en vervangen door een kortere, premium introductie:

- Van Mulder naar Mulino
- Nederlandse roots en Italiaanse inspiratie
- duidelijke knop naar het volledige verhaal

Direct na de huidige collectie is een donkere Fatto a Mano-sectie toegevoegd. Deze benadrukt het handwerk zonder opnieuw het volledige merkverhaal te herhalen.

De pagina Ons Verhaal is volledig vervangen door het aangeleverde verhaal uit Update 3. De tekst vertelt nu persoonlijker hoe Casa del Mulino begon, waarom het merk is ontstaan en hoe Mulder, Mulino, Nederlandse molens en Italiaanse likeurcultuur samenkomen.

Ook is een nieuwe pagina Smaakmaker toegevoegd. Deze interactieve keuzehulp helpt bezoekers ontdekken welke smaak of collectie het beste bij hen past.

Verder is de navigatie uitgebreid met Smaakmaker en zijn de relevante CMS/content-, sitemap- en Netlify-verwijzingen bijgewerkt.

## 2. Welke bestanden zijn gewijzigd

Belangrijkste gewijzigde of toegevoegde bestanden:

- `index.html`
- `ons-verhaal.html`
- `verhaal.html`
- `smaakmaker.html`
- `assets/css/styles.css`
- `assets/js/shop.js`
- `content/home.json`
- `content/pages.json`
- `content/footer.json`
- `netlify.toml`
- `sitemap.xml`
- meerdere HTML/CSS/JS/JSON-bestanden zijn gecontroleerd en opgeschoond voor tekstcodering

Nieuw controlebestand:

- `updates/update-03-merkverhaal-layout-kwaliteitscontrole.md`

## 3. Wat zie ik nu anders op de website

Op de homepage staat na de hero nu eerst een rustige merkroute:

Mulder -> Mulino -> Nederlandse molens -> Italiaanse inspiratie -> Handgemaakt -> Familie -> Genieten

Daarna volgt een compacte teaser "Van Mulder naar Mulino" met een knop naar Ons Verhaal.

Na de drie smaken staat nu een aparte donkere sectie "Fatto a Mano betekent: met de hand gemaakt." Deze sectie voelt meer als een merkbelofte en minder als herhaling van het verhaal.

De pagina Ons Verhaal is langer, persoonlijker en beter opgebouwd als echt merkverhaal.

De nieuwe pagina Smaakmaker is bereikbaar via de navigatie en helpt bezoekers interactief kiezen tussen Limoncello, Arancello, Meloncello, Signature Collection en Mix & Match Collection.

## 4. Welke pagina's moet ik controleren

Controleer vooral:

- `index.html`
- `ons-verhaal.html`
- `verhaal.html`
- `smaakmaker.html`
- `recepten.html`
- `bestellen.html`
- `contact.html`

Controleer op de homepage specifiek:

- of de volgorde logisch voelt;
- of de collectiekaarten zichtbaar blijven;
- of de donkere Fatto a Mano-sectie mooi aansluit;
- of de Instagram- en reviewsecties niet te dicht op vergelijkbare fotoblokken staan;
- of de nieuwe Smaakmaker-link werkt.

Controleer op mobiel:

- of de collectiekaarten onder elkaar staan;
- of tekst niet over foto's valt;
- of de Smaakmaker goed klikbaar is;
- of knoppen voldoende ruimte hebben.

## 5. Wat werkt lokaal in de browser

De volgende controles zijn uitgevoerd in de projectbestanden:

- alle JSON-contentbestanden lezen correct in;
- alle `/images/...` verwijzingen wijzen naar bestaande bestanden;
- alle interne HTML-links wijzen naar bestaande pagina's;
- de homepage bevat de juiste sectievolgorde;
- er zijn geen bekende mojibake/tekstcoderingstekens meer gevonden zoals `Ã`, `â` of `Â`;
- de receptenpagina bestaat en blijft gekoppeld aan de bestaande receptdata;
- de Smaakmaker-pagina is toegevoegd met werkende interne resultaatlogica.

## 6. Wat werkt nog niet of moet later nog worden verbeterd

In deze Codex-omgeving zijn `git` en `node` niet beschikbaar. Daardoor kon ik niet:

- een git-commit maken;
- naar GitHub pushen;
- een npm-build draaien;
- Netlify-deploy automatisch controleren.

De browser-plugin was in deze sessie niet bruikbaar door ontbrekende runtimebestanden. Daarom is de mobiele controle gedaan via code- en CSS-controle, niet via een echte visuele browserscreenshot.

Aanbevolen vervolgcontrole na upload naar GitHub:

- open de live homepage op desktop;
- open de live homepage op mobiel;
- controleer `/ons-verhaal.html`;
- controleer `/smaakmaker.html`;
- controleer of Netlify de redirect `/smaakmaker` naar `smaakmaker.html` goed verwerkt.

## 7. Advies: doorgaan of eerst controleren

Advies: eerst nakijken.

Deze update raakt de homepage-volgorde, het merkverhaal en een nieuwe interactieve pagina. De wijzigingen zijn inhoudelijk logisch en technisch gecontroleerd, maar verdienen een korte visuele controle in de browser voordat de volgende grote update wordt opgepakt.
