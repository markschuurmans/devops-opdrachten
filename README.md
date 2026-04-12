# devops-opdrachten

[![Jest Code Coverage](https://github.com/markschuurmans/devops-opdrachten/actions/workflows/CI-API.yml/badge.svg)](https://github.com/markschuurmans/devops-opdrachten/actions/workflows/CI-API.yml)
[![Orders Service CI](https://github.com/markschuurmans/devops-opdrachten/actions/workflows/CI-ORDERS.yml/badge.svg)](https://github.com/markschuurmans/devops-opdrachten/actions/workflows/CI-ORDERS.yml)
[![Frontend CI](https://github.com/markschuurmans/devops-opdrachten/actions/workflows/CI-FRONTEND.yml/badge.svg)](https://github.com/markschuurmans/devops-opdrachten/actions/workflows/CI-FRONTEND.yml)

## Service status

- `api`: extern bereikbaar via frontend `/api`, bevat `GET /users` en `POST /users`, unittests aanwezig.
- `orders-service`: functionele downstream service met eigen database, bevat `GET /orders` en `POST /orders`, unittests aanwezig.
- `rabbitmq`: message queue voor inter-service communicatie (`user.created` queue).
- `prometheus` + `grafana`: live monitoring en dashboarding.

## Eisen checklist

- [x] Minstens 1 extern benaderbare functionele service met GET en POST (`api`).
- [x] Minstens 1 aanvullende functionele service gebruikt door bovenstaande service met eigen database (`orders-service` + `orders-mongodb`).
- [x] Minstens 1 unittest per functionele service (`api/__tests__`, `orders-service/__tests__`).
- [x] Services communiceren via message queue (`rabbitmq`, queue `user.created`).
- [x] Services draaien in Docker + Docker Compose (dev/prod).
- [x] Live monitoring aanwezig (`prometheus`).
- [x] Live dashboarding aanwezig (`grafana`).
- [x] CI aanwezig met tests en guideline checks per service (API, orders-service, frontend).

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
- `ORDERS_DB_NAME` (optioneel, default: `orders_db`)

> Voor Bunnyshell/Compose parser compatibiliteit valideren we deze prod-variabelen niet via `${VAR:?...}` in compose. Zet `PROD_DB_USER` en `PROD_DB_PASSWORD` daarom expliciet als environment variables in Bunnyshell.

Optioneel (voor poorten/routing):

- `API_PORT` (default dev: `5005`, prod: `3005`)
- `ORDERS_PORT` (default dev: `5010`, prod: `3010`)
- `FRONTEND_PORT` (default dev: `4200`, prod: `80`)
- `PROMETHEUS_PORT` (default: `9090`, alleen dev)
- `GRAFANA_PORT` (default: `3000`, alleen dev)
- `RABBITMQ_PORT` (default: `5672`)
- `RABBITMQ_MANAGEMENT_PORT` (default: `15672`)
- `FRONTEND_API_BASE_URL` (default: `/api`)

### 3) Persistent storage koppelen

Zorg dat named volumes persistent blijven tussen deploys:

- Dev: `mongo-dev-data`, `prometheus_data`
- Prod: `mongo-prod-data`
- Orders: `orders-mongo-dev-data` (dev), `orders-mongo-prod-data` (prod)

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

