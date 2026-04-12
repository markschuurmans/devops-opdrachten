# devops-opdrachten

[![Jest Code Coverage](https://github.com/markschuurmans/devops-opdrachten/actions/workflows/CI-API.yml/badge.svg)](https://github.com/markschuurmans/devops-opdrachten/actions/workflows/CI-API.yml)

## Frontend

De Angular frontend staat in `frontend/` en leest de API-locatie runtime uit `config.js`.

- Development default: `http://localhost:3005`
- Production default: `/api` (via NGINX reverse proxy naar `api:3005`)

### Development met hot reload

Start de complete stack:

```bash
docker compose -f docker-compose.dev.yml up --build
```

Frontend draait op `http://localhost:4200`.

### Production stack

Je kunt de client-API URL in productie aanpassen met `FRONTEND_API_BASE_URL`.

```bash
FRONTEND_API_BASE_URL="http://www.mijndevopsopdrachten.nl/api" docker compose -f docker-compose.prod.yml up --build -d
```

