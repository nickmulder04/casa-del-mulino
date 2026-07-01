# Casa del Mulino

Premium statische merkwebsite voor Casa del Mulino, voorbereid voor Netlify, GitHub, Vercel en Decap CMS.

## Officiële bron

De enige bron van waarheid voor dit project is:

```text
https://github.com/nickmulder04/casa-del-mulino
```

Gebruik geen Netlify Drop deployments meer. Alle wijzigingen horen via GitHub naar Netlify te gaan.

## Techniek

- HTML, CSS en JavaScript zonder framework.
- Decap CMS voor contentbeheer via Git.
- Content staat in `content/*.json`.
- Uploads uit het CMS komen in `public/images` en zijn publiek bereikbaar via `/images/...`.
- De site heeft fallback-content in de code, zodat ontbrekende CMS-content geen kapotte pagina's veroorzaakt.

## Lokaal starten

Installeer Node.js 18 of hoger.

```bash
npm install
npm run build
npm run dev
```

Open daarna de lokale URL die `serve` toont.

## CMS lokaal testen

Voor lokaal Decap CMS beheer:

```bash
npm run cms:local
npm run dev
```

Open vervolgens:

```text
http://localhost:3000/admin/
```

De exacte poort kan verschillen, afhankelijk van `serve`.

## Content aanpassen

Na deployment op Netlify is het CMS beschikbaar op:

```text
https://jouwdomein.nl/admin/
```

In het CMS kunnen zonder code worden beheerd:

- Producten, prijzen, foto's, inhoud, beschikbaarheid en batchinformatie.
- Collecties zoals Duo Collectie en Signature Collectie.
- Recepten, ingredienten, bereidingswijze en serveertips.
- FAQ, reviews, pagina's en footerlinks.
- Verzendkosten en gratis-verzenddrempel.
- Muziekbestand, albumafbeelding en actieve status.
- Contactgegevens, WhatsApp-nummer en SEO-teksten.

## Netlify deployment

1. Push deze projectmap naar `nickmulder04/casa-del-mulino`.
2. Maak in Netlify een nieuwe site vanaf deze GitHub-repository.
3. Gebruik deze instellingen:
   - Build command: `npm run build`
   - Publish directory: `.`
4. Zet Netlify Identity aan.
5. Zet Git Gateway aan.
6. Nodig de beheerder uit via Identity.
7. Ga naar `/admin/` en log in.

`netlify.toml` bevat de buildinstellingen, caching headers en de 404 fallback.

## Domeinen

Gebruik `casadelmulino.nl` als hoofddomein.

Koppel daarnaast `cellodelmulino.nl` als alias/domein in Netlify. In `netlify.toml` staat een 301 redirect waardoor bezoekers van `cellodelmulino.nl` worden doorgestuurd naar `casadelmulino.nl`.

## CMS toegang

De beheeromgeving staat na publicatie op:

```text
https://casadelmulino.nl/admin/
```

Voor toegang:

1. Zet Netlify Identity aan.
2. Zet Git Gateway aan.
3. Zet registratie bij voorkeur op invite-only.
4. Nodig jezelf uit als beheerder.
5. Log in via `/admin/`.

Alle uploads uit het CMS worden opgeslagen in `public/images` en zijn publiek bereikbaar via `/images/...`.

## GitHub

Het project is klaar om naar GitHub te pushen. Gevoelige gegevens horen niet in de code, maar in Netlify/Vercel environment variables of lokaal in `.env`.

Aanbevolen eerste commit:

```bash
git init
git branch -M main
git remote add origin https://github.com/nickmulder04/casa-del-mulino.git
git add .
git commit -m "Build Casa del Mulino website with Decap CMS"
git push -u origin main
```

Als de repository al lokaal bestaat:

```bash
git remote set-url origin https://github.com/nickmulder04/casa-del-mulino.git
git add .
git commit -m "Build Casa del Mulino website with Decap CMS"
git push origin main
```

Belangrijke bestanden:

- `.gitignore`
- `.env.example`
- `README.md`
- `netlify.toml`
- `admin/config.yml`
- `content/*.json`

Niet committen:

- `netlify-upload/`
- `.env`
- `.netlify/`
- `.vercel/`

## Vercel later

De site gebruikt geen verplichte Netlify-only frontendcode. Voor Vercel:

- Framework preset: Other
- Build command: `npm run build`
- Output directory: `.`

Let op: Decap CMS met `git-gateway` is Netlify-specifiek. Als de site later volledig naar Vercel verhuist, kies dan voor een GitHub OAuth backend voor Decap CMS of stap over op een headless CMS zoals Sanity of Contentful. De contentstructuur blijft bruikbaar.

## Environment variables

Voor nu zijn er geen geheime environment variables nodig. Gebruik `.env.example` als documentatie voor toekomstige waarden.

## Buildcheck

`npm run build` genereert automatisch receptpagina's uit `content/recipes.json`, schrijft de fallback dataset `assets/js/recipe-data.js`, maakt `sitemap.xml` voor `https://casadelmulino.nl` en valideert daarna alle JSON-contentbestanden. De website blijft snel omdat er geen zware bundler nodig is.

Op deze lokale Windows-omgeving moet Node.js beschikbaar zijn om deze buildcheck uit te voeren. Netlify gebruikt de Node-versie uit `package.json` en draait dezelfde build automatisch bij publicatie.

