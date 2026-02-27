# Times Table Quiz Playground

A static web quiz service to help learners memorize multiplication tables through repetition, challenge timing, and mistake-focused review.

## Features
- V2 game-first UI flow (Start -> Play -> Result)
- Practice / Challenge / Mistake Review modes
- Hearts, stars, combo, progress HUD, and pause overlay
- Keypad + 4-choice answer input modes
- Browser TTS read-aloud support
- Local history (up to 30 sessions) and mistake TOP list

## Run Locally
1. Open `index.html` in any modern browser.
2. Select language/table/mode and start learning.

No backend or build step is required.

## Pages
- `index.html`: Main quiz app
- `app-v2.css`: Main quiz v2 UI style
- `app-v2.js`: Main quiz v2 runtime
- `guide.html`: Learning guide and FAQ
- `about.html`: Site/service overview
- `terms.html`: Terms of service
- `privacy.html`: Privacy policy
- `contact.html`: Contact channel
- `ads.txt`: Authorized Digital Sellers declaration
- `robots.txt`: Crawl policy + sitemap location
- `sitemap.xml`: URL discovery map
- `style.css`: Shared style (legal/common)
- `script.js`: Legacy quiz runtime (kept for reference)
- `legal.js`: Legal/about page i18n runtime

## GitHub Pages Deployment
- Deploy to the root of `byoh5.github.io`.
- Keep all HTML/CSS/JS files at repository top level.

## AdSense Readiness Checklist
Before submitting/reviewing in AdSense, confirm:
1. `ads.txt` is publicly accessible at `/ads.txt`.
2. `robots.txt` and `sitemap.xml` are publicly accessible.
3. All policy pages are reachable from every page footer/header.
4. `meta name="google-adsense-account"` is present on each page.
5. Contact and operator info are visible (`about.html`, `contact.html`).
6. Privacy/terms clearly disclose ads, cookies, and child-related guidance.
7. `canonical` URLs match your real production domain.

## Important
This repository currently uses `https://byoh5.github.io` in canonical/sitemap URLs.
If you deploy to another domain, update URLs in:
- `index.html`
- `about.html`
- `contact.html`
- `privacy.html`
- `guide.html`
- `terms.html`
- `robots.txt`
- `sitemap.xml`

## License
Free to use for internal or educational purposes.
