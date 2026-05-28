FROM node:lts-alpine AS builder
WORKDIR /usr/src/app
COPY . .
RUN npm install && \
    npm --prefix ui run build && \
    npm --prefix api run build && \
    mkdir -p api/dist/client && \
    cp -rf ui/dist/. api/dist/client && \
    npm prune --omit=dev

FROM node:lts-alpine
ENV PORT=80
ENV ENV=Production
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/api/node_modules ./api/node_modules
COPY --from=builder /usr/src/app/api/dist ./api/dist
COPY --from=builder /usr/src/app/api/package.json ./api/package.json
COPY --from=builder /usr/src/app/lib ./lib
COPY --from=builder /usr/src/app/package.json ./package.json
EXPOSE 80 443
USER node
WORKDIR /usr/src/app/api
ENTRYPOINT [ "npm", "run", "start:prod" ]
