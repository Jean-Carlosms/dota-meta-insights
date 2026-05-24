# DotaMeta Insights

![Node.js](https://img.shields.io/badge/Node.js-18+-339933)
![React](https://img.shields.io/badge/React-18-61dafb)
![Status](https://img.shields.io/badge/status-portfolio_ready-blue)

DotaMeta Insights is a portfolio dashboard for analyzing the Dota 2 hero meta with public OpenDota data, a custom Meta Score, position heuristics, charts, and hero detail pages.

DotaMeta Insights e um dashboard de portfolio para analisar o meta de herois de Dota 2 usando dados publicos da OpenDota, Meta Score proprio, heuristica de posicoes, graficos e pagina individual do heroi.

## Features

- OpenDota API integration with local JSON cache.
- Custom Meta Score based on win rate, pick rate and match volume.
- Position filter using explicit heuristics from OpenDota `roles`.
- Filters by hero name, tier, position, primary attribute, attack type and sort metric.
- Recharts visualizations:
  - Top 20 compact ranking by active metric.
  - Top 10 heroes by Meta Score.
  - Top 10 heroes by Win Rate with minimum match volume.
  - Tier distribution.
  - Best hero by inferred position.
- Hero detail page at `/heroes/:heroId`.
- Hero icons and visual hero detail page using public asset paths returned by OpenDota.
- Backend helper endpoints for rankings, positions, tiers and hero lookup.
- `confidenceScore` and `sampleSizeLabel` to communicate sample reliability.
- `ratingScore`, `contestRateApprox` and `lanePresenceApprox` as documented DotaMeta indicators.
- Basic backend tests with `node:test`.
- Root scripts for install, dev, build, test and check.

## Portfolio Highlights

- Public API integration
- Custom analytical score
- Data normalization
- Local cache strategy
- React dashboard
- Charts and filters
- Backend derived endpoints
- Automated tests
- Error handling
- No scraping approach

## Tech Stack

- Backend: Node.js + Express
- Frontend: React + Vite
- Charts: Recharts
- Routing: React Router
- Styling: CSS
- Persistence: local JSON cache
- Tests: native `node:test`

## Architecture

```text
dota-meta-insights/
+-- backend/
|   +-- src/
|       +-- routes/
|       +-- middlewares/
|       +-- services/
|       +-- jobs/
|       +-- data/
|   +-- test/
+-- frontend/
|   +-- src/
|       +-- pages/
|       +-- components/
|       +-- services/
+-- docs/
    +-- screenshots/
```

The backend fetches `https://api.opendota.com/api/heroStats`, caches the raw payload locally for 6 hours, enriches heroes with analytics fields, and exposes derived endpoints.

The frontend consumes the local API and renders the dashboard, charts, filters, table and hero detail page.

## Hero Assets

OpenDota `heroStats` includes public hero asset paths such as `img` and `icon`. The backend keeps those raw fields and also exposes absolute URLs:

- `img`
- `icon`
- `imageUrl`
- `iconUrl`

Relative paths are resolved against the public Steam CDN host used by the OpenDota asset paths. If an asset is missing, the API returns `null` and the frontend shows a text fallback. No scraping is used and hero images are not stored in this repository.

## Screenshots

Placeholders for public GitHub screenshots:

- `docs/screenshots/dashboard.png`
- `docs/screenshots/hero-detail.png`

Add real images after running the app locally. Instructions are available in `docs/screenshots/README.md`.

## How To Run

Install all dependencies from the project root:

```bash
npm run install:all
```

Run backend and frontend together:

```bash
npm run dev
```

Run only the backend:

```bash
npm run dev:backend
```

Run only the frontend:

```bash
npm run dev:frontend
```

Build and test:

```bash
npm run check
```

Local URLs:

- Backend: `http://localhost:3001`
- Frontend: `http://localhost:5173`

## Environment Variables

Create a backend `.env` from `backend/.env.example` if needed.

```env
PORT=3001
FRONTEND_URL=http://localhost:5173
OPENDOTA_BASE_URL=https://api.opendota.com/api
OPENDOTA_TIMEOUT_MS=10000
STRATZ_API_TOKEN=
```

`STRATZ_API_TOKEN` is reserved for future GraphQL integration and is not required today.

## API Endpoints

### GET /api/health

```json
{
  "status": "ok",
  "service": "dota-meta-insights-api"
}
```

### GET /api/heroes/meta

Returns all processed heroes with Meta Score, tier, inferred positions, confidence and sample size.

### GET /api/heroes/meta/refresh

Forces a new OpenDota request, updates the local cache and returns processed data.

### GET /api/heroes/top

Optional query params:

- `metric=metaScore|winRate|pickRate|matches|confidenceScore|ratingScore|contestRateApprox`
- `limit=10`
- `position=carry|mid|offlane|soft_support|hard_support`

Invalid metric or position returns a consistent JSON error.

### GET /api/heroes/positions

Returns the best hero by inferred position.

### GET /api/heroes/tiers

Returns tier distribution:

```json
{
  "S": 10,
  "A": 35,
  "B": 40,
  "C": 25,
  "D": 14
}
```

### GET /api/heroes/:id

Returns one hero by id. Unknown ids return `404`.

### GET /api/heroes/metrics

Returns the main dashboard metric leaders:

```json
{
  "totalHeroes": 124,
  "bestByMetaScore": {},
  "bestByWinRate": {},
  "bestByPickRate": {},
  "mostPlayed": {},
  "highestConfidence": {},
  "tierDistribution": {},
  "positionLeaders": {}
}
```

## Meta Score Formula

```text
Meta Score =
(normalizedWinRate * 0.55) +
(normalizedPickRate * 0.30) +
(normalizedVolume * 0.15)
```

The score is scaled from 0 to 100.

Tiers:

- S: score >= 80
- A: score >= 65 and < 80
- B: score >= 50 and < 65
- C: score >= 35 and < 50
- D: score < 35

## Position Heuristic

OpenDota does not provide real match position data in `heroStats`. Current positions are inferred from hero `roles`, so they are useful for MVP filtering but are not statistically precise position data.

Initial rules:

- `Carry` -> `carry`
- `Nuker` or `Escape`, when not a support hero -> `mid`
- `Initiator`, `Durable` or `Disabler` -> `offlane`
- `Support`, `Disabler` or `Nuker` -> `soft_support`
- `Support` -> `hard_support`
- No match -> `unknown`

Future STRATZ GraphQL integration can replace or validate these heuristics with match-level position data.

## Confidence Score

`confidenceScore` is based on match volume relative to the highest-volume hero in the payload.

`sampleSizeLabel`:

- `Low sample`: below 1000 matches
- `Medium sample`: 1000 to 10000 matches
- `High sample`: above 10000 matches

This does not change Meta Score; it helps interpret how reliable the sample size is.

## DotaMeta Analytics Layer

The project adds a small analytics layer on top of OpenDota data. These fields are internal DotaMeta indicators, not official Dota 2, STRATZ or Dota2ProTracker metrics.

- `ratingScore`: DotaMeta Rating. Formula: `metaScore * 0.75 + confidenceScore * 0.25`.
- `contestRateApprox`: initial contest approximation using `pickRate` as the base. It is not a real pick/ban contest rate.
- `lanePresenceApprox`: currently `null` because OpenDota `heroStats` does not provide real lane presence. This is planned for future STRATZ GraphQL work.
- Minimum matches filter: frontend filter that hides heroes below the selected match threshold (`0`, `500`, `1000`, `5000`, `10000`).

Dota2ProTracker was used only as product inspiration for dense competitive analysis patterns such as compact metric tabs, ranking charts, filters and table density. This project does not scrape it, copy its CSS/HTML, or use its assets.

## Error Format

API errors follow this shape:

```json
{
  "error": true,
  "message": "Friendly message",
  "details": "Optional technical detail"
}
```

## Security Audit

Latest local audit in this round:

- Backend: `0 vulnerabilities`.
- Frontend: `2 moderate vulnerabilities`.
- Package path: `vite -> esbuild`.
- Advisory: esbuild development server exposure in affected versions.
- Recommendation: upgrade Vite/esbuild when a non-breaking path is acceptable.
- Not fixed automatically because `npm audit fix --force` would install `vite@8.0.14`, a breaking upgrade for this project.

## Known Limitations

- OpenDota remains the primary data source.
- No scraping is used.
- Hero images use public asset URLs associated with OpenDota/Steam CDN data.
- No private data is used.
- No database is used yet.
- Position is inferred by heuristic, not measured from real matches.
- Contest Rate and DotaMeta Rating are derived indicators, not official external metrics.
- Lane presence is planned and intentionally returns `null` until a reliable source is integrated.
- No STRATZ integration is active yet.
- Cache is local JSON and intended for local/portfolio use.

## Roadmap

- Integrate STRATZ GraphQL for real position data.
- Add patch and rank filters.
- Add temporal trend history.
- Add real pick/ban and lane advantage data.
- Add hero icons from a safe source.
- Add matchups.
- Add builds by position.
- Add counters, synergies and best allies.
- Add screenshots.
- Add deployment setup for Vercel/Render.
- Add frontend tests.

## Lessons Learned

- Public APIs are enough for a strong analytics MVP, but limitations must be visible.
- Derived endpoints keep frontend chart logic simple.
- A custom score is more useful when shown alongside raw data and sample reliability.
- Position labels must be treated carefully when the source only provides generic hero roles.

## Disclaimer

This project uses public OpenDota data and does not scrape STRATZ, Dota2ProTracker or any third-party website. STRATZ and Dota2ProTracker are product references only.
