# Stage 1: test and build frontend
FROM node:24-alpine AS build

WORKDIR /data
COPY package.json package-lock.json ./
RUN npm ci

COPY tsconfig.json tsconfig.server.json vite.config.ts ./
COPY src src
COPY shared shared
COPY frontend frontend
RUN npm test && npm run build

# Stage 2: package
FROM node:24-alpine

ENV NODE_ENV=production
WORKDIR /data
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY src src
COPY shared shared
COPY --from=build /data/dist dist

USER node
EXPOSE 8080

CMD ["node", "src/index.ts"]
