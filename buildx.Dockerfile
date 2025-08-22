# syntax=docker/dockerfile:1.17
# Portal UI dependencies
FROM node:22-alpine AS portal-ui-deps

WORKDIR /app

RUN corepack enable

COPY package.json yarn.lock .yarnrc.yml ./

RUN yarn workspaces focus --all --production

# Portal UI build
FROM node:22-alpine AS portal-ui-builder

WORKDIR /app

COPY --from=portal-ui-deps /app/node_modules ./node_modules
COPY . .

RUN corepack enable &&\
    yarn build

FROM scratch AS portal-ui-export

COPY --from=portal-ui-builder /app/dist dist
COPY --from=portal-ui-deps /app/yarn.lock .
