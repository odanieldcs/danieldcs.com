# dependencies
FROM node:22.16.0-alpine AS dependencies
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN apk add --no-cache libc6-compat \
    && npm install -g pnpm@10.8.1 \
    && pnpm install --frozen-lockfile \
    && chown -R node:node /app
USER node

# build
FROM node:22.16.0-alpine AS build
WORKDIR /app
COPY . .
COPY --from=dependencies /app/node_modules ./node_modules
RUN npm install -g pnpm@10.8.1 \
    && pnpm run build

# final stage
FROM node:22.16.0-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY package.json pnpm-lock.yaml ./
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=build /app/build ./build
RUN chown -R node:node /app
USER node
CMD ["npm", "start"]