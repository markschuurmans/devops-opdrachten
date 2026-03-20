# devops-api

- Week 1: Project setup, express met mongoDB, jest en eslint
- Week 2: CI met github actions


- Week 3: Docker
```bash
# Build dev image
docker build -f Dockerfile -t mijn-app:dev .
```
```bash
# Build prod image
docker build -f Dockerfile.prod -t mijn-app:prod .
```
```bash
# Run dev image
docker run -p 3005:3005 \
  --mount type=bind,source="$(pwd)",target=/app \
  mijn-app:dev
```
```bash
# Run prod image
docker run -p 3005:3005 mijn-app:prod
```