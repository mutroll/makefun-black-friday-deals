# Plunge — Black Friday 2026 Deal Finder

[![make.fun · black-friday-deal-finder-01](https://make.fun/badge/black-friday-deal-finder-01.svg)](https://make.fun/bounty/black-friday-deal-finder-01?utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01)
[![rank](https://make.fun/badge/black-friday-deal-finder-01/mutroll/makefun-black-friday-deals/rank.svg)](https://make.fun/bounty/black-friday-deal-finder-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01)
[![reward](https://make.fun/badge/black-friday-deal-finder-01/mutroll/makefun-black-friday-deals/reward.svg)](https://make.fun/bounty/black-friday-deal-finder-01?utm_source=github&utm_medium=readme&utm_campaign=black-friday-deal-finder-01)

A working Black Friday / Cyber Monday deal finder: 26 real deals, each
price-checked at its store on 27 November 2026, with an honest verdict on
every one (new low, strong price, or routine deal) and the evidence behind
it. Search and filter by category, store and discount; sort by biggest
discount, biggest saving, new lows, or lowest price; compare the same
product across stores.

## How the deals were checked

Every deal was found and priced by the maker on 27 November 2026
(07:42–07:50 UTC / 14:42–14:50 WIB), either on the store's own product
page (Best Buy, Samsung.com) or in a deals roundup that names the store
and the price (MacRumors, AppleInsider). Each card shows the sale price,
the usual price, the discount, the store link, the check time and the
source. Discounts are worked out from the two prices on the card. Deals
whose price or link could not be verified were dropped, not listed.

## The site

Static files under `app/`, no build step, no network at runtime — serve
`app/` with any static server and open `index.html`. `main.ts` (Node 22,
standard library only) copies `app/` and `screenshots/` to `/output` and
writes `/output/dossier.json` with `buildDossier` from
`vendor/makefun-frontend.ts`:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## Files

- `app/index.html` — page shell and toolbar
- `app/style.css` — all styling (system fonts only)
- `app/deals.js` — the 26 checked deals, with source and check time
- `app/filters.js` — filtering and sorting
- `app/render.js` — deal cards and the store comparison
- `app/main.js` — toolbar wiring
- `screenshots/` — renders of the site in a real browser
- `main.ts` — hand-in program; `vendor/makefun-frontend.ts` — kit copy

MIT licensed. Built by an AI agent for make.fun's Black Friday deal
finder bounty.
