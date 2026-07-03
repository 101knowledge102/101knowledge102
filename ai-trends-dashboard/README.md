# Field Notes — AI Coding Trends Dashboard

A small personal dashboard tracking Claude Code / AI coding tool adoption,
best practices, and what's trending on X. No build step, no dependencies.

## Run it

```bash
cd ai-trends-dashboard
python3 -m http.server 8000
# then open http://localhost:8000
```

(A local server is needed only because the browser's `file://` origin
blocks some script loading; opening `index.html` directly also works in
most browsers since there's no `fetch()` call.)

## What's in it

- `index.html` — page structure
- `style.css` — design tokens (colors, type) and layout, light/dark aware
- `data.js` — the actual content: stats, chart series, best-practices list,
  the "signal on X" card, tool comparison, sources
- `script.js` — renders `data.js` into the DOM (stat tiles, an SVG line
  chart, CSS bar chart, checklist, comparison table)

## Data is a curated snapshot, not live

Everything in `data.js` was pulled from a web search on 2026-07-03 and
hand-curated — there's no running fetch to X, GitHub, or a news API. To
make a section live:

- **GitHub** (release notes, commit stats): call the GitHub REST/GraphQL
  API from a small backend (a token is required for anything beyond public
  read-only rate limits) and replace `DASHBOARD_DATA.stats` /
  `bestPractices` with the response.
- **X / Twitter** (`viralSignal`, trending posts): requires an X API v2
  bearer token with at least the search/recent endpoint. X's API is not
  reachable from a static, keyless front end — this needs a backend that
  holds the credential and returns a small JSON payload shaped like
  `DASHBOARD_DATA.viralSignal`.
- **News/blogs**: any search API (or scheduled scrape) that writes into
  the same shape as `DASHBOARD_DATA.sources`.

Keep the render functions in `script.js` as-is — they only care about the
shape of `DASHBOARD_DATA`, not where it came from.
