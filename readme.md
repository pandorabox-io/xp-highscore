
xp highscore board

![](https://github.com/BuckarooBanzay/xp-highscore/workflows/test/badge.svg)
![](https://github.com/BuckarooBanzay/xp-highscore/workflows/docker/badge.svg)


# Overview

TBD

* Docker-image: `buckaroobanzay/xphighscore`

```bash
export PGHOST=127.0.0.1
export PGUSER=postgres
export PGDATABASE=postgres
export PGPASSWORD=enter
export PGPORT=5432

```

# Development

Frontend: Vue 3 + TypeScript (vite), sources in `frontend/`, built into `dist/` which is served by the express backend in `src/`.

```bash
npm ci
npm run build   # build the frontend into dist/
npm start       # backend on :8080 (needs the PG* env vars above)
npm run dev     # vite dev server with hot reload, proxies /api to :8080
npm test        # jshint (backend) + vue-tsc (frontend)
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
