FROM node:20
LABEL authors="Nikul"

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 6000

CMD ["node", "app.js"]
