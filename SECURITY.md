# Security Policy

This is a fan-made, educational, **front-end-only** project. There is no backend,
no database, and no real user accounts. Still, if you find something worth
flagging, please report it.

## What "auth" means here

The sign-in is **simulated**. Any valid-looking email plus a 4–60 character
password signs you in. Important properties:

- **No password is ever stored or transmitted.** Only the email is kept, in the
  browser's `localStorage`, to identify the active session.
- All profile data (My List, Continue Watching, profiles) is per-browser
  `localStorage`. Nothing leaves the device except requests to the public TMDB,
  YouTube, TVmaze, Wikipedia, and Internet Archive APIs.
- The demo account (`demo@netflix.com` / `Netflix@123`) is a convenience for
  reviewers. It is not a real credential and grants no real access.

## Secrets

The only secret is an optional TMDB API key, which is supplied through a
git-ignored `.env` file as `VITE_TMDB_API_KEY`. Never commit it. If a key is
ever committed by accident, rotate it in your TMDB account settings immediately.

## Reporting a vulnerability

If you discover a genuine security issue (for example an XSS vector in how
user-supplied or API data is rendered), please **open a GitHub issue** describing
it, or use GitHub's **private vulnerability reporting** on the repository's
Security tab if the issue is sensitive. Please don't include real personal data
in a public report.

There is no formal SLA — this is a hobby project — but reports are appreciated
and will be addressed on a best-effort basis.
