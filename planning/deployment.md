# Deployment

- **Host:** Netlify site `evlahos` (evlahos.netlify.app). It is **not linked to this repository** (checked in the
  dashboard, Oct 2026): it is published by Netlify Drop, dragging the built `out/` folder onto the project's Deploys
  page. Pushing or merging does not update it, and pull requests get no Netlify preview.
- **Release (today):** run `npm run verify`, then drag `out/` onto https://app.netlify.com/projects/evlahos/deploys.
  Drop it on the project's Deploys page, not the team page, which would create a new project.
- **Release (if the repo is linked later):** `netlify.toml` already has the build settings (`npm run build`, publish
  `out/`, Node 22); PRs would get deploy previews and `main` would deploy to production.
- **Redirects and headers** live in `public/_redirects` and `public/_headers`, so they are copied into `out/` and
  apply to drag-and-drop deploys too (Netlify ignores `netlify.toml` for those). `check:site` fails if they're missing.
- **Redirects:** old `/contact`, `/work/*` and the old résumé filename are 301s; unknown paths serve `404.html`
  with status 404. (The previous config rewrote every path to `/index.html`, hiding broken links.)
- **Headers:** immutable caching for `/_next/static/*`; the share image (written without an extension) is served
  as `image/png`; basic security headers on everything.
- **Share image:** `app/opengraph-image.tsx` renders at build time. Pages that set their own `openGraph` must
  restate `images`, or they lose the card (`check:site` catches this).

## Other public surfaces

- `efthimiosvlahos.github.io` (GitHub Pages, legacy build from this repo) renders the README through Jekyll. It is
  not the portfolio; consider disabling Pages or pointing it at the Netlify site.
- `efthimiosportfolio.com` (the 2025 Hugo site's domain) no longer resolves.
- Vercel project `efthimiosvlahos-github-io` **is** linked to this repository: `main` deploys to
  efthimiosvlahos-github-io.vercel.app (public; still the March 2026 site until `main` changes) and other branches
  get previews behind Vercel login. Disconnect it if the Netlify site should be the only copy.
