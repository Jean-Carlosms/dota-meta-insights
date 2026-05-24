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
  - Top 10 heroes by Meta Score.
  - Top 10 heroes by Win Rate with minimum match volume.
  - Tier distribution.
  - Best hero by inferred position.
- Hero detail page at `/heroes/:heroId`.
- Backend helper endpoints for rankings, positions, tiers and hero lookup.
- `confidenceScore` and `sampleSizeLabel` to communicate sample reliability.
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

- `metric=metaScore|winRate|pickRate|matches`
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
- No private data is used.
- No database is used yet.
- Position is inferred by heuristic, not measured from real matches.
- No STRATZ integration is active yet.
- Cache is local JSON and intended for local/portfolio use.

## Roadmap

- Integrate STRATZ GraphQL for real position data.
- Add patch and rank filters.
- Add temporal trend history.
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
