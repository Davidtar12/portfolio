# david-tarazona.vercel.app

One-page portfolio for **David Tarazona** — investigative journalist, due-diligence
researcher, and builder of bilingual research desks.

Live: <https://david-tarazona.vercel.app>

## Stack

- Static HTML, CSS and vanilla JS. No framework, no build step, no dependencies.
- Fonts self-hosted: [Source Serif 4](https://fonts.google.com/specimen/Source+Serif+4) and
  [Source Sans 3](https://fonts.google.com/specimen/Source+Sans+3), both SIL Open Font License
  (license texts in `assets/fonts/`).
- Light and dark themes (system preference + manual toggle, remembered in `localStorage`).
- Responsive from 320px up, keyboard accessible, honours `prefers-reduced-motion`.

## Layout

```
index.html              all page content
robots.txt
sitemap.xml
vercel.json             security headers + cache policy
assets/
  css/styles.css        tokens, typography, layout
  js/theme.js           theme applied before first paint
  js/main.js            nav, scroll progress, reveal, section spy
  fonts/                woff2 subsets + OFL licences
  img/                  portrait (600/1200), og.png, favicon.svg, apple-touch-icon
```

## Local preview

```powershell
python -m http.server 8080 --directory .
# http://localhost:8080
```

## Deploy

Vercel deploys every push to `main`. Manual production deploy:

```powershell
vercel --prod
```

## Security

`vercel.json` sets:

- Content-Security-Policy — `default-src 'self'`, no inline styles, and a SHA-256 hash
  allowing only the JSON-LD block in `index.html`
- `Strict-Transport-Security`, `X-Content-Type-Options`, `X-Frame-Options: DENY`,
  `Referrer-Policy`, `Permissions-Policy`, `Cross-Origin-Opener-Policy`

No analytics, no cookies, no third-party requests, no secrets, no published email address.
The CV/phone number are deliberately not published — inbound contact routes through LinkedIn
(and GitHub), so the inbox stays out of scrapers' reach.

> If you edit the `<script type="application/ld+json">` block, recompute the hash in
> `vercel.json` (`script-src`). The rest of the page is unaffected; the browser only
> drops the structured-data block.

## Editing content

All copy lives in `index.html`. Sections are marked by `id`: `work`, `investigations`,
`desk`, `about`, `contact`. Keep the JSON-LD `Person` block in sync with the hero and
`meta` description.
