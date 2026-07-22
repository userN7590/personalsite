# Filip Stopyra — personal site

A calm, content-first personal site (Vite + React). Pages: Home, Projects,
Experience, Changelog — plus a full engineering **case study** for each project.

## Develop

```bash
npm install
npm run dev
```

## Build / preview

```bash
npm run build
npm run preview
```

## Deploy to Vercel

Push to a Git repo and import it in Vercel (framework preset: **Vite**), or run
`vercel` from this folder. `vercel.json` rewrites all routes to `index.html` so
client-side routing works on refresh/deep links.

## Structure

- `src/pages/Projects.jsx` — categorized project index (cards → case studies).
- `src/pages/cases/*` — the five case studies: WordLoot, WTM, Simple Rents (`/projects/rentalcrm`), AIRE (`/projects/aire`), Minecraft.
- `src/components/` — shared chrome: `SiteHeader`, `Footer`, `Layout`, `Carousel`, `ResumeViewer` (in-site PDF overlay), `ImageSlot` (screenshot placeholder), `case/CaseParts` (Section/Challenge/Tradeoff/Ent/CaseNav).
- Theme follows the visitor's system light/dark preference (no toggle, no JS theme state).

## Assets & placeholders

Real assets live in `public/assets/`. All project logos and screenshots from the
design bundle are in place **except one**:

- `public/assets/projects/blitz-sword-lore.png` — the second BlitzEnchants screenshot. It exceeds the design-tool's 256 KiB per-file transfer cap, so it could not be retrieved. The BlitzEnchants plugin card currently shows only the rune-crafting screenshot; add this file and a second `<figure>` in `cases/Minecraft.jsx` to restore the two-up grid.
- Case-study carousels intentionally show only real screenshots (WordLoot, WTM). Simple Rents and AIRE have no product screenshots yet; add images and extend the `slides` array in the relevant `cases/*` file (WordLoot/WTM) or add a `<Carousel>` where there isn't one.
