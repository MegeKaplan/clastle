FROM node:22-alpine AS base

WORKDIR /app

COPY package*.json ./

RUN npm ci --include=dev

COPY . .


FROM base AS dev

EXPOSE 3000

CMD ["npm", "run", "dev"]


FROM base AS build

ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

RUN npm run build


FROM node:22-alpine AS prod

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./

RUN npm ci --omit=dev

COPY --from=build /app/public ./public
COPY --from=build /app/.next ./.next
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json

EXPOSE 3000

CMD ["npm", "start"]