FROM node:18-alpine as base

RUN npm install -g pnpm

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

FROM base as development

RUN pnpm install --frozen-lockfile

COPY . .

EXPOSE 3000

CMD ["pnpm", "run", "start:dev"]

FROM base as production

RUN pnpm install --prod --frozen-lockfile

COPY . .

RUN pnpm run build

EXPOSE 3000

CMD ["pnpm", "run", "start:prod"]
