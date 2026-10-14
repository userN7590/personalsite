# Filip Stopyra — personal site

A calm, content-first personal site (Vite + React). Pages: Home and Projects,
plus a full engineering **case study** for each project.

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

- `src/pages/Projects.jsx` — categorized project index (cards → case studies), with an "on this page" section guide in the header. Products & Apps is folded: the first row shows, the second fades out, the rest sits behind "Show all" (remembered for the tab's session).
- `src/pages/cases/*` — project pages, in index order: REBILT (`/projects/rebilt`), WordLoot, Stack Stats (`/projects/stack-stats`), WTM, Simple Rents (`/projects/simple-rents`, old `/projects/rentalcrm` redirects), AIRE (`/projects/aire`), Minecraft. Each page's prev/next links follow that order.
- `src/components/` — shared chrome: `SiteHeader`, `Footer`, `Layout`, `Carousel`, `ImageSlot` (screenshot placeholder), `case/CaseParts` (Section/Challenge/Tradeoff/Ent/CaseNav).
- `src/components/DotLogo.jsx` — the home page's interactive dot-matrix project logos. Marks are sampled from the white silhouettes in `public/assets/dots/` (tone is baked into their alpha); add a project by adding a silhouette there and an entry to `LOGOS`.
- `src/components/MiniGolf.jsx` — the desktop-only mini-golf easter egg: a glowing ball in the page margin opens a window with a freshly generated course every hole. `src/lib/golfCourse.js` generates courses from a seed (terrain, fairway, green, sand dunes, ponds or a creek with a bridge, trees) and rejects any the ball can't finish; `src/lib/golfDraw.js` draws them.
- Dark only. Design tokens live at the top of `src/site.css`; the page sits between two full-height rails (`.frame`), and `.rule` draws a full-bleed hairline with ring markers where it crosses them.

## Assets & placeholders

Real assets live in `public/assets/`. All project logos and screenshots from the
design bundle are in place **except one**:

- `public/assets/projects/blitz-sword-lore.png` — the second BlitzEnchants screenshot. It exceeds the design-tool's 256 KiB per-file transfer cap, so it could not be retrieved. The BlitzEnchants plugin card currently shows only the rune-crafting screenshot; add this file and a second `<figure>` in `cases/Minecraft.jsx` to restore the two-up grid.
- Case-study carousels intentionally show only real screenshots (WordLoot, WTM). Simple Rents and AIRE have no product screenshots yet; add images and extend the `slides` array in the relevant `cases/*` file (WordLoot/WTM) or add a `<Carousel>` where there isn't one.
