# devops-opdrachten

[![Jest Code Coverage](https://github.com/markschuurmans/devops-opdrachten/actions/workflows/CI-API.yml/badge.svg)](https://github.com/markschuurmans/devops-opdrachten/actions/workflows/CI-API.yml)

## Frontend

De Angular frontend staat in `frontend/` en leest de API-locatie runtime uit `config.js`.

- Development default: `http://localhost:3005`
- Production default: `/api` (via NGINX reverse proxy naar `api:3005`)

> Let op: in de huidige dev compose draait de API standaard op `5005`.

### Development met hot reload

Start de complete stack:

```bash
docker compose -f docker-compose.dev.yml up --build
```

Frontend draait op `http://localhost:4200`.

Monitoring in development:

- Prometheus: `http://localhost:9090`
- Grafana: `http://localhost:3000`
- MongoDB metrics via `mongodb-exporter` (scraped by Prometheus)
- Provisioned dashboard: `MongoDB Overview`

### Production stack

Je kunt de client-API URL in productie aanpassen met `FRONTEND_API_BASE_URL`.

```bash
FRONTEND_API_BASE_URL="http://www.mijndevopsopdrachten.nl/api" docker compose -f docker-compose.prod.yml up --build -d
```

## Bunnyshell deployment handleiding

Onderstaande stappen werken voor zowel `docker-compose.dev.yml` als `docker-compose.prod.yml`.

### 1) Repo koppelen in Bunnyshell

1. Maak een nieuw project/environment in Bunnyshell.
2. Koppel je Git repository.
3. Kies als compose file:
   - `docker-compose.dev.yml` voor een complete omgeving met monitoring.
   - `docker-compose.prod.yml` voor een productiegerichte stack.

### 2) Environment variables instellen

Stel minimaal deze variabelen in binnen Bunnyshell:

- `MONGO_INITDB_ROOT_USERNAME` (dev) of `PROD_DB_USER` (prod)
- `MONGO_INITDB_ROOT_PASSWORD` (dev) of `PROD_DB_PASSWORD` (prod)
- `DB_NAME` (optioneel, default: `devops_opdrachten`)

Optioneel (voor poorten/routing):

- `API_PORT` (default dev: `5005`, prod: `3005`)
- `FRONTEND_PORT` (default dev: `4200`, prod: `80`)
- `PROMETHEUS_PORT` (default: `9090`, alleen dev)
- `GRAFANA_PORT` (default: `3000`, alleen dev)
- `FRONTEND_API_BASE_URL` (default: `/api`)

### 3) Persistent storage koppelen

Zorg dat named volumes persistent blijven tussen deploys:

- Dev: `mongo-dev-data`, `prometheus_data`
- Prod: `mongo-prod-data`

### 4) Externe endpoints in Bunnyshell

Maak routes/public endpoints aan naar:

- `frontend` service (hoofdapp)
- Optioneel in dev:
  - `grafana` voor dashboards
  - `prometheus` voor targets/queries

### 5) Deployen

1. Trigger een deploy vanuit Bunnyshell.
2. Wacht tot healthchecks groen zijn.
3. Controleer functioneel:
   - Frontend laadt.
   - API werkt via `/api`.
   - (Dev) Prometheus target `mongodb-exporter` staat op `UP`.
   - (Dev) Grafana dashboards tonen data.

### 6) Veelvoorkomende issues

- **Lege Grafana panelen:** controleer datasource UID `prometheus` en exporter metrics in Prometheus.
- **API kan Mongo niet bereiken:** controleer credentials/DB-naam variabelen.
- **Frontend kan API niet bereiken:** zet `FRONTEND_API_BASE_URL` op `/api` of juiste externe URL.

