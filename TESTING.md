# Testing

This project is verified with a **manual test checklist** rather than an
automated suite. The CI workflow (`npm ci` + `npm run build` on Node 20) guards
build/dependency integrity on every push and pull request; the checklist below
covers runtime behaviour.

## Demo credentials

| | |
| --- | --- |
| **Email** | `demo@netflix.com` |
| **Password** | `Netflix@123` |

The sign-in is simulated — any valid-looking email + 4–60 character password
works, and only the email is stored (never the password). The sign-in page also
has a **"Use demo account →"** button that fills and submits these for you.

## How to run the app

```bash
npm install
npm run dev        # http://localhost:5173
# or verify the production build:
npm run build && npm run preview
```

## Checklist

Run through this on both the dev server and a production preview.

| # | Step | Expected | Status |
| --- | --- | --- | --- |
| 1 | Open `index.html` | Landing page renders; nav, hero, FAQ accordion work | ✅ |
| 2 | Language switch → Hindi | `hindi.html` loads with the Hindi landing flow | ✅ |
| 3 | Click **Sign In**, type the demo email + password, submit | Redirects to `profiles.html` | ✅ |
| 4 | Click **"Use demo account →"** instead | Fills creds and signs in in one click | ✅ |
| 5 | Pick a profile | Netflix intro sound plays; lands on `browse.html` | ✅ |
| 6 | Browse home | Hero billboard + rows (Trending, Top 10 with big numerals, Originals, Free Full Movies) render with real posters | ✅ |
| 7 | Search | Debounced results appear; clearing restores the view | ✅ |
| 8 | Open a title | Detail modal shows art, metadata, cast, "More Like This" | ✅ |
| 9 | Add to My List | Title appears under My List; persists on reload | ✅ |
| 10 | Play a Free Full Movie | Player opens; video decodes and the timeline advances; full runtime (≈95 min) loads from the Internet Archive | ✅ |
| 11 | Nav views (TV / Movies / New / My List) | Each view loads its own rows | ✅ |
| 12 | Kids profile | Only family-safe titles in rows, search, and "More Like This" | ✅ |
| 13 | Resize to 375px | No horizontal scroll; mobile nav dropdown works | ✅ |
| 14 | Console | No errors; no broken images | ✅ |

## Latest run

- **Date:** 2026-10-30
- **Build:** production preview (`npm run build && npm run preview`) + fresh
  clone (`npm ci && npm run build`, both pass)
- **Result:** All 14 steps above verified in demo mode (no TMDB key), including
  kids-profile filtering (rows + search) and a 375px mobile layout with no
  horizontal scroll. Playback was confirmed by the video decoding and the
  timeline advancing — not watched through to the final frame.
- **Untested:** the live TMDB catalog, live search, and YouTube trailers — these
  require a `VITE_TMDB_API_KEY` in `.env` (see the README). Only the demo/offline
  path was exercised in this run.
