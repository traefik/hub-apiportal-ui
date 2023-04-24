# Install dependencies
FROM node:18-alpine AS deps
WORKDIR /app
COPY package.json yarn.lock ./
ENV NODE_ENV=production
RUN yarn install --frozen-lockfile --production

# Build the source code
FROM node:18-alpine AS builder
WORKDIR /app
ENV NODE_ENV=production
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN NODE_OPTIONS=--max-old-space-size=2048 yarn build

# Put this into runner image
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT 3000
RUN npm install --global serve@14.2.0
COPY --from=builder /app/build ./
USER node
EXPOSE 3000
CMD ["serve"]