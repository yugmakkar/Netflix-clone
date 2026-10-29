# Netflix Clone

A two-part Netflix clone built with **vanilla JS + Vite + Tailwind CSS**:

1. **Marketing site** — a pixel-faithful recreation of Netflix's public landing
   page (English + Hindi), FAQ accordion, sign-in pages, and the animated
   Netflix intro.
2. **The streaming app** — profiles, a browse experience with content rows, a
   detail modal, search, My List, Continue Watching, and a video player.

> **Disclaimer:** This is a fan-made educational project. It is **not affiliated
> with, endorsed by, or connected to Netflix, Inc.** All trademarks belong to
> their respective owners.

---

## Demo flow

```
index.html (landing)
   └─ Get Started / Sign In
        └─ forms.html  (simulated sign-in — email only, never a password)
             └─ profiles.html  ("Who's watching?" + Netflix intro sound)
                  └─ browse.html  (hero + rows + search + My List)
                       ├─ detail modal (trailer, cast, episodes, More Like This)
                       └─ watch.html  (YouTube trailer OR full public-domain film)
```

The landing page's language switcher and the full Hindi flow
(`hindi.html` → `formsHindi.html`) are preserved.

---

## Content sources (all free & legal)

| What | Source | Notes |
| --- | --- | --- |
| Catalog metadata, posters, backdrops | [TMDB](https://www.themoviedb.org/) API | Requires a free API key (below) |
| Trailers / previews | YouTube (via the IFrame API, `youtube-nocookie`) | No studio content is hosted |
| **Full-length films** | [Internet Archive](https://archive.org/) | Curated **public-domain** titles that play end-to-end |

This project deliberately does **not** use pirate streaming embeds
(vidsrc, 2embed, etc.). Those are copyright-infringing, serve malicious ads,
and have no place in a public repo. Trailers + public-domain films are the
honest free path — and the app still looks and feels like Netflix.

---

## Getting started

### Prerequisites
- **Node.js 18+**

### Install & run
```bash
npm install
npm run dev      # start the dev server (http://localhost:5173)
npm run build    # production build into dist/
npm run preview  # preview the production build
```

### TMDB API key (optional but recommended)
Without a key the app runs in **demo mode** using bundled sample data, so a
fresh clone still works. For the live catalog, search and trailers:

1. Create a free account at <https://www.themoviedb.org/>.
2. Go to **Settings → API** and request a key (the **API Key (v3 auth)** value).
3. Copy `.env.example` to `.env` and paste it in:
   ```
   VITE_TMDB_API_KEY=your_key_here
   ```
4. Restart `npm run dev`.

Only `VITE_`-prefixed variables are exposed to the browser, and `.env` is
git-ignored.

---

## Features

- **Profiles** — add/remove, kids profiles, per-profile personalization
- **Browse** — hero billboard, Trending, Top 10 in India (with the big
  numerals), Netflix Originals, Indian cinema, genre rows, Free Full Movies
- **Detail modal** — trailer, % match, cast, genres; seasons & episodes for TV;
  "More Like This"
- **Search** — debounced multi-search across movies and TV
- **My List** & **Continue Watching** — saved per profile in `localStorage`
- **Player** — YouTube trailers (resume-aware) and a custom `<video>` player for
  full films with keyboard shortcuts (`space`/`k` play, `←`/`→` seek,
  `↑`/`↓` volume, `m` mute, `f` fullscreen)
- **Kids mode** — family-friendly rows only
- **Responsive** — works down to 375px; no horizontal scroll

---

## Project structure

```
├── index.html / hindi.html          Landing pages (EN / HI)
├── forms.html / formsHindi.html     Sign-in pages (EN / HI)
├── startup.html                     Netflix intro animation → app
├── profiles.html                    "Who's watching?"
├── browse.html                      The browse SPA
├── watch.html                       Player
├── script.js / formScript.js        Landing + sign-in logic
├── src/
│   ├── api/
│   │   ├── tmdb.js                   TMDB wrapper + graceful fallback
│   │   ├── sampleData.js            Offline sample catalog
│   │   └── freeFilms.js            Verified public-domain films (Archive.org)
│   ├── components/
│   │   ├── nav.js  card.js  modal.js
│   ├── store.js                     localStorage: session, profiles, list, CW
│   ├── browse.js  profiles.js  watch.js
│   ├── util.js  app.css
├── vite.config.js                   Multi-page build config
└── tailwind.config.js
```

---

## Tech stack
Vanilla JavaScript (ES modules) · Vite 4 · Tailwind CSS 3 · TMDB API ·
YouTube IFrame API · Internet Archive

## Attribution
This product uses the TMDB API but is **not endorsed or certified by TMDB**.
Movie and TV metadata and artwork are provided by
[The Movie Database](https://www.themoviedb.org/).

## License
[MIT](./LICENSE) — for the original code in this repository. Third-party content
(TMDB metadata, YouTube videos, Internet Archive films) remains under its own
respective licensing and terms.
