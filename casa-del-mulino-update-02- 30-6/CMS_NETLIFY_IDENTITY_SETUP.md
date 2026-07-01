# Decap CMS en Netlify Identity

Gebruik voor beheer altijd:

https://casadelmulino.nl/admin/

## Netlify instellingen

Controleer in Netlify bij de gekoppelde site:

1. Identity is ingeschakeld.
2. Registration staat bij voorkeur op `Invite only`.
3. Git Gateway is ingeschakeld en gekoppeld aan `nickmulder04/casa-del-mulino`.
4. De branch voor Git Gateway is `main`.
5. De production/site URL is `https://casadelmulino.nl`.
6. `cellodelmulino.nl` en `www.casadelmulino.nl` verwijzen door naar `https://casadelmulino.nl`.

## Invite of wachtwoord reset

Als invite- of resetlinks op de homepage uitkomen, stuurt de website tokens automatisch door naar `/admin/`.

Gebruik bij aangepaste Netlify e-mailtemplates bij voorkeur admin-links:

- Invite: `https://casadelmulino.nl/admin/#invite_token={{ .Token }}`
- Password recovery: `https://casadelmulino.nl/admin/#recovery_token={{ .Token }}`

## Decap CMS configuratie

`admin/config.yml` gebruikt:

```yml
backend:
  name: git-gateway
  branch: main
```

Gebruik live geen `local_backend`.

## Test na deploy

1. Ga naar `https://casadelmulino.nl/admin/`.
2. Log in met de uitgenodigde Identity-gebruiker.
3. Open Producten en wijzig tijdelijk een tekst.
4. Sla op en controleer of Decap CMS een commit naar GitHub maakt.
5. Controleer daarna of Netlify automatisch opnieuw deployt.

