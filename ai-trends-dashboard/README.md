# Field Notes — AI Coding Trends Dashboard

A small personal dashboard tracking Claude Code / AI coding tool adoption,
best practices, and what vendors just shipped. No build step, no
dependencies, zero API cost — everything is sourced from vendors' own
public changelogs, not the paid X API.

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
  the "straight from the vendors" changelog digest, tool comparison, sources
- `script.js` — renders `data.js` into the DOM (stat tiles, an SVG line
  chart, CSS bar chart, checklist, vendor-tips list, comparison table)

## Data is a curated snapshot, not live

Everything in `data.js` was pulled from a web search on 2026-07-03 and
hand-curated — there's no running fetch yet. To make a section live,
without paying for anything:

- **`vendorTips`** (the changelog digest): each vendor already publishes
  this for free —
  [Claude Code changelog](https://code.claude.com/docs/en/changelog),
  [Anthropic release notes](https://docs.anthropic.com/en/release-notes/overview),
  [GitHub Changelog](https://github.blog/changelog/). Poll their RSS feeds
  or scrape the page on a schedule (daily/weekly is fine — see the
  `windowLabel` note in the data) and replace `DASHBOARD_DATA.vendorTips.items`.
- **`stats` / `bestPractices`**: same idea — GitHub's REST/GraphQL API is
  free for public read-only data (rate-limited, no token needed for light
  use); vendor blog posts cover the rest.

X/Twitter was deliberately left out: as of 2026 the X API v2 has no free
tier (pay-per-use, ~$0.005 per post read for another account's posts — see
`docs.x.com/x-api/getting-started/pricing`). If you want to add an
X-sourced "what's trending" card back in later, it needs a small backend
holding the bearer token (never expose it client-side) that returns a
payload shaped like the old `viralSignal` object; budget a few dollars a
month for light, non-real-time polling.

Keep the render functions in `script.js` as-is — they only care about the
shape of `DASHBOARD_DATA`, not where it came from.
