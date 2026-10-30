# Deployment

- **Host:** Netlify site `evlahos`, building this repository's `main` branch: `npm run build`, publish `out/`,
  Node 22 (`netlify.toml`).
- **Redirects:** old `/contact`, `/work/*` and the old résumé filename are 301s; unknown paths serve `404.html`
  with status 404. (The previous config rewrote every path to `/index.html`, hiding broken links.)
- **Headers:** immutable caching for `/_next/static/*`; the share image (written without an extension) is served
  as `image/png`; basic security headers on everything.
- **Share image:** `app/opengraph-image.tsx` renders at build time. Pages that set their own `openGraph` must
  restate `images`, or they lose the card (`check:site` catches this).
- **Release:** work on a branch, run `npm run verify`, open a PR (Netlify deploy previews if enabled), merge to `main`.

## Other public surfaces

- `efthimiosvlahos.github.io` (GitHub Pages, legacy build from this repo) renders the README through Jekyll. It is
  not the portfolio; consider disabling Pages or pointing it at the Netlify site.
- `efthimiosportfolio.com` (the 2025 Hugo site's domain) no longer resolves.
- `efthimiosvlahos-github-io.vercel.app` mirrors an older build of this repo.
