# ── Stage 1: install all dependencies ───────────────────────
FROM node:20-alpine AS deps
# better-sqlite3 is a native addon and needs build tools
RUN apk add --no-cache python3 make g++
WORKDIR /app

COPY server/package*.json ./server/
RUN cd server && npm ci

COPY client/package*.json ./client/
RUN cd client && npm ci

# ── Stage 2: build the React client ─────────────────────────
FROM deps AS builder
COPY client/ ./client/
RUN cd client && npm run build

COPY server/ ./server/

# ── Stage 3: lean production image ──────────────────────────
FROM node:20-alpine AS production
WORKDIR /app

# Runtime needs python3/make/g++ too (better-sqlite3 native binding)
RUN apk add --no-cache python3 make g++

# Server source + pre-built node_modules (includes tsx, better-sqlite3)
COPY --from=builder /app/server/node_modules ./server/node_modules
COPY --from=builder /app/server/src           ./server/src
COPY --from=builder /app/server/package.json  ./server/package.json

# Built React SPA — served by Express in production
COPY --from=builder /app/client/dist ./client/dist

EXPOSE 4000
ENV NODE_ENV=production

CMD ["node", "server/node_modules/.bin/tsx", "server/src/server.ts"]
