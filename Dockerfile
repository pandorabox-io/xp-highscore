# Stage 1: test and build frontend
FROM node:24-alpine AS build

WORKDIR /data
COPY package.json package-lock.json ./
RUN npm ci

COPY .jshintrc tsconfig.json vite.config.ts ./
COPY src src
COPY frontend frontend
RUN npm test && npm run build

# Stage 2: package
FROM node:24-alpine

WORKDIR /data
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY src src
COPY --from=build /data/dist dist

EXPOSE 8080

CMD ["node", "src/index.js"]
