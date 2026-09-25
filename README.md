# SRAZVI website

React 19 + Vite + Tailwind CSS 4 + framer-motion. Hash routing (`#/about`, `#/construction`, …), no backend.

## View the website

**Option 1: run it locally (recommended while editing)**

```bash
npm install        # first time only
npm run dev        # opens a live-reloading site at http://localhost:5173
```

**Option 2: production build**

```bash
npm run build      # outputs to dist/
npm run preview    # serves dist/ at http://localhost:4173
```

**Option 3: shareable folder**

```bash
npm run shareable
```

This writes `outputs/srazvi-site/`. `srazvi-standalone.html` is a single self-contained file (code,
styles and images embedded): double-click it or send it to anyone. The whole folder can also be
uploaded as-is to any static host (Netlify drop, Cloudflare Pages, GitHub Pages).

## Where things live

| File | What it holds |
| --- | --- |
| `src/data.js` | All copy: menu, features, wear-test captions, market numbers, FAQ, survey, reviews |
| `src/components/logo.jsx` | SRAZVI® logo (SVG) and its animated loading-screen version |
| `src/components/fx.jsx` | Animation and interaction building blocks (see below) |
| `src/components/ui.jsx` | Buttons, icons, page intro |
| `src/components/Layout.jsx` | Header, footer, floating "Join early access" button |
| `src/components/art.jsx` | SVG patterns and the shapewear illustration |
| `src/pages/*.jsx` | Home, About, Construction, Opportunity, Contact |
| `src/assets/` | Photos and illustrations |

Old links `#/features` and `#/compare` redirect to `#/about` and `#/construction`.

## Effects used, by page

- **Everywhere:** branded loading screen (once per session), scroll progress bar, custom cursor with a
  gold trail (desktop only), page transitions, animated menu underline, button ripple, magnetic
  buttons, glow pulse, floating early-access button, toast messages. All motion switches off for
  visitors with "reduce motion" turned on.
- **Home:** word-by-word headline, self-drawing gold sprig, parallax + scale-on-scroll + magnetic hero image, infinite marquee,
  count-up numbers, masked brand-statement reveal.
- **About:** flip flash cards with line-drawn icons and a feature popup (modal with previous/next),
  pinned "Why SRAZVI" image that changes as you scroll, FAQ accordion.
- **Construction:** before/after drag comparison (SRAZVI vs other shapewear), pinned build diagram that
  draws itself as you scroll, animated wear test.
- **Opportunity:** count-up market circles and stats, scroll reveals, tilting quote cards.
- **Contact:** sliding tab highlight, submit button that morphs into "✓ Sent", toast confirmation.

## Before launch

- `SAMPLE = true` in `src/data.js` shows "sample data" tags; the survey numbers and reviews are
  placeholders. Replace them, then set `SAMPLE = false`.
- Contact forms open the visitor's mail app (no backend). Swap `sendByMail` in `src/pages/Contact.jsx`
  for Formspree or your own API when ready.
