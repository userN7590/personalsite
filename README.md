# Filip Stopyra — personal site

A calm, content-first personal site (Vite + React). Multi-page: Home, Projects,
Experience, Changelog, Collections, Contact.

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

## Notes

- Real assets live in `public/assets/` (project images, logos, resume PDF).
- The RentalCRM, AIRE, and Minecraft cards use labeled placeholder slots — drop
  real screenshots into `public/assets/projects/` and wire them up in
  `src/pages/Projects.jsx`.
- Collections lists are placeholders, ready to be swapped for real data.
- Theme follows the visitor's system light/dark preference (no toggle, no JS theme state).