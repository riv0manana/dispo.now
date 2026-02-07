# Stage 1: Build Frontend
FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend

COPY frontend/package.json frontend/package-lock.json ./
RUN npm install --legacy-peer-deps

COPY frontend/ .
RUN npm run build

# Stage 2: Setup Deno App
FROM denoland/deno:alpine

# Create non-root user (Alpine syntax)
RUN addgroup -S appuser && adduser -S appuser -G appuser

WORKDIR /app

# Ensure Deno cache directory exists and is writable by appuser
ENV DENO_DIR=/deno-dir
RUN mkdir -p /deno-dir && chown -R appuser:appuser /deno-dir

# Copy Deno configuration and lock file
COPY --chown=appuser:appuser deno.json deno.lock ./

# Copy source code
COPY --chown=appuser:appuser app/ ./app/
COPY --chown=appuser:appuser core/ ./core/
COPY --chown=appuser:appuser scripts/ ./scripts/
COPY --chown=appuser:appuser drizzle.config.ts ./

# Copy built frontend assets
COPY --chown=appuser:appuser --from=frontend-builder /app/frontend/dist ./frontend/dist


# Switch to appuser before caching
USER appuser

# Cache dependencies
RUN deno cache app/server.ts scripts/migrate.ts

EXPOSE 8000

# start the server
CMD ["/bin/sh", "-c", "deno task db:migrate && deno task start:prod"]
