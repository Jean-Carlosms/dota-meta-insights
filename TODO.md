# TODO

## Phase 1 - Current MVP

- Keep OpenDota as the main public data source.
- Keep Meta Score, position heuristic, charts and hero details stable.
- Add real screenshots to `docs/screenshots`.
- Add endpoint integration tests.
- Add frontend component tests.

## Phase 2 - Deployment

- Prepare frontend deploy on Vercel.
- Prepare backend deploy on Render.
- Add production environment variable notes.
- Add deployment screenshots and live demo URL.
- Review CORS settings for deployed domains.

## Phase 3 - STRATZ GraphQL

- Integrate STRATZ GraphQL API with token configuration.
- Replace or validate position heuristic with real match-level position data.
- Add real lane advantage.
- Add real pick/ban contest rate.
- Add patch-aware queries.
- Add rank/bracket-aware queries.
- Keep OpenDota fallback behavior documented.

## Phase 4 - Advanced Analytics

- Create patch history.
- Add temporal trend analysis.
- Add trend charts.
- Add builds by position.
- Add hero icons from a safe source.
- Add matchups.
- Add counters, synergies and best allies.
- Compare Meta Score between periods.
- Persist historical data in SQLite or PostgreSQL.

## Phase 5 - Product Polish

- Run a controlled Vite/esbuild upgrade to resolve moderate audit findings.
- Improve chart code splitting further if needed.
- Add loading skeletons for charts and hero detail.
- Improve accessibility labels and keyboard focus states.
- Add a portfolio case-study section.
