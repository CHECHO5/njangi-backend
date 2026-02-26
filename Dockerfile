# Build stage
FROM node:20-bookworm-slim AS build
WORKDIR /app

RUN apt-get update && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm ci

COPY prisma ./prisma
COPY src ./src
COPY tsconfig.json ./

# Generate Prisma client for the build environment (safe)
RUN npx prisma generate

RUN npm run build

# Runtime stage
FROM node:20-bookworm-slim
WORKDIR /app

RUN apt-get update && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*
ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev

# Prisma schema must exist before we generate the client in runtime image
COPY --from=build /app/prisma ./prisma
RUN npx prisma generate

COPY --from=build /app/dist ./dist

EXPOSE 8080
CMD ["node", "dist/server.js"]
