# Changelog

All notable changes to this project are documented here. The format is loosely
based on [Keep a Changelog](https://keepachangelog.com/).

## [2.0.0] — 2026-10-30

A full rebuild from a static landing page into a Netflix-like streaming app.

### Added
- **Streaming app**: profiles ("Who's watching?"), a browse SPA with a hero
  billboard and content rows (Trending, Top 10, Netflix Originals, Indian
  cinema, genre rows, Free Full Movies), a detail modal, debounced search, My
  List, and Continue Watching.
- **Player**: YouTube trailers via the IFrame API (resume-aware,
  `youtube-nocookie`) and a custom `<video>` player for public-domain films with
  keyboard shortcuts.
- **Content sources** (all free & legal): TMDB for catalog/metadata, YouTube for
  trailers, and the Internet Archive for verified public-domain full films.
- **Demo mode**: when no TMDB key is set, the app runs on a bundled sample
  catalog with real poster art from keyless sources (TVmaze for TV, Wikipedia
  for film posters), so a fresh clone looks like a real streaming app.
- **Kids profiles**: family-safe filtering across rows, search, and the
  "More Like This" modal.
- **Demo account** (`demo@netflix.com` / `Netflix@123`) with a one-click
  "Use demo account →" button on the sign-in pages (English + Hindi).
- Project docs: README, LICENSE (MIT), CONTRIBUTING, SECURITY, TESTING, this
  changelog, GitHub issue/PR templates, and a CI workflow.
- Vite multi-page build, Tailwind content globs, and `.env.example`.

### Changed
- Landing pages now load their script as an ES module so logic (FAQ, language
  switch, Get Started) survives the production build.
- Simulated sign-in no longer blocks valid submissions via native `pattern`
  validation.
- Footer phone number replaced with the public Netflix India helpline.

### Security
- Sign-in is simulated; only the email is stored, never a password.
- The TMDB key is supplied via a git-ignored `.env` and never committed.

## [1.0.0] — 2024-08-25

### Added
- Initial static Netflix landing-page clone (English + Hindi): hero, FAQ
  accordion, sign-in pages, and the animated Netflix intro.
