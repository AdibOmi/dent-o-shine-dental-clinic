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
- **Photos** (originals kept untouched in `photos-original/`; web-optimised copies in `src/assets/`):
  - `src/assets/clinic/` — "From our clinic" gallery. Any image dropped here appears
    automatically, ordered by filename. With 3 or 4 photos a bento layout is used: the first
    should be a portrait, and (with 4) the last a wide landscape. Other counts use masonry.
  - `src/assets/doctor/` — doctor photo + round avatar used on the hero badge.
  - `src/assets/cases/` — patient cases (Before → During → After), listed in `CASES`.
    Keep clinical photos un-retouched; only crop them to the same frame.
- **Reviews** — placeholder text under `reviews.items`; replace with real patient reviews.
- **Stats** — numbers under `stats`; adjust to real figures.
- **Contact / hours** — the `CONTACT` object (also drives the live "Open now" badge, Dhaka time).
