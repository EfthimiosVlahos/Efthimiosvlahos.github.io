# Efthimios Vlahos — Portfolio

A clean, modern portfolio website built with Next.js 14, React 18, and Tailwind CSS.

**Live:** [evlahos.netlify.app](https://evlahos.netlify.app)

## Pages

- **Home** — Hero with profile, social links, resume download
- **About Me** — Professional bio, affiliations, education
- **Professional Experience** — Timeline with Con Edison, Cornerstone Building Brands, Microsoft
- **Projects** — Filterable grid of ML and DevOps projects
- **Skills & Certifications** — Skills table and certification cards
- **Contact** — Social link cards

## Tech Stack

- **Framework:** Next.js 14 (Static Export)
- **Styling:** Tailwind CSS with dark/light mode
- **Deployment:** Netlify (static)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view locally.

## Build

```bash
npm run build
```

Static output is generated in the `out/` directory, ready for deployment.

## Project Structure

```
components/     Layout, Navbar, Footer, ThemeToggle, Head
pages/          Home, About, Experience, Projects, Skills, Contact
data/           JSON data files (experience, skills, certifications, projects)
styles/         Global styles (Tailwind)
public/         Images, resume PDF, favicon
```

## Editing Content

- **Experience:** Edit `data/experience.json`
- **Skills:** Edit `data/skills.json`
- **Certifications:** Edit `data/certifications.json`
- **Projects:** Edit files in `data/projects/`

## Deployment

Configured for Netlify via `netlify.toml`. Connect the repo in the Netlify dashboard or drag-and-drop the `out/` folder.
