FROM node:20-alpine as base

RUN npm install -g pnpm

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml ./

# Development stage
FROM base as development

RUN pnpm install --frozen-lockfile

COPY package.json pnpm-lock.yaml ./

EXPOSE 3002

# Production stage
FROM base as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

RUN pnpm install --prod --frozen-lockfile

COPY --from=development /usr/src/app/dist ./dist
COPY --from=development /usr/src/app/package.json ./package.json

EXPOSE 3002

CMD [ "node", "dist/main" ]
