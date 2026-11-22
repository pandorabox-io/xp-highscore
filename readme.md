
xp highscore board

![](https://github.com/pandorabox-io/xp-highscore/workflows/test/badge.svg)
![](https://github.com/pandorabox-io/xp-highscore/workflows/docker/badge.svg)


# Overview

TBD

* Docker-image: `ghcr.io/pandorabox-io/xp-highscore`

```bash
export PGHOST=127.0.0.1
export PGUSER=postgres
export PGDATABASE=postgres
export PGPASSWORD=enter
export PGPORT=5432

```

# Development

Frontend: Vue 3 + TypeScript (vite), sources in `frontend/`, built into `dist/` which is served by the express backend in `src/`.

Backend: TypeScript, executed directly by node (native type stripping, no build step). Only erasable syntax is allowed (no `enum`, `namespace` or parameter properties).

Types shared by backend and frontend (the API contract) live in `shared/` and are imported via `#shared/types.ts`.

```bash
npm ci
npm run build   # build the frontend into dist/
npm start       # backend on :8080 (needs the PG* env vars above)
npm run dev     # vite dev server with hot reload, proxies /api to :8080
npm test        # typecheck backend (tsc) and frontend (vue-tsc)
```

# Local testing

Starts a postgres database seeded with test data (`test-data/*.sql`) and the app:

```bash
docker compose up --build
# open http://127.0.0.1:8080
```

The test data is imported only when the database is empty. To reset and re-import it:

```bash
docker compose down -v
```
