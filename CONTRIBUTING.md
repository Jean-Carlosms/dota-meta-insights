# Contributing

Thanks for checking out DotaMeta Insights.

## Install

```bash
npm run install:all
```

## Run Locally

```bash
npm run dev
```

Backend:

```bash
npm run dev:backend
```

Frontend:

```bash
npm run dev:frontend
```

## Test And Build

```bash
npm run check
```

Backend tests only:

```bash
npm run test
```

Frontend build only:

```bash
npm run build
```

## Commit Style

Suggested format:

```text
type(scope): short description
```

Examples:

```text
feat(frontend): add tier distribution chart
fix(api): handle invalid ranking metric
docs(readme): document position heuristic
```

## External Data

- OpenDota is the main public data source.
- Do not add unauthorized scraping.
- Do not scrape STRATZ, Dota2ProTracker or other third-party websites.
- Do not present inferred positions as real match position data.
- Keep future STRATZ integration behind explicit API/token configuration.
