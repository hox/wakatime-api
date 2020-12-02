FROM node:alpine

LABEL org.opencontainers.image.source https://github.com/hox/wakatime-api

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install && npm install typescript@latest -g

COPY . .

RUN tsc

CMD ["node", "./dist/index.js"]