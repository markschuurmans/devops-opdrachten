# orders-service

Functionele service met eigen database voor order- en eventopslag.

## Endpoints

- `GET /orders`
- `POST /orders`

## Queue consumer

Consumeert `user.created` events van RabbitMQ en slaat die op in de `orders` collectie als event-records.

## Scripts

- `npm run dev`
- `npm test`
- `npm run lint`

