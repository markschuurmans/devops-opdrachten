FROM node:20-slim
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

ENV PORT=5010

EXPOSE 5010

CMD ["npm", "run", "dev"]

