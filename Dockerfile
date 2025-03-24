# syntax=docker/dockerfile:1

FROM node:22.14.0-alpine as base
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

FROM base as final

WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/ ./
RUN chown -R node:node /app
USER node

COPY .env .env

EXPOSE 5000

CMD ["sh", "-c", "pnpm run build && pnpm run dev"]