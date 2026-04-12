# Demoscript devops-opdrachten

Dit script helpt je om in ongeveer 8-10 minuten alle beoordelingscriteria live te demonstreren.

## 0) Doel en context (30 sec)

Vertel kort:

- Er is een extern benaderbare functionele service (`api`) met `GET` en `POST`.
- Er is een tweede functionele service (`orders-service`) met eigen database.
- Services communiceren via RabbitMQ (`user.created` queue).
- De stack draait in Docker Compose met monitoring (Prometheus) en dashboarding (Grafana).
- CI draait per service en de status staat in `README.md`.

## 1) Stack starten (1 min)

```bash
docker compose -f docker-compose.dev.yml up --build -d
docker compose -f docker-compose.dev.yml ps
```

Verwacht:

- `api`, `orders-service`, `mongodb`, `orders-mongodb`, `rabbitmq`, `prometheus`, `grafana` draaien.

## 2) Extern benaderbare service met GET + POST (2 min)

### 2.1 GET op API

```bash
curl -s http://localhost:5005/users
```

### 2.2 POST op API

```bash
curl -s -X POST http://localhost:5005/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Mark","role":"student"}'
```

### 2.3 GET opnieuw

```bash
curl -s http://localhost:5005/users
```

Vertel erbij:

- Dit toont de functionele service met minimaal een GET en POST endpoint.
- Code staat in `api/routes/users.js`.

## 3) Tweede functionele service met eigen database (2 min)

### 3.1 GET op orders-service

```bash
curl -s http://localhost:5010/orders
```

### 3.2 POST op orders-service

```bash
curl -s -X POST http://localhost:5010/orders \
  -H "Content-Type: application/json" \
  -d '{"item":"pen","quantity":2}'
```

### 3.3 GET opnieuw

```bash
curl -s http://localhost:5010/orders
```

Vertel erbij:

- `orders-service` is een aparte functionele service.
- Deze gebruikt een eigen database (`orders-mongodb`).
- Relevante code: `orders-service/routes/orders.js`, `orders-service/services/database.js`.

## 4) Message queue communicatie aantonen (2 min)

### 4.1 Trigger event via API

```bash
curl -s -X POST http://localhost:5005/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Queue Demo","role":"producer"}'
```

### 4.2 Controleer consumer-resultaat in orders-service

```bash
curl -s http://localhost:5010/orders
```

Optioneel extra zichtbaar maken met logs:

```bash
docker compose -f docker-compose.dev.yml logs --tail=100 api
docker compose -f docker-compose.dev.yml logs --tail=100 orders-service
```

Vertel erbij:

- `api` publiceert op RabbitMQ queue `user.created`.
- `orders-service` consumeert dit event en slaat het op.
- Relevante code: `api/services/messageQueue.js`, `orders-service/services/messageQueue.js`.

## 5) Monitoring en dashboarding (1-2 min)

Open in browser:

- Prometheus: `http://localhost:9090`
- Grafana: `http://localhost:3000`
- RabbitMQ management (optioneel): `http://localhost:15672`

Laat zien:

- In Prometheus onder Targets staan services op `UP`.
- In Grafana is een geprovisioneerd dashboard beschikbaar met live data.

## 6) Unittests en CI aantonen (1-2 min)

### 6.1 Lokale tests/lint per functionele service

```bash
cd api
npm test
npm run lint
cd ..
```

```bash
cd orders-service
npm test
npm run lint
cd ..
```

### 6.2 CI status

- Toon badges in `README.md`.
- Toon workflows in `.github/workflows/`:
  - `CI-API.yml`
  - `CI-ORDERS.yml`
  - `CI-FRONTEND.yml`

## 7) Afsluiting (30 sec)

Concludeer kort:

- Eisen voor services, tests, messaging, Docker Compose, monitoring/dashboarding en CI zijn afgedekt.
- Data is gescheiden via volumes in compose.
- Deployment naar omgevingen (prod/acceptatie) kan in Bunnyshell volgens `README.md`.

## Snelle fallback bij issues

```bash
docker compose -f docker-compose.dev.yml ps
docker compose -f docker-compose.dev.yml logs --tail=100 api
docker compose -f docker-compose.dev.yml logs --tail=100 orders-service
docker compose -f docker-compose.dev.yml logs --tail=100 rabbitmq
```

