FROM node:20

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

ENV PORT=3005
ENV MONGO_URL=mongodb://localhost:27000
ENV DB_NAME=devops_opdrachten

EXPOSE 12345

CMD ["npm", "start"]
