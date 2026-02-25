# Build stage
FROM node:20-bullseye-slim AS build
WORKDIR /app

RUN apt-get update && apt-get install -y openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm ci

COPY prisma ./prisma
COPY src ./src
COPY tsconfig.json ./

# Generate Prisma client (important!)
RUN npx prisma generate

# Build TS -> dist
RUN npm run build


# Runtime stage
FROM node:20-bullseye-slim
WORKDIR /app
ENV NODE_ENV=production

RUN apt-get update && apt-get install -y openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

# Copy deps from build stage (keeps generated Prisma client)
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package*.json ./
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma

EXPOSE 8080
CMD ["node", "dist/server.js"]
