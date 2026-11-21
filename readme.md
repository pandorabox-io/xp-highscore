
xp highscore board

![](https://github.com/BuckarooBanzay/xp-highscore/workflows/jshint/badge.svg)
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
