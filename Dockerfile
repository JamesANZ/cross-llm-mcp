# better-sqlite3 is a native module. postinstall also edits a local Claude
# config, so scripts stay disabled and only better-sqlite3 is rebuilt.
FROM node:22.17-bookworm AS build

RUN apt-get update \
 && apt-get install -y --no-install-recommends python3 make g++ \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

COPY tsconfig.json ./
COPY src ./src
RUN npm run build && npm rebuild better-sqlite3 && npm prune --omit=dev

FROM node:22.17-bookworm-slim AS runtime

WORKDIR /app

ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=3000 \
    MCP_ENTRY=build/index.js

COPY package.json package-lock.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/build ./build
COPY http-bridge.mjs ./http-bridge.mjs

USER node

EXPOSE 3000

CMD ["node", "http-bridge.mjs"]
