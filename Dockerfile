FROM node:lts-alpine

ENV PORT=80
ENV ENV=Production

WORKDIR /usr/src/app

COPY . .

RUN npm install

RUN cd ui && npm run build

RUN cd api && \
  npm run build && \
  mkdir -p dist/client && \
  cp -rf ../ui/dist/. dist/client

EXPOSE 80 443

WORKDIR /usr/src/app/api

ENTRYPOINT [ "npm", "run", "start:prod" ]
