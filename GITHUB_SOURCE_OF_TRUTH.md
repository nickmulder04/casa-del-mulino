# Casa del Mulino - GitHub als bron van waarheid

Laatste update: 2026-06-28

## Nieuwe projectregel

De officiële broncode van Casa del Mulino staat voortaan uitsluitend in:

`nickmulder04/casa-del-mulino`

Netlify Drop deployments worden niet meer gebruikt. Netlify moet publiceren vanuit GitHub.

## Domeinen

- Hoofddomein: `casadelmulino.nl`
- Redirect-domein: `cellodelmulino.nl` naar `https://casadelmulino.nl`

## Gewenste deployment-flow

1. Wijzigingen worden in GitHub gecommit.
2. Netlify is gekoppeld aan `nickmulder04/casa-del-mulino`.
3. Netlify draait `npm run build`.
4. Netlify publiceert de output uit de projectroot (`.`).
5. Decap CMS schrijft wijzigingen terug naar dezelfde GitHub-repository via Netlify Identity + Git Gateway.

## Decap CMS

Beheeromgeving:

`https://casadelmulino.nl/admin/`

Backend:

- `git-gateway`
- branch: `main`
- toegang via Netlify Identity
- registratie invite-only

## Belangrijke content

Alle beheerbare content hoort in `content/*.json`.

Minimaal CMS-gestuurd:

- Homepagina
- Ons verhaal
- Producten
- Collecties
- Recepten
- FAQ
- Reviews
- Contact
- Footer
- Juridische pagina's
- SEO
- Algemene instellingen
- Verzendkosten
- Muziek
- WhatsApp-nummer

## Huidige blokkade in deze Codex-sessie

De repository `nickmulder04/casa-del-mulino` is volgens de gebruiker nu public en officieel.

Deze sessie kan echter nog niet rechtstreeks committen of pushen, omdat:

- `git`, `gh`, `node` en `npm` op deze Windows-omgeving niet beschikbaar zijn in PATH;
- netwerktoegang vanuit PowerShell naar GitHub in deze sandbox faalt;
- sandbox-escalatie voor netwerk/git-acties in deze sessie niet beschikbaar is.

Daardoor kan Codex op dit moment niet:

- de officiële repository clonen;
- de bestaande remote controleren;
- een commit maken;
- naar GitHub pushen;
- lokaal `npm run build` uitvoeren.

## Nodig om verder te gaan

Kies een van deze routes:

1. Installeer Git en Node.js op deze machine en zorg dat `git`, `node` en `npm` in PATH staan.
2. Kloon de repo lokaal in deze workspace of geef Codex een sessie met GitHub-netwerktoegang.
3. Gebruik `GITHUB_DEPLOYMENT_CHECKLIST.md` voor de eerste push en Netlify-koppeling.

Daarna kan Codex verder met:

1. Officiële repo ophalen.
2. Projectstructuur opnieuw opbouwen in die repo.
3. Decap CMS configureren.
4. Netlify-configuratie controleren.
5. Domeinredirects vastleggen.
6. Build draaien.
7. Commit maken.
8. Pushen naar GitHub.

## Belangrijk

Vanaf dit punt mag `netlify-upload/` niet meer als publicatiebron worden gebruikt. Die map kan later worden verwijderd zodra de GitHub-repository correct is gekoppeld aan Netlify.
