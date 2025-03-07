# syntax=docker/dockerfile:1

ARG NODE_VERSION=20.10.0

FROM node:${NODE_VERSION}-alpine as base
WORKDIR /app

# Install pnpm globally
RUN corepack enable && corepack prepare pnpm@latest --activate

FROM base as deps

RUN apk add --no-cache libc6-compat
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma
RUN pnpm install --frozen-lockfile --prod

FROM base as build

COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma
RUN pnpm install --frozen-lockfile

COPY . . 

RUN pnpm run build

FROM base as final

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/ ./
RUN chown -R node:node /app
USER node

COPY .env .env

RUN pnpm prisma migrate deploy
RUN pnpm prisma generate

EXPOSE 5000

CMD ["pnpm", "start"]