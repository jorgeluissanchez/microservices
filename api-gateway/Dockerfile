# Etapa base
FROM node:20-alpine AS base
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install -g pnpm && pnpm install

# Etapa desarrollo
FROM base AS development
WORKDIR /usr/src/app
COPY . .
CMD ["pnpm", "run", "start:dev"]
