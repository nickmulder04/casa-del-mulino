# GitHub deployment checklist

Gebruik deze checklist voor de eerste publicatie vanuit de officiële repository.

## Repository

- Repository: `nickmulder04/casa-del-mulino`
- Branch: `main`
- Publicatie loopt via Netlify Git integration
- Netlify Drop wordt niet meer gebruikt

## Lokaal vereist

- Git
- Node.js 18 of hoger
- npm

Controle:

```bash
git --version
node --version
npm --version
```

## Eerste push

```bash
git init
git branch -M main
git remote add origin https://github.com/nickmulder04/casa-del-mulino.git
npm install
npm run build
git add .
git commit -m "Build Casa del Mulino website with Decap CMS"
git push -u origin main
```

## Netlify

Maak of koppel een Netlify-site aan:

```text
nickmulder04/casa-del-mulino
```

Instellingen:

- Build command: `npm run build`
- Publish directory: `.`
- Production branch: `main`

## Decap CMS

Zet in Netlify aan:

- Identity
- Git Gateway
- Registration: invite-only

Admin URL:

```text
https://casadelmulino.nl/admin/
```

## Domeinen

Koppel in Netlify:

- `casadelmulino.nl` als primair domein
- `cellodelmulino.nl` als alias

`netlify.toml` bevat de redirect van `cellodelmulino.nl` naar `casadelmulino.nl`.

## Na publicatie controleren

- `https://casadelmulino.nl`
- `https://casadelmulino.nl/admin/`
- `https://cellodelmulino.nl` redirect naar hoofddomein
- Producten laden uit `content/products.json`
- CMS uploads komen in `public/images` en zijn bereikbaar via `/images/...`
- `sitemap.xml` bevat `https://casadelmulino.nl`

