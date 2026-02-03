# Stage 1: Build Frontend
FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend

COPY frontend/package.json frontend/package-lock.json ./
RUN npm install --legacy-peer-deps

COPY frontend/ .
RUN npm run build

# Stage 2: Setup Deno App
FROM denoland/deno:2.6.8

WORKDIR /app

# Copy Deno configuration and lock file
# Note: deno.lock is copied if it exists, otherwise this might fail if strictly required, 
# but we confirmed it exists via ls
COPY deno.json deno.lock ./

# Copy source code
COPY app/ ./app/
COPY core/ ./core/
COPY scripts/ ./scripts/
COPY drizzle.config.ts ./

# Copy built frontend assets
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# cache the server entry point and migration script to pre-load dependencies
RUN deno cache app/server.ts scripts/migrate.ts

# Run db migration
RUN deno task db:migrate

EXPOSE 8000

# start the server
CMD ["/bin/sh", "-c", "deno task start"]
