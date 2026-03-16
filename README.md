# linus-ai-website

Static marketing website for [LINUS-AI](https://linus-ai.com) — private AI inference engine.

Hosted on AWS Lightsail behind nginx. No build step, no framework — plain HTML, CSS, and vanilla JS.

---

## Structure

```
linus-ai-website/
├── index.html          Main landing page
├── download.html       Download page (fetches live release data from GitHub API)
├── pricing.html        Pricing and license tiers
├── activate.html       License activation portal
├── 404.html            Custom 404 page
├── css/
│   └── style.css       Shared design system
├── js/
│   └── main.js         Shared UI logic (nav, tabs, accordions)
└── docs/
    ├── index.html      Documentation hub
    ├── readme.html     README rendered as web page
    ├── spec.html       Technical specification
    ├── endpoints.html  REST API reference
    ├── flowchart.html  System architecture diagrams
    ├── user.html       User guide
    ├── admin.html      Admin guide
    ├── developer.html  Developer guide
    └── architect.html  Architect guide
```

---

## Development

No build step required. Open any `.html` file directly in a browser, or serve locally:

```bash
# Python (built-in)
python -m http.server 8080

# Node (if available)
npx serve .
```

---

## Deployment

The site is deployed as static files on the same AWS Lightsail instance as the license server.
See `LICENSING.md §7` in the private repo for the full nginx config and deployment steps.

Quick deploy (from the Lightsail instance):

```bash
cd /var/www/linus-ai
git pull origin main
```

---

## Download Page

`download.html` fetches live release metadata from the GitHub API on page load:

- Version number, direct asset URLs, and file sizes come from the latest GitHub Release
- `SHA256SUMS.txt` is fetched from the release and shown per-card
- Falls back gracefully (links to the Releases page) if the API is unavailable
- No binaries are hosted on this website — all downloads go to GitHub Releases

---

## Related Repositories

| Repository | Visibility | Purpose |
|-----------|-----------|---------|
| [`linus-ai`](https://github.com/LINUS-AI-PRO/linus-ai) | Public | Core engine, open-source, GitHub Releases |
| `linus-ai-website` | Public | This repo — static marketing site |
| `linus-ai-private` | **Private** | Server infrastructure and internal docs |
