FROM node:22-alpine AS base

WORKDIR /app

RUN apk add --no-cache netcat-openbsd

COPY package*.json ./

RUN npm install


FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY prisma ./prisma
COPY src ./src
COPY tsconfig*.json ./

RUN npx prisma generate

RUN npm run build


FROM base AS dev

WORKDIR /app

COPY prisma ./prisma
COPY src ./src
COPY tsconfig*.json ./

RUN npx prisma generate

COPY docker ./docker

EXPOSE 3001

ENTRYPOINT ["sh", "docker/entrypoint.sh"]

CMD ["npm", "run", "dev"]


FROM node:22-alpine AS prod

WORKDIR /app

RUN apk add --no-cache netcat-openbsd

COPY package*.json ./

RUN npm install --omit=dev

COPY prisma ./prisma
COPY prisma.config.ts ./prisma.config.ts

COPY --from=build /app/dist ./dist

COPY src ./src

RUN npx prisma generate

COPY docker ./docker

EXPOSE 3001

ENTRYPOINT ["sh", "docker/entrypoint.sh"]

CMD ["node", "dist/src/server.js"]