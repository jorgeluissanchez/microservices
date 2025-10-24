# Etapa base
FROM node:20-alpine AS base
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install -g pnpm

# Etapa build
FROM base AS build
ENV NODE_ENV=development
ENV CI=true
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm run build

# Etapa final
FROM node:20-alpine AS production
WORKDIR /usr/src/app
ENV NODE_ENV=production
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY package*.json ./
CMD ["node", "dist/main.js"]
