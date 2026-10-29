# Contributing

Thanks for your interest in this project! It's a fan-made, educational Netflix
clone, so contributions that improve the learning value, fix bugs, or polish the
UI are all welcome.

## Ground rules

- **No pirate streaming.** This repo deliberately uses only free, legal sources:
  TMDB for metadata, YouTube (IFrame API) for trailers, and the Internet Archive
  for public-domain full films. Pull requests that add scraping embeds
  (vidsrc, 2embed, and similar) will be closed.
- **Never commit secrets.** The TMDB key lives in a git-ignored `.env`. Only
  `VITE_`-prefixed variables reach the browser. Don't hardcode keys.
- **Keep auth simulated.** There is no backend. The session stores an email
  only — never a password. Don't add anything that persists a password.
- **Respect the stack.** Vanilla JS (ES modules) + Vite 4 + Tailwind CSS 3. No
  framework migration and no Tailwind v4 in a PR unless it's been discussed in
  an issue first.

## Getting set up

```bash
npm install
npm run dev        # http://localhost:5173
```

Optionally copy `.env.example` to `.env` and add a free TMDB key for the live
catalog. Without one, the app runs in demo mode with bundled sample data.

## Before you open a pull request

1. Run `npm run build` — it must succeed (CI runs the same check).
2. Walk the manual test flow in [TESTING.md](./TESTING.md) for anything you
   touched, and update that file's results if your change affects the flow.
3. Check the browser console for errors on the pages you changed.
4. Verify the layout still works down to 375px (no horizontal scroll).

## Commit & PR style

- Write clear, imperative commit messages ("Add kids search filter", not
  "added stuff").
- Keep each PR focused on one change. Describe what and why, and note how you
  tested it (the PR template will prompt you).

## Reporting bugs & ideas

Use the issue templates under **New issue**. A clear repro (steps, what you
expected, what happened, browser) makes bugs far faster to fix.
