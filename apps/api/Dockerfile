FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app

FROM base AS builder
RUN corepack enable
COPY . .
RUN npx turbo prune api --docker

FROM base AS installer
RUN corepack enable
WORKDIR /app

COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml

RUN pnpm install --frozen-lockfile

COPY --from=builder /app/out/full/ .

RUN pnpm --filter=api exec prisma generate

RUN pnpm turbo build --filter=api

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=installer /app .

CMD ["node", "apps/api/dist/src/server.js"]