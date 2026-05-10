# syntax=docker/dockerfile:1.7

FROM node:22.18-bookworm-slim AS base
WORKDIR /app
ENV CI=1

FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund --legacy-peer-deps
COPY server/package.json server/package-lock.json* ./server/
RUN cd server && npm install --no-audit --no-fund

FROM deps AS build
COPY . .
RUN npm run build:prod \
 && rm -rf server/public \
 && mkdir -p server/public \
 && cp -r dist/grocy-meal-planning/browser/. server/public/ \
 && cd server && npm run build

FROM node:22.18-bookworm-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production \
    NITRO_PORT=3000 \
    NITRO_HOST=0.0.0.0
COPY --from=build /app/server/.output ./.output
COPY --from=build /app/server/public ./public
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
