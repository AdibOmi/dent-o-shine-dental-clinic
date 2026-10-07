# Dent-O-Shine — Landing Page

React + Vite landing page for **Dent-O-Shine** (Dr. Ayesha Akter, BDS (DU), PGT (OMS, DDC)).

## Run

```bash
npm install
npm run dev      # local dev server
npm run build    # production build → dist/
```

Deploy `dist/` to any static host (Netlify, Vercel, GitHub Pages, cPanel).

## Editing content

Everything editable is in [`src/data/content.js`](src/data/content.js):

- **Text** — English (`en`) and Bangla (`bn`) translations side by side.
- **Photos** — the `IMAGES` object. Put your own photos in `public/images/` and
  replace URLs with paths like `'/images/dr-ayesha.jpg'`. Items marked `TODO`
  are placeholders (doctor photo, before/after, gallery).
- **Before/after** — currently one photo with a stain filter. For a real case, pass
  both images in `src/components/Results.jsx`:
  `<BeforeAfter before="/images/case1-before.jpg" after="/images/case1-after.jpg" ... />`
- **Reviews** — placeholder text under `reviews.items`; replace with real patient reviews.
- **Stats** — numbers under `stats`; adjust to real figures.
- **Contact / hours** — the `CONTACT` object (also drives the live "Open now" badge, Dhaka time).
